
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, CreditCard, Lock } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  isSimulation?: boolean;
  // Add the missing properties
  lineItems?: any[];
  metadata?: any;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onCancel, isSimulation = false, lineItems, metadata }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Champs supplémentaires pour la simulation complète
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    try {
      // Dans un environnement réel, vous appelleriez votre backend pour créer un intent
      // Mais pour cette démo nous simulons simplement le processus
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Utiliser des informations de test qui fonctionnent toujours en mode test
      // (numéro de carte: 4242 4242 4242 4242, date future, CVC: 3 chiffres)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: isSimulation ? {
          name,
          email,
        } : undefined,
      });

      if (error) {
        setCardError(error.message || "Une erreur est survenue lors du traitement du paiement.");
        toast({
          title: "Erreur de paiement",
          description: error.message || "Une erreur est survenue lors du traitement du paiement.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Paiement accepté",
          description: `Paiement de ${amount.toFixed(2)}€ traité avec succès.`,
        });
        
        console.log('Payment successful:', paymentMethod);
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors du traitement du paiement.";
      setCardError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSimulation && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Lock size={18} className="text-gray-500" />
            <h3 className="font-medium">Informations personnelles</h3>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>
      )}
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard size={18} className="text-gray-500" />
          <label className="block text-sm font-medium">
            Informations de carte
          </label>
        </div>
        
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border border-gray-200 rounded-md"
        />
        
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Pour tester, utilisez ces informations:
          </p>
          <ul className="text-xs text-gray-500 list-disc pl-4 mt-1">
            <li>Numéro: 4242 4242 4242 4242</li>
            <li>Date: n'importe quelle date future</li>
            <li>CVC: n'importe quels 3 chiffres</li>
          </ul>
        </div>
        
        {cardError && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-start">
            <AlertTriangle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>{cardError}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button 
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isProcessing}
        >
          Retour
        </button>
        
        <button 
          type="submit"
          disabled={!stripe || isProcessing}
          className={`btn-primary px-8 ${isProcessing ? 'opacity-75' : ''}`}
        >
          {isProcessing ? 'Traitement en cours...' : `Payer ${amount.toFixed(2)}€`}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
