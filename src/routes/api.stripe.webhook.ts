import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!stripeKey || !webhookSecret) {
          return new Response("Stripe not configured", { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 400 });

        const body = await request.text();

        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            webhookSecret
          );
        } catch (err) {
          const msg = err instanceof Error ? err.message : "invalid";
          return new Response(`Webhook signature verification failed: ${msg}`, {
            status: 400,
          });
        }

        try {
          if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const requestId = session.metadata?.access_request_id;
            const amountTotal = session.amount_total ?? 0;

            if (requestId) {
              await supabaseAdmin
                .from("access_requests")
                .update({
                  payment_status: "paid",
                  price_paid: amountTotal / 100,
                  stripe_session_id: session.id,
                })
                .eq("id", requestId);
            }
          } else if (event.type === "payment_intent.payment_failed") {
            const intent = event.data.object as Stripe.PaymentIntent;
            const requestId = intent.metadata?.access_request_id;
            if (requestId) {
              await supabaseAdmin
                .from("access_requests")
                .update({ payment_status: "failed" })
                .eq("id", requestId);
            }
          }
        } catch (err) {
          console.error("Webhook handler error:", err);
          return new Response("Handler error", { status: 500 });
        }

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
