
import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 animate-fade-in">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-qwiik-lightBlue flex items-center justify-center text-qwiik-blue mx-auto mb-6">
          <span className="text-5xl font-bold">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page non trouvée</h1>
        <p className="text-gray-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/"
            className="btn-primary flex items-center"
          >
            <Home className="mr-2" size={18} />
            Retour à l'accueil
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="mr-2" size={18} />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
