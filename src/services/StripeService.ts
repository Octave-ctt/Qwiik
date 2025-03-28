
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

// Utiliser la clé publique Stripe depuis les variables d'environnement
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || window.STRIPE_PUBLIC_KEY || 'pk_test_51R48HiBD1jNEQIjBKEt8E1pNwyupyqIfZQkvx0yYB1n3BR849TTNNHU6E3Ryk4mwuqDcc3912o8Ke3zhPvpWujet008AgI4VyT';
const stripePromise = loadStripe(stripePublicKey);

// URL de la fonction Edge Supabase
const SUPABASE_FUNCTION_URL = 'https://ttjqnpfoulphvrckltim.supabase.co/functions/v1/create-checkout-session';

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const StripeService = {
  /**
   * Crée une session de checkout Stripe via la fonction Edge Supabase
   */
  createCheckoutSession: async (items: CartItem[], userId: string): Promise<CheckoutSessionResponse> => {
    try {
      console.log('Appel de la fonction Edge Supabase pour créer une session Stripe');
      
      // Récupérer le token d'accès de l'utilisateur connecté
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token || '';
      
      if (!accessToken) {
        console.warn('Aucun token d\'accès disponible pour l\'authentification');
      }
      
      // Transformer les articles du panier en format compatible avec Stripe
      const lineItems = items.map(({ product, quantity }) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: [product.image],
            metadata: {
              productId: product.id
            }
          },
          unit_amount: Math.round(product.price * 100), // Prix en centimes
        },
        quantity,
      }));
      
      // Préparer les données pour la fonction Edge
      const requestBody = { 
        lineItems,
        userId,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/cart`,
        metadata: {
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          }))
        }
      };
      
      // Appeler la fonction Edge
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!response.ok) {
        let errorMessage = `Erreur HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // Si la réponse n'est pas au format JSON, utiliser le texte brut
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
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
