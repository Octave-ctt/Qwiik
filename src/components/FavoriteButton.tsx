
import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import FavoritesService from "@/services/FavoritesService";
import { AuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
}

const FavoriteButton = ({ productId, className }: FavoriteButtonProps) => {
  const { user } = useContext(AuthContext) || { user: null };
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavorite(FavoritesService.isFavorite(productId));
    }
  }, [productId, user]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des favoris.",
        variant: "destructive",
      });
      return;
    }
    
    const newStatus = FavoritesService.toggleFavorite(productId);
    setIsFavorite(newStatus);
    
    toast({
      title: newStatus ? "Ajouté aux favoris" : "Retiré des favoris",
      description: newStatus 
        ? "Ce produit a été ajouté à vos favoris." 
        : "Ce produit a été retiré de vos favoris.",
      variant: "default",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={handleToggleFavorite}
    >
      <Heart
        className={cn(
          "h-6 w-6 transition-colors",
          isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
        )}
      />
    </Button>
  );
};

export default FavoriteButton;
