
import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import FavoritesService from "@/services/FavoritesService";
import { AuthContext } from "@/contexts/AuthContext";
import { Heart } from "lucide-react";

// Format price helper function
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

// Function to get all products 
const getAllProducts = async () => {
  // Dans une implémentation réelle, ceci ferait un appel API
  // Pour l'instant, on utilise des données mockées
  return [
    {
      id: "1",
      name: "Smartphone Android",
      price: 349.99,
      image: "/placeholder.svg",
      category: "Tech"
    },
    {
      id: "2",
      name: "Écouteurs sans fil",
      price: 129.99,
      image: "/placeholder.svg",
      category: "Tech"
    },
    {
      id: "3",
      name: "Tablette 10 pouces",
      price: 199.99,
      image: "/placeholder.svg",
      category: "Tech"
    },
    {
      id: "4",
      name: "Montre connectée",
      price: 149.99,
      image: "/placeholder.svg",
      category: "Tech"
    }
  ];
};

const FavoritesPage = () => {
  const [favoritesProducts, setFavoritesProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      const favoriteIds = FavoritesService.getFavorites();
      const allProducts = await getAllProducts();
      
      const favoriteProducts = allProducts.filter(product => 
        favoriteIds.includes(product.id)
      );
      
      setFavoritesProducts(favoriteProducts);
      setLoading(false);
    };
    
    loadFavorites();
  }, [isAuthenticated]);

  const handleRemoveFavorite = (productId: string) => {
    FavoritesService.toggleFavorite(productId);
    setFavoritesProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Heart className="mr-2" size={20} />Mes favoris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement de vos favoris...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Heart className="mr-2" size={20} />Mes favoris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Vous devez être connecté pour voir vos favoris.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Heart className="mr-2" size={20} />Mes favoris
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favoritesProducts.length === 0 ? (
          <p>Vous n'avez pas encore de favoris.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoritesProducts.map((product) => (
              <div key={product.id} className="relative group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                      <p className="font-bold text-lg">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesPage;
