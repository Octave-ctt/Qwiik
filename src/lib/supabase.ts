
import { createClient } from '@supabase/supabase-js';

// Variable pour stocker l'instance du client Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Fonction pour obtenir le client Supabase (lazy initialization)
export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = window.SUPABASE_URL;
  const supabaseAnonKey = window.SUPABASE_ANON_KEY;

  // Vérification de la présence des variables Supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables Supabase manquantes:', { 
      supabaseUrl: supabaseUrl ? 'définie' : 'non définie', 
      supabaseAnonKey: supabaseAnonKey ? 'définie' : 'non définie' 
    });
    // Utiliser des valeurs par défaut si non définies
    const defaultUrl = 'https://ttjqnpfoulphvrckltim.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0anFucGZvdWxwaHZyY2tsdGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTQ0NDYsImV4cCI6MjA1ODM5MDQ0Nn0.qaYK2zPjE8vQs4UCNGXYQqkBjJfwX073UoUdHXEH0bI';
    
    console.log('Utilisation des valeurs par défaut pour Supabase');
    supabaseInstance = createClient(defaultUrl, defaultKey);
    return supabaseInstance;
  }

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
