
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../utils/data';
import { ShoppingCart, ArrowLeft, Star, Truck, Clock, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../contexts/CartContext';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  const product = id ? getProductById(id) : undefined;
  
  useEffect(() => {
    if (!product) {
      navigate('/not-found');
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  // Mock multiple images for the product
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1001',
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1002',
  ];

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      
      toast({
        title: "Produit ajouté au panier",
        description: `${quantity} x ${product.name}`,
      });
    }, 500);
  };
  
  // Sample similar products - in a real app you'd fetch related products
  const similarProducts = Array(3).fill(null).map((_, i) => getProductById(String(((parseInt(id) + i + 1) % 12) + 1))!);

  return (
    <div className="page-container py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium mb-6 hover:text-qwiik-blue transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Retour
      </button>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-xl overflow-hidden mb-4 aspect-square">
            <img
              src={productImages[mainImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {productImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  mainImage === i ? 'border-qwiik-blue' : 'border-transparent hover:border-gray-200'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} - vue ${i+1}`}
                  className="w-full aspect-square object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-qwiik-blue">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center">
              {Array(5).fill(null).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm ml-1 text-gray-600">
                {product.rating} ({product.reviewCount} avis)
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <span className="text-3xl font-bold">
              {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Clock size={18} className="text-qwiik-blue" />
              <span>Livraison estimée: <strong>{product.deliveryTime}</strong></span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Truck size={18} className="text-green-500" />
              <span className="text-green-700">Livraison gratuite dès 35€ d'achat</span>
            </div>
          </div>
          
          <div className="border-t border-b py-6 border-gray-100 mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.
            </p>
            <p className="text-gray-600">
              Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-qwiik-blue transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-qwiik-blue transition-colors"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`btn-primary py-3 px-6 flex-grow flex items-center justify-center space-x-2 ${
                isAdding ? 'opacity-75' : ''
              }`}
            >
              <ShoppingCart size={18} />
              <span>{isAdding ? 'Ajout en cours...' : 'Ajouter au panier'}</span>
            </button>
            
            <button
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors"
              aria-label="Ajouter aux favoris"
            >
              <Heart size={18} />
            </button>
            
            <button
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-qwiik-blue hover:border-qwiik-blue transition-colors"
              aria-label="Partager"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Similar Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
        <div className="product-grid">
          {similarProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
