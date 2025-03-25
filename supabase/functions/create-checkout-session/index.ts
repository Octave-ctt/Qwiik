// create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2022-11-15",
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1R6VTXBD1jNEQIjBftu8OubN", // ton vrai ID Stripe
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://qwiik.lovable.app/success",
    cancel_url: "https://qwiik.lovable.app/cancel",
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" },
  });
});

