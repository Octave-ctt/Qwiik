
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { sendOrderNotification } from '../services/NotificationService';
import { addOrder } from '../utils/data';

const stripePromise = loadStripe('pk_test_51R48HpB4m9hLsjhWC0CHFeQzsb0sBGGwA2503uiNCcuiFLHnuhvqqevIToVBFuh2wSKVCXTfmlBJlpnhLoVriO1T00X3VMqmdu');

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState<'sms' | 'email'>('email');
  const [contactInfo, setContactInfo] = useState('octave.catteau@gmail.com');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  
  const subtotal = getCartTotal();
  const deliveryFee = 0.02;
  const total = subtotal + deliveryFee;
  
  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !zipCode) {
      setAddressError("Veuillez remplir tous les champs d'adresse avant de continuer.");
      return;
    }
    
    // Enregistrer l'adresse (dans un cas réel, cela serait sauvegardé dans une base de données)
    localStorage.setItem('userAddress', JSON.stringify({ address, city, zipCode }));
    
    setAddressError(null);
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  const handleStripeSuccess = () => {
    setStep(3);
    window.scrollTo(0, 0);
    
    // Créer la commande
    const orderAddress = {
      id: `addr${Date.now()}`,
      street: address,
      city: city,
      postalCode: zipCode,
      country: 'France',
      isDefault: false
    };
    
    // Enregistrer la commande
    const orderId = addOrder(currentUser!.id, {
      date: new Date(),
      status: 'pending',
      items: cartItems,
      total: total,
      deliveryAddress: orderAddress
    });
    
    // Envoyer la notification
    sendOrderNotification(
      {
        id: orderId,
        total: total.toFixed(2),
        items: cartItems.length
      },
      notificationMethod,
      contactInfo
    );
  };
  
  const handleFinish = () => {
    toast({
      title: "Commande confirmée",
      description: "Merci pour votre commande ! Votre colis sera bientôt en route."
    });
    clearCart();
    navigate('/account/orders');
  };

  // Charger l'adresse enregistrée quand la page est chargée
  React.useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        const { address: savedStreet, city: savedCity, zipCode: savedZipCode } = JSON.parse(savedAddress);
        setAddress(savedStreet || '');
        setCity(savedCity || '');
        setZipCode(savedZipCode || '');
      } catch (error) {
        console.error('Failed to parse saved address:', error);
      }
    }
  }, []);

  return (
    <div className="page-container py-8 animate-fade-in">
      <Link 
        to="/cart"
        className="inline-flex items-center text-sm font-medium mb-6 hover:text-qwiik-blue transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Retour au panier
      </Link>
      
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-qwiik-blue' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step >= 1 ? 'bg-qwiik-blue text-white' : 'bg-gray-100'
            }`}>
              1
            </div>
            <span className="text-sm">Livraison</span>
          </div>
          
          <div className={`w-24 h-0.5 ${step >= 2 ? 'bg-qwiik-blue' : 'bg-gray-200'}`} />
          
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-qwiik-blue' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step >= 2 ? 'bg-qwiik-blue text-white' : 'bg-gray-100'
            }`}>
              2
            </div>
            <span className="text-sm">Paiement</span>
          </div>
          
          <div className={`w-24 h-0.5 ${step >= 3 ? 'bg-qwiik-blue' : 'bg-gray-200'}`} />
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-qwiik-blue' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step >= 3 ? 'bg-qwiik-blue text-white' : 'bg-gray-100'
            }`}>
              3
            </div>
            <span className="text-sm">Confirmation</span>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-subtle">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Truck size={20} className="mr-2 text-qwiik-blue" />
                Adresse de livraison
              </h2>
              
              <form onSubmit={handleSubmitAddress}>
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Adresse de livraison</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Adresse</label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Numéro et nom de rue"
                        className={addressError && !address ? "border-red-500" : ""}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">Ville</label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ville"
                        className={addressError && !city ? "border-red-500" : ""}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-1">Code postal</label>
                      <Input
                        id="zipCode"
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Code postal"
                        className={addressError && !zipCode ? "border-red-500" : ""}
                      />
                    </div>
                  </div>
                  
                  {addressError && (
                    <div className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-start">
                      <AlertTriangle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                      <span>{addressError}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                  <h3 className="font-medium">Préférences de notification</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Comment souhaitez-vous être notifié ?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="notificationMethod"
                            checked={notificationMethod === 'email'}
                            onChange={() => {
                              setNotificationMethod('email');
                              setContactInfo('octave.catteau@gmail.com');
                            }}
                            className="mr-2"
                          />
                          Email
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="notificationMethod"
                            checked={notificationMethod === 'sms'}
                            onChange={() => {
                              setNotificationMethod('sms');
                              setContactInfo('0651839483');
                            }}
                            className="mr-2"
                          />
                          SMS
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactInfo" className="block text-sm font-medium mb-1">
                        {notificationMethod === 'email' ? 'Email' : 'Numéro de téléphone'}
                      </label>
                      <Input
                        id="contactInfo"
                        type={notificationMethod === 'email' ? 'email' : 'tel'}
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder={
                          notificationMethod === 'email' 
                            ? 'votre-email@exemple.com' 
                            : '06XXXXXXXX'
                        }
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="btn-primary px-8"
                  >
                    Continuer vers le paiement
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-subtle sticky top-24">
              <h2 className="text-lg font-bold mb-6">Récapitulatif</h2>
              
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex py-3 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500">Quantité: {quantity}</p>
                    <p className="text-sm font-medium mt-1">
                      {(product.price * quantity).toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="space-y-3 mt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>
                    {subtotal.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span>
                    {deliveryFee.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500">
                <p>Livraison estimée en 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-subtle">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <CreditCard size={20} className="mr-2 text-qwiik-blue" />
                Méthode de paiement
              </h2>
              
              <Elements stripe={stripePromise}>
                <StripePaymentForm 
                  amount={total} 
                  onSuccess={handleStripeSuccess}
                  onCancel={() => setStep(1)}
                />
              </Elements>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-subtle sticky top-24">
              <h2 className="text-lg font-bold mb-6">Récapitulatif</h2>
              
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex py-3 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500">Quantité: {quantity}</p>
                    <p className="text-sm font-medium mt-1">
                      {(product.price * quantity).toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="space-y-3 mt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>
                    {subtotal.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span>
                    {deliveryFee.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500">
                <p>Livraison estimée en 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border border-gray-100 shadow-subtle text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Commande confirmée</h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre commande ! Votre colis sera livré d'ici 30 minutes.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="text-left mb-4">
              <h3 className="font-medium mb-2">Détails de la commande</h3>
              <p className="text-sm text-gray-600">Numéro de commande: #QWK{Math.floor(Math.random() * 10000)}</p>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-medium mb-2">Articles commandés</h3>
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center py-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-grow text-left">
                    <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500">Quantité: {quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {(product.price * quantity).toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Sous-total</span>
                <span>
                  {subtotal.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Livraison</span>
                <span>
                  {deliveryFee.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </span>
              </div>
              <div className="flex justify-between font-bold mt-2">
                <span>Total</span>
                <span>
                  {total.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleFinish}
              className="btn-primary px-8"
            >
              Voir mes commandes
            </button>
            
            <Link to="/" className="btn-secondary px-8">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
