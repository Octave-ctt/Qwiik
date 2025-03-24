import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

// Utiliser la clé publique Stripe depuis les variables d'environnement ou la variable globale
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || window.STRIPE_PUBLIC_KEY || 'pk_live_51R48HiBD1jNEQIjBKEt8E1pNwyupyqIfZQkvx0yYB1n3BR849TTNNHU6E3Ryk4mwuqDcc3912o8Ke3zhPvpWujet008AgI4VyT';
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
      // Utiliser l'edge function Supabase pour créer la session Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          lineItems,
          userId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/cart`,
          stripeKey: stripePublicKey,
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Erreur Stripe:', error);
      
      // Fallback vers l'ancien système si l'edge function échoue
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            lineItems,
            userId,
            successUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/cart`,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la création de la session Stripe');
        }
        
        const { sessionId, url } = await response.json();
        return { sessionId, url };
      } catch (fallbackError) {
        console.error('Erreur fallback Stripe:', fallbackError);
        throw fallbackError;
      }
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

    if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
      // En mode développement, simuler la redirection
      console.log('Redirection vers Stripe avec session ID:', sessionId);
      // Simuler la redirection vers Stripe en redirigeant vers la page de succès
      setTimeout(() => {
        window.location.href = '/payment/success';
      }, 1500);
    } else {
      // En production, rediriger réellement vers Stripe
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Erreur lors de la redirection vers Stripe:', error);
        throw error;
      }
    }
  },

  /**
   * Met à jour le statut d'une commande après paiement
   */
  updateOrderStatus: async (orderId: string, status: 'completed' | 'cancelled'): Promise<void> => {
    try {
      // En mode développement, simplement simuler la mise à jour
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        console.log(`Mise à jour du statut de la commande ${orderId} à ${status}`);
        
        // Si la commande est terminée, simuler le vidage du panier
        if (status === 'completed') {
          console.log('Panier vidé après commande réussie');
          localStorage.removeItem('cart');
        }
      } else {
        // En production, mettre à jour la commande dans Supabase
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
          
        if (error) {
          throw error;
        }
        
        // Si la commande est terminée, vider le panier
        if (status === 'completed') {
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }
};

export default StripeService;
