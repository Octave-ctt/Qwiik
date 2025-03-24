
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
    const { lineItems, userId, successUrl, cancelUrl, metadata } = await req.json();
    
    // Vérifier que toutes les données nécessaires sont présentes
    if (!lineItems || !successUrl || !cancelUrl) {
      throw new Error("Données manquantes pour créer la session Stripe");
    }

    // Initialiser le client Supabase pour récupérer la clé Stripe
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Tenter de récupérer la clé Stripe depuis les variables d'environnement
    let secretKey = STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      console.error("ERREUR: Clé Stripe manquante dans les variables d'environnement");
      throw new Error("Configuration Stripe manquante. Veuillez définir STRIPE_SECRET_KEY dans les variables d'environnement.");
    } else {
      console.log("Clé Stripe trouvée dans les variables d'environnement");
    }

    // Initialiser Stripe avec la clé récupérée
    const stripe = new Stripe(secretKey, {
      apiVersion: "2022-11-15",
      httpClient: Stripe.createFetchHttpClient(),
    });

    console.log("Création d'une session Stripe");
    console.log("Produits:", lineItems.length);
    
    // Extraire les informations des articles pour la base de données
    const orderItems = lineItems.map(item => ({
      product_id: item.price_data?.product_data?.metadata?.productId,
      name: item.price_data?.product_data?.name,
      quantity: item.quantity,
      price: Number(item.price_data?.unit_amount) / 100,
      image: item.price_data?.product_data?.images?.[0] || ''
    }));

    // Calculer le total de la commande
    const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Créer une session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || "",
        ...metadata
      },
    });

    console.log("Session Stripe créée avec succès:", session.id);

    // En cas de succès, enregistrer la commande dans Supabase si un userId est fourni
    if (userId) {
      try {
        console.log("Enregistrement de la commande pour l'utilisateur:", userId);
        // Créer une nouvelle commande
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            session_id: session.id,
            status: 'pending',
            total: orderTotal,
            delivery_address: metadata?.deliveryAddress || null,
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (orderError) {
          console.error("Erreur lors de l'enregistrement de la commande:", orderError);
          // On continue même si l'enregistrement échoue
        } else if (orderData && orderData.id) {
          console.log("Commande enregistrée avec l'ID:", orderData.id);
          
          // Enregistrer les éléments de la commande
          const orderItemsWithOrderId = orderItems.map(item => ({
            order_id: orderData.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsWithOrderId);

          if (itemsError) {
            console.error("Erreur lors de l'enregistrement des articles de commande:", itemsError);
          } else {
            console.log("Articles de commande enregistrés avec succès");
          }
        }
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
