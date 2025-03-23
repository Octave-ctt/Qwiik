
// Ce fichier simule un endpoint d'API pour Stripe Checkout
// En production, ce code serait sur votre serveur backend

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Dans une application réelle, vous utiliseriez la bibliothèque Stripe
      // avec votre clé secrète pour créer une session de paiement
      
      // Simulons une réponse de l'API Stripe
      const session = {
        id: `cs_test_${Date.now()}`,
        url: '/payment/success', // Rediriger vers notre page de succès interne
      };
      
      res.status(200).json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
