
import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../contexts/CartContext';

// Utilisera la clé depuis les variables d'environnement en production
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';
const stripePromise = loadStripe(stripePublicKey);

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export const StripeService = {
  /**
   * Crée une session de checkout Stripe
   */
  createCheckoutSession: async (items: CartItem[]): Promise<CheckoutSessionResponse> => {
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
      // En mode développement, utiliser le serveur mock
      if (import.meta.env.DEV) {
        const mockResponse = await StripeService.simulateBackendCheckout(items);
        
        // Simuler la redirection vers Stripe en redirigeant vers la page de succès
        // Dans un environnement réel, Stripe gérerait cette redirection
        setTimeout(() => {
          window.location.href = '/payment/success';
        }, 1500);
        
        return mockResponse;
      }

      // En production, appeler l'API backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems }),
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
    if (import.meta.env.DEV) {
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
   * En production, cela serait géré par votre serveur backend
   */
  simulateBackendCheckout: async (items: CartItem[]): Promise<CheckoutSessionResponse> => {
    // Cette fonction simule ce qui se passerait côté serveur
    // Elle ne devrait jamais être utilisée en production
    
    // En mode développement, nous simulons la réponse comme si elle venait du backend
    console.log('Éléments à acheter:', items);
    
    // Simuler une réponse de l'API
    return {
      sessionId: `session_${Date.now()}`,
      url: `/payment/success`, // Rediriger vers notre page de succès interne
    };
  }
};
