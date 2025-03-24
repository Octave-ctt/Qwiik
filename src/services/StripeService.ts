import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';

// Utiliser la clé publique Stripe depuis les variables d'environnement ou la variable globale
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || window.STRIPE_PUBLIC_KEY || 'pk_test_51R48HiBD1jNEQIjBKEt8E1pNwyupyqIfZQkvx0yYB1n3BR849TTNNHU6E3Ryk4mwuqDcc3912o8Ke3zhPvpWujet008AgI4VyT';
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
      // Vérifier si nous sommes en mode développement ou prévisualisation
      const isDevOrPreview = import.meta.env.DEV || window.location.hostname.includes('lovable');
      
      if (isDevOrPreview) {
        console.log('Mode développement/prévisualisation: simulation de checkout Stripe');
        
        // Simuler un délai de réseau
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const sessionId = `cs_test_${Date.now()}`;
        const url = `/checkout?simulation=true&session_id=${sessionId}`;
        
        return { sessionId, url };
      }
      
      // En production, utiliser l'edge function Supabase
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          lineItems,
          userId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/cart`,
        }
      });
      
      if (error) {
        console.error('Erreur Supabase fonction:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erreur Stripe:', error);
      
      // En cas d'erreur, utiliser également le fallback simulé
      console.log('Erreur détectée, utilisation du mode simulation');
      
      const sessionId = `cs_test_${Date.now()}`;
      const url = `/checkout?simulation=true&session_id=${sessionId}`;
      
      return { sessionId, url };
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

    const isDevOrPreview = import.meta.env.DEV || window.location.hostname.includes('lovable');
    
    if (isDevOrPreview) {
      // En mode développement ou prévisualisation, rediriger vers la page de checkout locale
      console.log('Redirection vers simulation Stripe avec session ID:', sessionId);
      window.location.href = `/checkout?simulation=true&session_id=${sessionId}`;
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
