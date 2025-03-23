
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const { toast } = useToast();

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

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
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
      <div className="p-4 border border-gray-200 rounded-lg">
        <label className="block text-sm font-medium mb-2">
          Informations de carte
        </label>
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
