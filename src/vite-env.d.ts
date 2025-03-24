
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Étendre l'interface Window pour inclure STRIPE_PUBLIC_KEY
interface Window {
  STRIPE_PUBLIC_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}
