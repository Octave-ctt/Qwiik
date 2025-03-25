
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Home, ChevronDown, Heart, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CartContext } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Logo du site
const QwiikLogo: React.FC = () => (
  <div className="flex items-center">
    <img 
      src="/lovable-uploads/014e3b8a-5658-413c-b8de-8281e290cdc6.png" 
      alt="Qwiik Logo" 
      className="h-8 w-auto mr-2"
    />
    <span className="font-display font-bold text-xl">Qwiik</span>
  </div>
);

const categories = [
  { name: 'Tech', slug: 'tech' },
  { name: 'Beauté', slug: 'beauty' },
  { name: 'Maison & Déco', slug: 'home' }
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { getCartCount } = useContext(CartContext);
  const { currentUser, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
    }
  };

  const openLoginModal = () => {
    setAuthModalView('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalView('register');
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const cartCount = getCartCount();

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-subtle' 
          : 'bg-white'
      }`}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <QwiikLogo />
          </Link>

          {!isMobile && (
            <div className="hidden md:flex space-x-6 mx-4 items-center">
              <Link 
                to="/"
                className="nav-link text-sm font-medium flex items-center"
              >
                <Home size={16} className="mr-1" />
                Accueil
              </Link>
              
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="nav-link text-sm font-medium">
                      Catégories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/category/${category.slug}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Link 
                to="/how-it-works"
                className="nav-link text-sm font-medium"
              >
                Comment ça marche
              </Link>
            </div>
          )}

          {isMobile && !mobileMenuOpen && (
            <form 
              onSubmit={handleSearchSubmit}
              className="flex-1 mx-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qwiik-blue/40 focus:border-transparent text-sm"
                />
              </div>
            </form>
          )}

          <div className="flex items-center space-x-4">
            {!isMobile && (
              <div className="relative">
                <button 
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Rechercher"
                >
                  <Search className="h-5 w-5" />
                </button>
                
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg p-3 border border-gray-100 animate-slide-in">
                    <form onSubmit={handleSearchSubmit}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher un produit..."
                          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-qwiik-blue/40 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Appuyez sur Entrée pour rechercher
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated && (
              <Link 
                to="/account/favorites" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Mes favoris"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-qwiik-blue text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <Link 
                  to="/account" 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <User className="h-5 w-5" />
                  {!isMobile && <span className="ml-2 text-sm font-medium">{currentUser?.name?.split(' ')[0]}</span>}
                </Link>
              </div>
            ) : (
              <button 
                onClick={openLoginModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center"
              >
                <User className="h-5 w-5" />
                {!isMobile && <span className="ml-2 text-sm font-medium">Connexion</span>}
              </button>
            )}
            
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </nav>
      </div>

      {mobileMenuOpen && isMobile && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-in">
          <div className="page-container py-4">
            <div className="space-y-4">
              <Link 
                to="/"
                className="block py-2 nav-link font-medium flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={16} className="mr-1" />
                Accueil
              </Link>
              
              <div className="block py-2">
                <div className="flex items-center justify-between nav-link font-medium" onClick={() => document.getElementById('mobileCategories')?.classList.toggle('hidden')}>
                  <span>Catégories</span>
                  <ChevronDown size={16} />
                </div>
                <div id="mobileCategories" className="hidden pl-4 mt-2 space-y-2">
                  {categories.map((category) => (
                    <Link 
                      key={category.slug} 
                      to={`/category/${category.slug}`}
                      className="block py-1 nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/how-it-works"
                className="block py-2 nav-link font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Comment ça marche
              </Link>
              
              <div className="pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/account" 
                      className="block py-2 nav-link font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon compte
                    </Link>
                    <Link 
                      to="/account/favorites" 
                      className="block py-2 nav-link font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes favoris
                    </Link>
                    <Link 
                      to="/account/orders" 
                      className="block py-2 nav-link font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mes commandes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 w-full text-left text-red-500 font-medium"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-1" />
                        Déconnexion
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLoginModal();
                      }}
                      className="block py-2 w-full text-left nav-link font-medium"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openRegisterModal();
                      }}
                      className="block py-2 w-full text-left nav-link font-medium"
                    >
                      Créer un compte
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />
    </header>
  );
};

export default Navbar;
