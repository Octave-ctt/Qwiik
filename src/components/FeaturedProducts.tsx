
import React from 'react';
import ProductCard, { Product } from './ProductCard';

type FeaturedProductsProps = {
  title: string;
  products: Product[];
  className?: string;
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  products, 
  className = ""
}) => {
  return (
    <section className={`py-8 rounded-xl px-6 backdrop-blur-sm bg-gradient-to-r from-purple-50/70 to-blue-50/70 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <a href="/category/all" className="text-qwiik-blue hover:underline text-sm font-medium">
          Voir tout
        </a>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} featured />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
