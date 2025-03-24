
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavoritesPage from "../components/account/FavoritesPage";
import OrdersPage from "../components/account/OrdersPage";
import { Home, Key, MapPin, ShoppingBag, User } from "lucide-react";
import { supabase } from "../lib/supabase";

// Type pour les adresses
interface Address {
  name: string;
  street: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
}

const AccountPage = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (!isAuthenticated || !currentUser) {
      return;
    }
    
    // Récupérer l'adresse depuis Supabase
    const fetchAddress = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('addresses')
          .eq('id', currentUser.id)
          .single();
        
        if (error) throw error;
        
        if (data && data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
          setSavedAddress(data.addresses[0] as Address);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'adresse:', error);
      }
    };
    
    fetchAddress();
  }, [currentUser, isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Show loading state while auth is being checked or redirecting
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Mon compte</h1>
        <p className="mb-4">Vous devez être connecté pour accéder à cette page.</p>
        <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Mon compte</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg"><User className="mr-2" size={20} />Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <p><strong>Nom :</strong> {currentUser.name}</p>
                <p><strong>Email :</strong> {currentUser.email}</p>
              </div>
              <div className="mt-4">
                <Link to="/account/change-password">
                  <Button variant="outline" className="w-full sm:w-auto flex items-center">
                    <Key className="mr-2" size={16} />
                    Changer le mot de passe
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg"><MapPin className="mr-2" size={20} />Adresse de livraison</CardTitle>
            </CardHeader>
            <CardContent>
              {savedAddress ? (
                <div className="flex flex-col space-y-2">
                  <p>{savedAddress.name}</p>
                  <p>{savedAddress.street}</p>
                  <p>{savedAddress.zipCode} {savedAddress.city}</p>
                  <p>{savedAddress.phoneNumber}</p>
                  <div className="mt-4">
                    <Link to="/account/address">
                      <Button variant="outline" className="w-full sm:w-auto flex items-center">
                        <Home className="mr-2" size={16} />
                        Modifier l'adresse
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Vous n'avez pas encore ajouté d'adresse.</p>
                  <Link to="/account/address">
                    <Button variant="outline" className="w-full sm:w-auto flex items-center">
                      <Home className="mr-2" size={16} />
                      Ajouter une adresse
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="pt-4">
            <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto">
              Se déconnecter
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersPage />
        </TabsContent>
        
        <TabsContent value="favorites">
          <FavoritesPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
