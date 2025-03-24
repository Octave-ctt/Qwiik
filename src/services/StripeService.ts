
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';

// Utiliser la clé publique Stripe depuis les variables d'environnement
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock_key_for_development';
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
      // En mode développement ou en test, utiliser le serveur mock
      console.log('Mode développement détecté - simulation du paiement Stripe');
      const total = items.reduce((sum, { product, quantity }) => sum + (product.price * quantity), 0);
      
      // Créer un ID de commande fictif
      const orderId = `o${Date.now()}`;
      
      // Dans une implémentation réelle, cela enregistrerait les données dans Supabase
      console.log('Commande créée avec succès:', {
        id: orderId,
        userId,
        total,
        items: items.length
      });
      
      return {
        sessionId: `session_${Date.now()}`,
        url: `/payment/success?session_id=${Date.now()}&order_id=${orderId}`,
      };
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
    console.log('Redirection vers Stripe avec session ID:', sessionId);
    // Simuler la redirection vers Stripe en redirigeant vers la page de succès
    setTimeout(() => {
      window.location.href = '/payment/success';
    }, 1500);
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
      // En mode développement, simplement simuler la mise à jour
      console.log(`Mise à jour du statut de la commande ${orderId} à ${status}`);
      
      // Si la commande est terminée, simuler le vidage du panier
      if (status === 'completed') {
        console.log('Panier vidé après commande réussie');
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error);
      throw error;
    }
  }
};

export default StripeService;
