
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '../contexts/CartContext';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  category: string;
};

type ProductCardProps = {
  product: Product;
  featured?: boolean;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    
    toast({
      title: "Produit ajouté au panier",
      description: product.name,
    });
  };

  return (
    <div 
      className={`group bg-white rounded-xl overflow-hidden border border-gray-100 
        ${featured ? 'shadow-subtle' : ''} 
        card-hover animate-scale-in`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 
              group-hover:scale-105 ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
            <Clock size={12} className="text-qwiik-blue" />
            <span>{product.deliveryTime}</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-1 mb-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          
          <h3 className="font-medium text-base mb-1 line-clamp-2 group-hover:text-qwiik-blue transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-lg">{product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            <button 
              className="p-2 rounded-full bg-qwiik-lightBlue text-qwiik-blue hover:bg-qwiik-blue hover:text-white transition-all duration-300"
              onClick={handleAddToCart}
              aria-label="Ajouter au panier"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
