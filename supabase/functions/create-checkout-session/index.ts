
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Pour utiliser cette fonction, il faut définir ces variables d'environnement dans votre projet Supabase
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
    // Récupérer les données de la requête
    const { lineItems, userId, successUrl, cancelUrl } = await req.json();
    
    // Vérifier que toutes les données nécessaires sont présentes
    if (!lineItems || !successUrl || !cancelUrl) {
      throw new Error("Données manquantes pour créer la session Stripe");
    }

    // Initialiser Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Créer une session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
    });
    
    // Initialiser le client Supabase pour enregistrer la session
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Enregistrer la session dans la base de données (si nécessaire)
    // Vous pourriez vouloir créer une table "stripe_sessions" pour suivre ces sessions
    // const { error } = await supabase.from("stripe_sessions").insert({
    //   session_id: session.id,
    //   user_id: userId,
    //   amount_total: session.amount_total,
    //   created_at: new Date().toISOString(),
    // });
    // 
    // if (error) {
    //   console.error("Erreur d'enregistrement de la session:", error);
    // }

    // Retourner les informations de la session au client
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
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erreur:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 400,
      }
    );
  }
});
