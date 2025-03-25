
// create-checkout-session/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

serve(async (req) => {
  // Gérer les requêtes OPTIONS (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Vérifier si la clé Stripe est configurée
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY n'est pas configurée dans les variables d'environnement");
    }

    // Initialiser Stripe avec la clé secrète
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });

    // Récupérer les données du panier depuis la requête
    const { lineItems, userId, successUrl, cancelUrl, metadata } = await req.json();

    // Vérifier que les données nécessaires sont présentes
    if (!lineItems || !successUrl || !cancelUrl) {
      throw new Error("Données manquantes pour créer la session Stripe");
    }

    // Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || "",
        ...metadata
      }
    });

    // Retourner l'URL de paiement au client
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Erreur Stripe:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Une erreur s'est produite lors de la création de la session de paiement",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      }
    );
  }
});
