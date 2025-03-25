
import { Product } from '../components/ProductCard';

// Catégories
export const categories = [
  {
    name: 'Tech',
    slug: 'tech',
    image: '/lovable-uploads/eb0956c6-9f5c-4d7d-9d7a-2515e8eb08ea.png'
  },
  {
    name: 'Beauté',
    slug: 'beauty',
    image: '/lovable-uploads/40dbbecd-66ed-4a09-8f3b-977c6ceff325.png'
  },
  {
    name: 'Maison & Déco',
    slug: 'home',
    image: '/lovable-uploads/eb0956c6-9f5c-4d7d-9d7a-2515e8eb08ea.png'
  },
];

// Produits best-sellers
export const bestSellers: Product[] = [
  {
    id: "prod_1",
    name: "Produit Test 1",
    price: 0.03,
    image: '/lovable-uploads/eb0956c6-9f5c-4d7d-9d7a-2515e8eb08ea.png',
    rating: 4.5,
    reviewCount: 120,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "prod_2",
    name: "Produit Test 2",
    price: 19.99,
    image: '/lovable-uploads/40dbbecd-66ed-4a09-8f3b-977c6ceff325.png',
    rating: 4.2,
    reviewCount: 85,
    deliveryTime: "30 min",
    category: "beauty"
  },
];

// Tous les produits (utilisé dans les pages catégories et recherche)
export const allProducts: Product[] = [
  ...bestSellers
];

// Fonction d'aide pour trouver un produit par ID
export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(product => product.id === id);
};

// Fonction d'aide pour filtrer les produits par catégorie
export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === 'all') {
    return allProducts;
  }
  return allProducts.filter(product => product.category === categorySlug);
};

// Fonction d'aide pour rechercher des produits
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) || 
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};
