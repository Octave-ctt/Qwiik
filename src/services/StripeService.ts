
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

// Utiliser la clé publique Stripe depuis les variables d'environnement
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || window.STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const StripeService = {
  /**
   * Crée une session de checkout Stripe
   */
  createCheckoutSession: async (items: CartItem[], userId: string): Promise<CheckoutSessionResponse> => {
    // Formater les produits pour Stripe
    const lineItems = items.map(({ product, quantity }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(product.price * 100), // Prix en centimes
      },
      quantity,
    }));

    try {
      // Créer une commande dans Supabase avec le statut "pending"
      const total = items.reduce((sum, { product, quantity }) => sum + (product.price * quantity), 0);
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          status: 'pending',
          total
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Ajouter les éléments de la commande
      const orderItems = items.map(({ product, quantity }) => ({
        order_id: orderData.id,
        product_id: product.id,
        quantity,
        price: product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;

      // En mode développement ou en test, utiliser le serveur mock
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        console.log('Mode développement détecté - simulation du paiement Stripe');
        const mockResponse = await StripeService.simulateBackendCheckout(items, orderData.id);
        
        return mockResponse;
      }

      // En production, appeler l'API backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lineItems,
          orderId: orderData.id,
          userId
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la session de paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur Stripe:', error);
      throw error;
    }
  },

  /**
   * Redirige l'utilisateur vers la page de paiement Stripe
   */
  redirectToCheckout: async (sessionId: string): Promise<void> => {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe n\'a pas pu être initialisé');
    }

    // En mode développement, simuler la redirection
    if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
      console.log('Redirection vers Stripe avec session ID:', sessionId);
      // Simuler la redirection vers Stripe en redirigeant vers la page de succès
      setTimeout(() => {
        window.location.href = '/payment/success';
      }, 1500);
      return;
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Erreur de redirection Stripe:', error);
      throw error;
    }
  },

  /**
   * Simule un backend pour la création de session Stripe en mode développement
   */
  simulateBackendCheckout: async (items: CartItem[], orderId: string): Promise<CheckoutSessionResponse> => {
    // Cette fonction simule ce qui se passerait côté serveur
    // En production, cela serait géré par votre serveur backend
    
    // Simulation de traitement de commande
    console.log('Éléments à acheter:', items);
    
    return {
      sessionId: `session_${Date.now()}`,
      url: `/payment/success?session_id=${Date.now()}&order_id=${orderId}`, // Rediriger vers notre page de succès interne
    };
  },

  /**
   * Met à jour le statut d'une commande après paiement
   */
  updateOrderStatus: async (orderId: string, status: 'completed' | 'cancelled'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Si la commande est terminée, vider le panier
      if (status === 'completed') {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('user_id')
          .eq('id', orderId)
          .single();
        
        if (orderError) throw orderError;
        
        // Vider le panier de l'utilisateur
        const { error: cartError } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', orderData.user_id);
        
        if (cartError) throw cartError;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }
};
