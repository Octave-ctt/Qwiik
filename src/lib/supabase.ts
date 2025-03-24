
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Variable pour stocker l'instance du client Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// URL et clé Supabase directement dans le code (à remplacer par vos vraies valeurs)
const DIRECT_SUPABASE_URL = 'https://xyzcompany.supabase.co';
const DIRECT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZnRkb2Job2ZucWFlc3B2amViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTExMTUzNTcsImV4cCI6MjAyNjY5MTM1N30.w-S4wIm2NXmCKFIjoIyQV-Y8V0-x5v3SLDvCfQ2JtjQ';

// Fonction pour obtenir le client Supabase (lazy initialization)
export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  // Essayer d'obtenir les valeurs depuis l'environnement d'abord, puis utiliser les valeurs directes
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL || DIRECT_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || DIRECT_SUPABASE_ANON_KEY;

  console.log('Initialisation de Supabase avec:', { supabaseUrl });

  // Créer et mettre en cache le client Supabase
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  });
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
      profiles: {
        Row: {
          id: string;
          email: string | null;
          name: string | null;
          addresses: any[] | null;
          favorites: string[] | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          name?: string | null;
          addresses?: any[] | null;
          favorites?: string[] | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          name?: string | null;
          addresses?: any[] | null;
          favorites?: string[] | null;
          updated_at?: string | null;
        };
      };
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
