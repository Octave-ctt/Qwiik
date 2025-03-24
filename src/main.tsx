
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

// Définir les clés Supabase et Stripe comme variables globales
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  // Utiliser une clé publique de test par défaut
  // Note: C'est une clé de test, donc elle peut être exposée dans le code
  window.STRIPE_PUBLIC_KEY = 'pk_test_51R48HpB4m9hLsjhWC0CHFeQzsb0sBGGwA2503uiNCcuiFLHnuhvqqevIToVBFuh2wSKVCXTfmlBJlpnhLoVriO1T00X3VMqmdu';
}

// Définir explicitement les variables Supabase avec les valeurs fournies
// Les affecter au démarrage avant tout import de Supabase
window.SUPABASE_URL = 'https://ttjqnpfoulphvrckltim.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0anFucGZvdWxwaHZyY2tsdGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTQ0NDYsImV4cCI6MjA1ODM5MDQ0Nn0.qaYK2zPjE8vQs4UCNGXYQqkBjJfwX073UoUdHXEH0bI';

// Afficher un message pour les variables d'environnement Supabase
console.log('SUPABASE_URL:', window.SUPABASE_URL ? 'définie' : 'non définie');
console.log('SUPABASE_ANON_KEY:', window.SUPABASE_ANON_KEY ? 'définie' : 'non définie');

// Ne pas initialiser Supabase ici pour éviter les références circulaires
// L'initialisation se fait dans lib/supabase.ts

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
