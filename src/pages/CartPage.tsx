
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { StripeService } from '../services/StripeService';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isAuthenticated && !currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour accéder à votre panier."
      });
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate, toast]);
  
  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
    
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de votre panier"
    });
  };
  
  const handleStripeCheckout = async () => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer un achat."
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const { url, sessionId } = await StripeService.createCheckoutSession(cartItems, currentUser.id);
      
      toast({
        title: "Redirection vers Stripe...",
        description: "Vous allez être redirigé vers la page de paiement"
      });
      
      // En développement, simuler la redirection
      if (import.meta.env.DEV || window.location.hostname.includes('lovable')) {
        setTimeout(() => {
          navigate(`/payment/success?session_id=${sessionId}`);
          setIsProcessing(false);
        }, 1500);
      } else {
        // En production, rediriger vers Stripe
        await StripeService.redirectToCheckout(sessionId);
      }
      
    } catch (error) {
      setIsProcessing(false);
      console.error("Erreur lors du checkout:", error);
      toast({
        title: "Erreur de paiement",
        description: "Un problème est survenu lors de la redirection vers la page de paiement.",
        variant: "destructive"
      });
    }
  };
  
  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 35 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="page-container py-8 animate-fade-in text-center">
        <h1 className="text-2xl font-bold mb-4">Chargement du panier...</h1>
      </div>
    );
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <Link 
        to="/"
        className="inline-flex items-center text-sm font-medium mb-6 hover:text-qwiik-blue transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Continuer mes achats
      </Link>
      
      <div className="flex items-center mb-6">
        <ShoppingCart className="mr-2 text-qwiik-blue" size={24} />
        <h1 className="text-2xl font-bold">Mon panier</h1>
      </div>
      
      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <div 
                key={product.id} 
                className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-100 card-hover"
              >
                <Link to={`/product/${product.id}`} className="shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </Link>
                
                <div className="flex-grow min-w-0">
                  <Link to={`/product/${product.id}`} className="hover:text-qwiik-blue transition-colors">
                    <h3 className="font-medium text-base mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-500 text-sm mb-2">
                    Livraison en {product.deliveryTime || '30 minutes'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-qwiik-blue transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-qwiik-blue transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Supprimer cet article"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold">
                    {(product.price * quantity).toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.price.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })} par unité
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-subtle sticky top-24">
              <h2 className="text-lg font-bold mb-6">Récapitulatif</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>
                    {subtotal.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span>
                    {deliveryFee === 0 
                      ? 'Gratuite' 
                      : deliveryFee.toLocaleString('fr-FR', { 
                          style: 'currency', 
                          currency: 'EUR' 
                        })
                    }
                  </span>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="text-sm text-green-600">
                    Livraison gratuite à partir de 35€
                  </div>
                )}
                
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
              
              <div className="space-y-3">
                <Button 
                  onClick={handleStripeCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 flex items-center justify-center space-x-2"
                >
                  <CreditCard size={18} />
                  <span>{isProcessing ? 'Traitement en cours...' : 'Payer avec Stripe'}</span>
                </Button>
                
                <Link 
                  to="/checkout"
                  className="btn-secondary w-full py-3 flex items-center justify-center space-x-2"
                >
                  <span>Passer à la commande</span>
                </Link>
              </div>
              
              <div className="mt-4 text-xs text-center text-gray-500">
                <p>Livraison estimée en 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <ShoppingCart size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Parcourez notre catalogue et ajoutez des produits à votre panier pour les commander.
          </p>
          <Link to="/" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
