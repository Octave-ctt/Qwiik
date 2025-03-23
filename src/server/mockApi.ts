
// Ce fichier est uniquement utilisé en développement
// Il permet de simuler un serveur backend pour l'API de paiement Stripe

import { CartItem } from '../contexts/CartContext';

// Dans une vraie application, vous utiliseriez un serveur Node.js avec Express
// et la bibliothèque Stripe côté serveur avec votre clé secrète

/**
 * Simuler la création d'une session Stripe
 */
export async function createStripeCheckoutSession(cartItems: CartItem[]) {
  // Formater les articles du panier pour Stripe
  const lineItems = cartItems.map(({ product, quantity }) => ({
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

  // Simuler une réponse de l'API Stripe
  // En production, vous appelleriez stripe.checkout.sessions.create()
  return {
    id: `cs_test_${Date.now()}`,
    url: `https://checkout.stripe.com/pay/cs_test_${Date.now()}`,
  };
}
