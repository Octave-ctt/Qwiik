
import { createClient } from '@supabase/supabase-js';

// Variable pour stocker l'instance du client Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Fonction pour obtenir le client Supabase (lazy initialization)
export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  // Vérifier si les variables d'environnement Supabase sont disponibles via import.meta.env ou window
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY;

  // Vérification de la présence des variables Supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables Supabase manquantes. Veuillez vous connecter via l\'intégration native Lovable.');
    
    // Retourner un client simulé avec des méthodes factices pour éviter les erreurs
    // @ts-ignore - client simulé pour le développement
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase non configuré') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase non configuré') }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        upsert: () => Promise.resolve({ error: null })
      })
    };
  }

  console.log('Initialisation de Supabase avec:', { supabaseUrl });

  // Créer et mettre en cache le client Supabase
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Pour la compatibilité avec le code existant
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabase();
    // @ts-ignore
    return client[prop];
  }
});

// Types pour la base de données
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category_id?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: string;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          total?: number;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quantity?: number;
          price?: number;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quantity?: number;
        };
      };
    };
  };
};
