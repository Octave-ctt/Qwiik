
import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StripeService } from '../services/StripeService';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeOrder = async () => {
      if (!sessionId) {
        setError("Identifiant de session manquant");
        setIsProcessing(false);
        return;
      }

      try {
        // Mettre à jour le statut de la commande dans Supabase
        if (isAuthenticated && currentUser) {
          // Trouver la commande associée à cette session
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('id')
            .eq('session_id', sessionId)
            .eq('user_id', currentUser.id)
            .single();

          if (orderError) {
            console.error("Erreur lors de la recherche de la commande:", orderError);
          } else if (orderData) {
            // Mettre à jour le statut de la commande
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'completed' })
              .eq('id', orderData.id);

            if (updateError) {
              console.error("Erreur lors de la mise à jour du statut de la commande:", updateError);
            } else {
              console.log("Commande marquée comme terminée avec succès");
            }
          }
        }

        setIsProcessing(false);
        toast({
          title: "Paiement réussi",
          description: "Votre commande a été confirmée avec succès."
        });
      } catch (error) {
        console.error('Erreur lors de la finalisation de la commande:', error);
        setError("Une erreur est survenue lors de la finalisation de votre commande.");
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la finalisation de votre commande.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    };

    // Si l'utilisateur est connecté, finaliser la commande
    if (isAuthenticated) {
      completeOrder();
    } else {
      // Si l'utilisateur n'est pas connecté, lui montrer un message
      setError("Veuillez vous connecter pour finaliser votre commande");
      setIsProcessing(false);
    }
  }, [sessionId, orderId, toast, navigate, isAuthenticated, currentUser]);

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

  if (error) {
    return (
      <div className="page-container py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-red-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          
          <div className="flex justify-center">
            <Link to="/">
              <Button className="flex items-center justify-center">
                <Home className="mr-2" size={16} />
                Retour à l'accueil
              </Button>
            </Link>
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
          <Link to="/account/orders">
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
