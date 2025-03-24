
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Variable pour stocker l'instance du client Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// URL et clé Supabase de l'utilisateur
const SUPABASE_URL = 'https://ttjqnpfoulphvrckltim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0anFucGZvdWxwaHZyY2tsdGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTQ0NDYsImV4cCI6MjA1ODM5MDQ0Nn0.qaYK2zPjE8vQs4UCNGXYQqkBjJfwX073UoUdHXEH0bI';

// Fonction pour obtenir le client Supabase (lazy initialization)
export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  
  console.log('Initialisation de Supabase avec URL:', SUPABASE_URL);

  // Créer et mettre en cache le client Supabase
  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  });
  return supabaseInstance;
};

// Pour la compatibilité avec le code existant
export const supabase = getSupabase();

// Re-exporter les types
export type { Database };
