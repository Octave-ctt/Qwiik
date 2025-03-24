
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Variables d'environnement de Supabase
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
// Clé secrète de Stripe
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";

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

    let secretKey = STRIPE_SECRET_KEY;
    
    // Si la clé n'est pas définie dans les variables d'environnement, essayer de la récupérer depuis Supabase
    if (!secretKey) {
      // Initialiser le client Supabase
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'STRIPE_SECRET_KEY')
        .single();

      if (!secretError && secretData) {
        secretKey = secretData.value;
        console.log("Clé Stripe récupérée depuis la table secrets");
      } else {
        throw new Error("Clé Stripe non trouvée");
      }
      
      // Enregistrer la session dans Supabase
      if (userId) {
        await supabase
          .from("orders")
          .insert({
            user_id: userId,
            session_id: Date.now().toString(),
            status: 'pending',
            amount_total: 0, // Sera mis à jour avec le montant réel
            created_at: new Date().toISOString(),
          });
      }
    }

    // Vérifier qu'une clé Stripe a été trouvée
    if (!secretKey) {
      throw new Error("Impossible de récupérer la clé secrète Stripe");
    }

    // Initialiser Stripe avec la clé récupérée
    const stripe = new Stripe(secretKey, {
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
      JSON.stringify({
        error: error.message,
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
