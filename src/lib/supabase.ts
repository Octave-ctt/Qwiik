
import { createClient } from '@supabase/supabase-js';

// Utiliser les variables d'environnement ou les valeurs définies dans main.tsx
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY;

// Créer le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
