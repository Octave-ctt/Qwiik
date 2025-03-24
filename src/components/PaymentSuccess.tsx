
import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StripeService } from '../services/StripeService';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const completeOrder = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        // Marquer la commande comme terminée
        if (orderId) {
          await StripeService.updateOrderStatus(orderId, 'completed');
        }

        setIsProcessing(false);
        toast({
          title: "Paiement réussi",
          description: "Votre commande a été confirmée avec succès."
        });
      } catch (error) {
        console.error('Erreur lors de la finalisation de la commande:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation de votre commande.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    };

    if (isAuthenticated) {
      completeOrder();
    } else {
      // Si l'utilisateur n'est pas connecté, attendre un peu puis rediriger
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, orderId, toast, navigate, isAuthenticated]);

  if (isProcessing) {
    return (
      <div className="page-container py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-200"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-16 text-center animate-fade-in">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-6">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-gray-600 mb-6">
          Votre commande a été traitée avec succès et sera livrée sous peu.
          <br />
          Un email de confirmation vous a été envoyé.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/account">
            <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center">
              <ShoppingBag className="mr-2" size={16} />
              Mes commandes
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full sm:w-auto flex items-center justify-center">
              <Home className="mr-2" size={16} />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Numéro de commande: #{orderId ? orderId.slice(-6) : sessionId?.slice(-6)}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
