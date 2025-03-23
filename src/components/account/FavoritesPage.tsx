
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getFavorites, removeFromFavorites } from '../../utils/data';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '../../contexts/CartContext';

const FavoritesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = React.useState(currentUser ? getFavorites(currentUser.id) : []);
  const { toast } = useToast();
  const { addToCart } = React.useContext(CartContext);
  
  React.useEffect(() => {
    if (currentUser) {
      setFavorites(getFavorites(currentUser.id));
    }
  }, [currentUser]);
  
  const handleRemoveFavorite = (productId: string) => {
    if (!currentUser) return;
    
    removeFromFavorites(currentUser.id, productId);
    setFavorites(favorites.filter(product => product.id !== productId));
    
    toast({
      title: "Produit retiré",
      description: "Le produit a été retiré de vos favoris."
    });
  };
  
  const handleAddToCart = (productId: string) => {
    const product = favorites.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier."
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-subtle p-6">
      <h2 className="text-xl font-bold mb-6">Mes favoris</h2>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(product => (
            <div key={product.id} className="border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-colors">
              <div className="relative aspect-square bg-gray-50">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-100 text-red-500"
                  aria-label="Retirer des favoris"
                >
                  <Heart size={18} className="fill-current" />
                </button>
              </div>
              
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="hover:text-qwiik-blue">
                  <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-qwiik-blue font-bold mb-3">
                  {product.price.toLocaleString('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR' 
                  })}
                </p>
                
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className="btn-primary w-full flex items-center justify-center text-sm py-1.5"
                >
                  <ShoppingCart size={16} className="mr-1" />
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Heart size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Pas encore de favoris</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore ajouté de produits à vos favoris.
          </p>
          <Link to="/" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
