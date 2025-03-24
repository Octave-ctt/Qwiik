
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

// Utiliser la clé publique Stripe depuis les variables d'environnement ou la variable globale
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || window.STRIPE_PUBLIC_KEY || 'pk_test_51R48HiBD1jNEQIjBKEt8E1pNwyupyqIfZQkvx0yYB1n3BR849TTNNHU6E3Ryk4mwuqDcc3912o8Ke3zhPvpWujet008AgI4VyT';
const stripePromise = loadStripe(stripePublicKey);

// URL correcte de la fonction Edge Supabase
const SUPABASE_FUNCTION_URL = 'https://ttjqnpfoulphvrckltim.supabase.co/functions/v1/create-checkout-session';

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
      // Appeler directement l'URL correcte de la fonction Edge Supabase
      console.log('Appel direct de la fonction Edge Supabase pour créer une session Stripe');
      
      // Récupérer le token d'accès de l'utilisateur connecté
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token || '';
      
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ 
          lineItems,
          userId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur réponse fonction:', errorData);
        throw new Error(`Erreur HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.sessionId || !data.url) {
        throw new Error('Réponse invalide de la fonction Stripe');
      }
      
      console.log('Session Stripe créée avec succès:', data.sessionId);
      return data;
    } catch (error) {
      console.error('Erreur Stripe:', error);
      throw error;
    }
  },

  /**
   * Redirige l'utilisateur vers la page de paiement Stripe
   */
  redirectToCheckout: async (sessionId: string): Promise<void> => {
    // En production, rediriger vers Stripe
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe n\'a pas pu être initialisé');
      }
      
      console.log('Redirection vers Stripe Checkout avec session ID:', sessionId);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Erreur lors de la redirection vers Stripe:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la redirection vers Stripe:', error);
      throw error;
    }
  },

  /**
   * Met à jour le statut d'une commande après paiement
   */
  updateOrderStatus: async (orderId: string, status: 'completed' | 'cancelled'): Promise<void> => {
    try {
      // En production, mettre à jour la commande dans Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        throw error;
      }
      
      // Si la commande est terminée, vider le panier
      if (status === 'completed') {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }
};

export default StripeService;
