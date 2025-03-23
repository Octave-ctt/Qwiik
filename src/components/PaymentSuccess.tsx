
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '@/contexts/CartContext';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    // Afficher une notification de succès
    toast({
      title: "Paiement réussi",
      description: "Votre commande a été traitée avec succès. Merci pour votre achat !",
    });
    
    // Vider le panier après un paiement réussi
    clearCart();
  }, []);

  return (
    <div className="page-container py-16 animate-fade-in">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-subtle text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Paiement confirmé</h1>
        <p className="text-gray-600 mb-6">
          Nous avons bien reçu votre paiement. Votre commande est en cours de préparation 
          et sera livrée dans les 30 prochaines minutes.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/account/orders')}
            className="btn-primary w-full"
          >
            Voir mes commandes
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary w-full"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
