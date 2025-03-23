
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  categories?: Array<{name: string, slug: string}>;
  showCategories?: boolean;
};

const defaultCategories = [
  { name: 'Tous', slug: 'all' },
  { name: 'Tech', slug: 'tech' },
  { name: 'Beauté', slug: 'beauty' },
  { name: 'Maison', slug: 'home' },
  { name: 'Mode', slug: 'fashion' }
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = "", 
  placeholder = "Rechercher un produit...",
  categories = defaultCategories,
  showCategories = true
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}&category=${selectedCategory}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`w-full max-w-3xl mx-auto ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qwiik-blue/40 focus:border-transparent shadow-subtle transition-all duration-200 text-base"
          />
        </div>
        
        {showCategories && (
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:w-48 py-3 px-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qwiik-blue/40 focus:border-transparent shadow-subtle transition-all duration-200"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        
        <button 
          type="submit"
          className="btn-primary md:w-auto py-3 px-6 rounded-xl flex items-center justify-center"
        >
          <Search className="mr-2" size={18} />
          <span>Rechercher</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
