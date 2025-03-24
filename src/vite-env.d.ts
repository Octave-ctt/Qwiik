
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

// Définir la clé Stripe globalement pour l'utiliser dans toute l'application
window.STRIPE_PUBLIC_KEY = 'pk_live_51R48HiBD1jNEQIjBKEt8E1pNwyupyqIfZQkvx0yYB1n3BR849TTNNHU6E3Ryk4mwuqDcc3912o8Ke3zhPvpWujet008AgI4VyT';
