
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

    // Initialiser le client Supabase pour récupérer la clé Stripe
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Tenter de récupérer la clé Stripe depuis les variables d'environnement ou Supabase
    let secretKey = STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      console.log("Récupération de la clé Stripe depuis la table secrets");
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'STRIPE_SECRET_KEY')
        .single();

      if (secretError) {
        console.error("Erreur lors de la récupération de la clé:", secretError.message);
        throw new Error("Impossible de récupérer la clé Stripe");
      }
      
      if (secretData) {
        secretKey = secretData.value;
        console.log("Clé Stripe récupérée avec succès");
      }
    }
    
    // Vérifier qu'une clé a été trouvée
    if (!secretKey) {
      throw new Error("Aucune clé Stripe trouvée. Veuillez configurer STRIPE_SECRET_KEY dans les variables d'environnement ou dans la table secrets.");
    }

    // Initialiser Stripe avec la clé récupérée
    const stripe = new Stripe(secretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Créer une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || "",
      },
    });

    // En cas de succès, enregistrer la commande dans Supabase si un userId est fourni
    if (userId) {
      try {
        await supabase
          .from("orders")
          .insert({
            user_id: userId,
            session_id: session.id,
            status: 'pending',
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
            created_at: new Date().toISOString(),
          });
        console.log("Commande enregistrée avec succès");
      } catch (orderError) {
        console.error("Erreur lors de l'enregistrement de la commande:", orderError);
        // On continue même si l'enregistrement échoue
      }
    }

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
