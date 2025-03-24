
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

// Définir la clé de Stripe comme variable globale si non définie
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  // Utiliser une clé publique de test par défaut
  // Note: C'est une clé de test, donc elle peut être exposée dans le code
  window.STRIPE_PUBLIC_KEY = 'pk_test_51R48HpB4m9hLsjhWC0CHFeQzsb0sBGGwA2503uiNCcuiFLHnuhvqqevIToVBFuh2wSKVCXTfmlBJlpnhLoVriO1T00X3VMqmdu';
}

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
