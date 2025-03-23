
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in" style={{ backgroundImage: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)', backgroundAttachment: 'fixed' }}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Qwiik</h3>
              <p className="text-sm text-gray-600">
                La livraison rapide de vos produits préférés en 30 minutes.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Catégories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/category/tech" className="nav-link">Tech</a></li>
                <li><a href="/category/beauty" className="nav-link">Beauté</a></li>
                <li><a href="/category/home" className="nav-link">Maison & Déco</a></li>
                <li><a href="/category/fashion" className="nav-link">Mode</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/how-it-works" className="nav-link">Comment ça marche</a></li>
                <li><a href="#" className="nav-link">Nos partenaires</a></li>
                <li><a href="#" className="nav-link">FAQ</a></li>
                <li><a href="#" className="nav-link">Nous contacter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="nav-link">Conditions d'utilisation</a></li>
                <li><a href="#" className="nav-link">Politique de confidentialité</a></li>
                <li><a href="#" className="nav-link">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Qwiik. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
