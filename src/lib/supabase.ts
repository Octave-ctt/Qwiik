
import { createClient } from '@supabase/supabase-js';

// Fonction d'initialisation du client Supabase
// Utilise une fonction qui est appelée au moment où nous avons besoin du client
// plutôt qu'une initialisation immédiate
const createSupabaseClient = () => {
  const supabaseUrl = window.SUPABASE_URL;
  const supabaseAnonKey = window.SUPABASE_ANON_KEY;

  // Vérification de la présence des variables Supabase
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variables Supabase manquantes:', { 
      supabaseUrl: supabaseUrl ? 'définie' : 'non définie', 
      supabaseAnonKey: supabaseAnonKey ? 'définie' : 'non définie' 
    });
    throw new Error("Les variables Supabase ne sont pas définies");
  }

  // Créer le client Supabase
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Exporter le client Supabase à la demande
export const supabase = createSupabaseClient();

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
