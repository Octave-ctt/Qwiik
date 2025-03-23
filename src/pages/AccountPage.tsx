import React, { useState } from 'react';
import { Link, useLocation, Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  User, 
  Clock, 
  LogOut, 
  Settings, 
  Heart, 
  MapPin, 
  ShoppingBag, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders } from '../utils/data';
import { useToast } from '@/hooks/use-toast';
import FavoritesPage from '../components/account/FavoritesPage';

// Account Profile Sub-page
const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    
    // En réalité, il faudrait mettre à jour les informations utilisateur dans la base de données
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées."
    });
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.")) {
      logout();
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès."
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-subtle p-6">
      <h2 className="text-xl font-bold mb-6">Mon profil</h2>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              type="submit"
              className="btn-primary px-4"
            >
              Enregistrer
            </button>
            
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-secondary px-4"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="text-sm text-gray-500">Nom complet</h3>
              <p className="font-medium">{currentUser?.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500">Email</h3>
              <p className="font-medium">{currentUser?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-secondary px-4"
          >
            Modifier
          </button>
        </div>
      )}
      
      <hr className="my-8 border-gray-100" />
      
      <div>
        <h3 className="font-bold mb-4">Mot de passe</h3>
        <button className="btn-secondary px-4">
          Changer le mot de passe
        </button>
      </div>
      
      <hr className="my-8 border-gray-100" />
      
      <div>
        <h3 className="font-bold mb-4 text-red-500">Supprimer mon compte</h3>
        <p className="text-sm text-gray-600 mb-4">
          Cette action est irréversible et supprimera définitivement votre compte et toutes vos données.
        </p>
        <button 
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

// Orders Sub-page
const Orders = () => {
  const { currentUser } = useAuth();
  const orders = currentUser ? getUserOrders(currentUser.id) : [];

  return (
    <div className="bg-white rounded-lg shadow-subtle p-6">
      <h2 className="text-xl font-bold mb-6">Mes commandes</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order.id}
              className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium">Commande #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {order.date.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' 
                      ? 'bg-green-100 text-green-800' 
                      : order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'delivered' 
                      ? 'Livré' 
                      : order.status === 'pending' 
                        ? 'En cours' 
                        : 'Annulé'
                    }
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items.map(item => (
                  <div key={item.product.id} className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR', { 
                        style: 'currency', 
                        currency: 'EUR' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <div className="text-sm text-gray-500">
                  Total: <span className="font-bold text-black">
                    {order.total.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Pas encore de commande</h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore passé de commande sur Qwiik.
          </p>
          <Link to="/" className="btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      )}
    </div>
  );
};

// Addresses Sub-page
const Addresses = () => {
  const { currentUser } = useAuth();
  const addresses = currentUser?.addresses || [];

  return (
    <div className="bg-white rounded-lg shadow-subtle p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mes adresses</h2>
        
        <button className="btn-primary px-4 py-2">
          Ajouter une adresse
        </button>
      </div>
      
      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map(address => (
            <div 
              key={address.id}
              className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {address.street}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-qwiik-blue/10 text-qwiik-blue px-2 py-0.5 rounded">
                      Par défaut
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-qwiik-blue transition-colors">
                    <Settings size={16} />
                  </button>
                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">
                {address.postalCode} {address.city}, {address.country}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Pas encore d'adresse</h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore ajouté d'adresse à votre compte.
            </p>
            <button className="btn-primary">
              Ajouter une adresse
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Account Page Component
const AccountPage = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const mainPath = '/account';
  
  // Redirect to profile page if on /account
  if (location.pathname === mainPath) {
    return <Navigate to={`${mainPath}/profile`} replace />;
  }
  
  const isActive = (path: string) => {
    return location.pathname === `${mainPath}${path}`;
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès."
    });
    navigate('/');
  };
  
  const menuItems = [
    { path: '/profile', icon: User, label: 'Mon profil' },
    { path: '/orders', icon: ShoppingBag, label: 'Mes commandes' },
    { path: '/addresses', icon: MapPin, label: 'Mes adresses' },
    { path: '/favorites', icon: Heart, label: 'Mes favoris' },
  ];

  return (
    <div className="page-container py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-8">Mon compte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
            <nav>
              <ul>
                {menuItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={`${mainPath}${item.path}`}
                      className={`flex items-center px-4 py-3 hover:bg-gray-50 transition-colors ${
                        isActive(item.path) 
                          ? 'bg-qwiik-lightBlue text-qwiik-blue font-medium border-l-4 border-qwiik-blue' 
                          : ''
                      }`}
                    >
                      <item.icon size={18} className="mr-3" />
                      <span>{item.label}</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={18} className="mr-3" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="md:col-span-3">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            
            {/* Redirect any other paths to profile */}
            <Route path="*" element={<Navigate to={`${mainPath}/profile`} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
