import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import Stripe from "stripe";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const inputSchema = z.object({
  request_id: z.string().uuid(),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return { error: "Stripe is not configured.", url: null as string | null };
    }

    const { supabase, userId } = context;

    // Verify the request belongs to this user and is approved
    const { data: req, error: reqErr } = await supabase
      .from("access_requests")
      .select("id, user_id, property_id, status, payment_status")
      .eq("id", data.request_id)
      .maybeSingle();

    if (reqErr || !req) return { error: "Request not found.", url: null };
    if (req.user_id !== userId) return { error: "Not authorised.", url: null };
    if (req.status !== "approved")
      return { error: "Request not approved yet.", url: null };
    if (req.payment_status === "paid")
      return { error: "Already paid.", url: null };

    // Look up pricing & property name (use admin to avoid RLS issues on join)
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id, name, pricing(amount, currency)")
      .eq("id", req.property_id)
      .maybeSingle();

    const pricing = (property?.pricing as { amount: number; currency: string } | null) ?? null;
    if (!pricing || !pricing.amount) {
      return { error: "No pricing set for this property.", url: null };
    }

    const stripe = new Stripe(stripeKey);

    const host = getRequestHost();
    const proto = host?.includes("localhost") ? "http" : "https";
    const origin = `${proto}://${host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: pricing.currency.toLowerCase(),
            product_data: { name: `Passage · ${property?.name ?? "Property"}` },
            unit_amount: Math.round(Number(pricing.amount) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/my-requests?payment=success`,
      cancel_url: `${origin}/my-requests?payment=cancelled`,
      metadata: {
        access_request_id: req.id,
        property_id: req.property_id,
        visitor_id: userId,
      },
    });

    // Store the session ID immediately for reference
    await supabaseAdmin
      .from("access_requests")
      .update({ stripe_session_id: session.id })
      .eq("id", req.id);

    return { url: session.url, error: null as string | null };
  });
