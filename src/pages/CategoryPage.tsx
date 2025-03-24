
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByCategory, categories } from '../utils/data';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { SlidersHorizontal } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const category = categories.find(cat => cat.slug === categoryId);
  const products = categoryId ? getProductsByCategory(categoryId) : [];
  
  useEffect(() => {
    if (categoryId && !category) {
      navigate('/not-found');
    }
  }, [categoryId, category, navigate]);
  
  if (!category || !categoryId) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Category Header */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="page-container h-full flex flex-col justify-end pb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-white/80 max-w-xl">
              Découvrez notre sélection de produits {category.name.toLowerCase()} livrés en 30 minutes.
            </p>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
        <div className="page-container py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchBar
              placeholder={`Rechercher dans ${category.name.toLowerCase()}...`}
              showCategories={false}
              className="md:max-w-md"
            />
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filtres</span>
            </button>
          </div>
          
          {isFilterOpen && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg animate-slide-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix</label>
                  <select className="w-full border border-gray-200 rounded-md p-2">
                    <option>Tous les prix</option>
                    <option>Moins de 50€</option>
                    <option>50€ - 100€</option>
                    <option>100€ - 200€</option>
                    <option>Plus de 200€</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Note</label>
                  <select className="w-full border border-gray-200 rounded-md p-2">
                    <option>Toutes les notes</option>
                    <option>4★ et plus</option>
                    <option>3★ et plus</option>
                    <option>2★ et plus</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Marque</label>
                  <select className="w-full border border-gray-200 rounded-md p-2">
                    <option>Toutes les marques</option>
                    <option>Premium</option>
                    <option>Standard</option>
                    <option>Économique</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tri</label>
                  <select className="w-full border border-gray-200 rounded-md p-2">
                    <option>Popularité</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                    <option>Meilleures notes</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-sm px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  Réinitialiser
                </button>
                <button className="text-sm px-4 py-2 bg-qwiik-blue text-white rounded-md hover:bg-qwiik-darkBlue transition-colors">
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="page-container py-8">
        <div className="mb-6">
          <p className="text-gray-600">{products.length} produits trouvés</p>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">
              Aucun produit ne correspond à votre recherche dans cette catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
