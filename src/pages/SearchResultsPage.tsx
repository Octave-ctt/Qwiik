
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../utils/data';
import ProductCard, { Product } from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { ArrowLeft } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay for a smoother experience
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const results = searchProducts(query, category);
      setProducts(results);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query, category]);

  return (
    <div className="page-container py-8 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium mb-6 hover:text-qwiik-blue transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Retour à l'accueil
      </Link>
      
      <div className="mb-8">
        <SearchBar 
          className="mb-6"
          placeholder="Affiner votre recherche..."
        />
        
        <h1 className="text-2xl font-bold mb-2">
          Résultats pour "{query}"
          {category !== 'all' && ` dans ${category}`}
        </h1>
        
        <p className="text-gray-600">
          {isLoading 
            ? 'Recherche en cours...' 
            : `${products.length} produits trouvés`}
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(null).map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 animate-pulse rounded-xl h-72"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-medium mb-2">Aucun résultat</h3>
          <p className="text-gray-600 mb-4">
            Aucun produit ne correspond à votre recherche.
          </p>
          <Link to="/" className="btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
