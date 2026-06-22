import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing Stripe signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    console.log("Received event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        await supabase.from("payments").insert({
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          amount_total: session.amount_total,
          status: "completed",
        });

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object;

        await supabase.from("subscriptions").upsert({
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer,
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;

        await supabase.from("subscriptions").update({
          status: "canceled",
        }).eq("stripe_subscription_id", sub.id);

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;

        await supabase.from("invoices").insert({
          stripe_invoice_id: invoice.id,
          stripe_customer_id: invoice.customer,
          amount_paid: invoice.amount_paid,
          status: "paid",
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;

        await supabase.from("invoices").insert({
          stripe_invoice_id: invoice.id,
          stripe_customer_id: invoice.customer,
          amount_due: invoice.amount_due,
          status: "failed",
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
});
