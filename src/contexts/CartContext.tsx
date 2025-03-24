
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
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
  
  // Charger le panier depuis Supabase lorsque l'utilisateur change
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchCartItems();
    } else {
      // Si l'utilisateur est déconnecté, vider le panier
      setCartItems([]);
    }
  }, [currentUser, isAuthenticated]);
  
  const fetchCartItems = async () => {
    if (!currentUser) return;
    
    try {
      // Récupérer les articles du panier de l'utilisateur
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', currentUser.id);
      
      if (cartError) throw cartError;
      
      if (cartData) {
        // Transformer les données pour correspondre à la structure CartItem
        const items: CartItem[] = cartData.map((item: any) => ({
          product: item.product,
          quantity: item.quantity
        }));
        
        setCartItems(items);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre panier.",
        variant: "destructive"
      });
    }
  };
  
  const addToCart = async (product: Product, quantity: number) => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des articles au panier.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Mettre à jour la quantité si le produit est déjà dans le panier
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', currentUser.id)
          .eq('product_id', product.id);
        
        if (error) throw error;
        
        // Mettre à jour l'état local
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity = newQuantity;
        setCartItems(updatedCartItems);
      } else {
        // Ajouter un nouveau produit au panier
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUser.id,
            product_id: product.id,
            quantity
          });
        
        if (error) throw error;
        
        // Mettre à jour l'état local
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
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
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
    if (!currentUser) return;
    
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);
      
      if (error) throw error;
      
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
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setCartItems([]);
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
