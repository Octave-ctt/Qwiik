
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../components/ProductCard';
import { AuthContext } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  
  // Charger le panier depuis localStorage
  useEffect(() => {
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Erreur lors du chargement du panier:', e);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Sauvegarder le panier dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = async (product: Product, quantity: number) => {
    try {
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Mettre à jour la quantité si le produit est déjà dans le panier
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        
        // Mettre à jour l'état local
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity = newQuantity;
        setCartItems(updatedCartItems);
      } else {
        // Ajouter un nouveau produit
        setCartItems([...cartItems, { product, quantity }]);
      }
      
      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté à votre panier.`
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive"
      });
    }
  };
  
  const removeFromCart = async (productId: string) => {
    try {
      // Mettre à jour l'état local
      setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit du panier.",
        variant: "destructive"
      });
    }
  };
  
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      
      // Mettre à jour l'état local
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité.",
        variant: "destructive"
      });
    }
  };
  
  const clearCart = async () => {
    try {
      // Mettre à jour l'état local
      setCartItems([]);
      
      // Supprimer du localStorage
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vider le panier.",
        variant: "destructive"
      });
    }
  };
  
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal, 
        getCartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
