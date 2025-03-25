
import React, { useContext, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const auth = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");

  const openLoginModal = () => {
    setAuthType("login");
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthType("register");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/lovable-uploads/014e3b8a-5658-413c-b8de-8281e290cdc6.png" 
                  alt="Qwiik Logo" 
                  className="h-8 w-auto mr-2"
                />
                <h3 className="font-bold text-lg">Qwiik</h3>
              </div>
              <p className="text-gray-600">
                Livraison rapide de vos produits préférés en 30 minutes.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Service client</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-gray-600 hover:text-gray-900">
                    Mon compte
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Téléchargez notre app</h3>
              <div className="flex space-x-2">
                <Button variant="outline" className="text-xs px-3">
                  App Store
                </Button>
                <Button variant="outline" className="text-xs px-3">
                  Google Play
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Qwiik. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={authType}
      />
    </div>
  );
};

export default MainLayout;
