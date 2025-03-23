
import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addToFavorites, removeFromFavorites, isFavorite } from '../utils/data';
import { useToast } from '@/hooks/use-toast';

type FavoriteButtonProps = {
  productId: string;
  className?: string;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId, className = '' }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFav, setIsFav] = React.useState(false);
  
  React.useEffect(() => {
    if (currentUser) {
      setIsFav(isFavorite(currentUser.id, productId));
    }
  }, [currentUser, productId]);
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits à vos favoris.",
        variant: "destructive"
      });
      return;
    }
    
    if (isFav) {
      removeFromFavorites(currentUser!.id, productId);
      setIsFav(false);
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris."
      });
    } else {
      addToFavorites(currentUser!.id, productId);
      setIsFav(true);
      toast({
        title: "Ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris."
      });
    }
  };
  
  return (
    <button
      onClick={handleToggleFavorite}
      className={`p-2 rounded-full ${
        isFav 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-gray-50 hover:bg-gray-100'
      } transition-colors ${className}`}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        size={20} 
        className={isFav ? 'fill-current' : ''}
      />
    </button>
  );
};

export default FavoriteButton;
