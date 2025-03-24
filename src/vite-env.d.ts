
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Étendre l'interface Window pour inclure STRIPE_PUBLIC_KEY
interface Window {
  STRIPE_PUBLIC_KEY?: string;
}
