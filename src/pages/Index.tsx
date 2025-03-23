
import React from 'react';
import SearchBar from '../components/SearchBar';
import FeaturedProducts from '../components/FeaturedProducts';
import { bestSellers, categories, featuredProducts } from '../utils/data';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-blue-50">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <img 
              src="/lovable-uploads/95e2969d-20e6-4f38-9bce-efefa1554333.png" 
              alt="Qwiik Logo" 
              className="h-16 mx-auto mb-4"
            />
            <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-qwiik-blue text-sm font-medium mb-4 shadow-subtle">
              Livraison en 30 minutes
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Vos produits préférés, <span className="text-qwiik-blue">livrés en un éclair</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Commandez parmi des centaines de produits de vos magasins préférés et recevez-les en 30 minutes seulement.
            </p>
            
            <SearchBar className="mb-8" />
            
            <div className="text-sm text-gray-500">
              Exemples : smartphone, crème hydratante, manette PS5
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Sellers Section - Maintenant en premier */}
      <section className="py-12 gradient-section-3">
        <div className="page-container">
          <FeaturedProducts title="Best-sellers" products={bestSellers} />
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="page-container">
          <FeaturedProducts title="Nouveautés" products={featuredProducts} />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Qwiik révolutionne vos achats en ligne avec une livraison ultra-rapide de vos produits préférés.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-subtle text-center">
              <div className="w-16 h-16 bg-qwiik-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-qwiik-blue">1</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Trouvez vos produits</h3>
              <p className="text-gray-600">
                Parcourez notre catalogue et trouvez ce que vous cherchez en quelques clics.
              </p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-subtle text-center">
              <div className="w-16 h-16 bg-qwiik-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-qwiik-blue">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Commandez en ligne</h3>
              <p className="text-gray-600">
                Ajoutez vos articles au panier et finalisez votre commande en toute simplicité.
              </p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-subtle text-center">
              <div className="w-16 h-16 bg-qwiik-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-qwiik-blue">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Livraison express</h3>
              <p className="text-gray-600">
                Recevez votre commande en seulement 30 minutes directement chez vous.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a href="/category/all" className="btn-primary inline-flex items-center space-x-2">
              <span>Découvrir nos produits</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
      
      {/* Categories Section - Déplacé en dernier */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="page-container">
          <h2 className="text-2xl font-bold mb-6">Catégories populaires</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <a 
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group bg-gray-50 rounded-xl overflow-hidden relative aspect-square card-hover"
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold">{category.name}</h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
