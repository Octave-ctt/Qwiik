
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  addresses: any[];
  favorites: string[];
}

interface AuthContextType {
  currentUser: UserProfile | null;
  user: UserProfile | null; // Pour compatibilité avec le code existant
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  user: null,
  session: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Configurer l'écouteur pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Vérifier si un profil existe déjà pour cet utilisateur
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Si le profil existe, l'utiliser
      if (profiles) {
        setCurrentUser({
          id: profiles.id as string,
          email: user?.email || '',
          name: profiles.name as string || '',
          addresses: profiles.addresses as any[] || [],
          favorites: profiles.favorites as string[] || []
        });
      } else {
        // Sinon, créer un profil par défaut
        const newProfile = {
          id: userId,
          email: user?.email || '',
          name: user?.email?.split('@')[0] || 'Utilisateur',
          addresses: [] as any[],
          favorites: [] as string[]
        };
        
        // Créer le profil dans la base de données
        await supabase.from('profiles').upsert([{
          id: userId,
          name: newProfile.name,
          addresses: [],
          favorites: []
        }]);
        
        setCurrentUser(newProfile);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre profil.",
        variant: "destructive"
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à votre compte."
      });
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Échec de la connexion. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous êtes maintenant connecté."
      });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Échec de l'inscription. Veuillez réessayer.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté de votre compte."
      });
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Échec de la déconnexion. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const value = {
    currentUser,
    user: currentUser, // Pour compatibilité avec le code existant
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!session || !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
