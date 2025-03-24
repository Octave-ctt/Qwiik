
const FAVORITES_KEY = 'userFavorites';

export const FavoritesService = {
  // Ajouter/Supprimer un produit des favoris
  toggleFavorite: (productId: string) => {
    const favorites = FavoritesService.getFavorites();
    
    if (favorites.includes(productId)) {
      // Retirer des favoris
      const updatedFavorites = favorites.filter(id => id !== productId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return false; // Indique que le produit n'est plus favori
    } else {
      // Ajouter aux favoris
      const updatedFavorites = [...favorites, productId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true; // Indique que le produit est maintenant favori
    }
  },
  
  // Vérifier si un produit est en favori
  isFavorite: (productId: string): boolean => {
    const favorites = FavoritesService.getFavorites();
    return favorites.includes(productId);
  },
  
  // Récupérer tous les favoris
  getFavorites: (): string[] => {
    const favoritesStr = localStorage.getItem(FAVORITES_KEY);
    if (!favoritesStr) return [];
    try {
      return JSON.parse(favoritesStr);
    } catch (e) {
      console.error('Erreur lors de la récupération des favoris', e);
      return [];
    }
  }
};

export default FavoritesService;
