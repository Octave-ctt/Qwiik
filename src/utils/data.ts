import { Product } from "../components/ProductCard";

export const products: Product[] = [
  {
    id: "1",
    name: "Écouteurs sans fil",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1000",
    rating: 4.8,
    reviewCount: 342,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "2",
    name: "Bracelet connecté fitness",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000",
    rating: 4.6,
    reviewCount: 187,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "3",
    name: "Crème hydratante visage",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1000",
    rating: 4.9,
    reviewCount: 276,
    deliveryTime: "30 min",
    category: "beauty"
  },
  {
    id: "4",
    name: "Lampe de table design",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000",
    rating: 4.7,
    reviewCount: 112,
    deliveryTime: "30 min",
    category: "home"
  },
  {
    id: "5",
    name: "Google Home Mini",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=1000",
    rating: 4.9,
    reviewCount: 521,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "6",
    name: "Manette PlayStation 5",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000",
    rating: 4.8,
    reviewCount: 198,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "7",
    name: "Mini enceinte Bluetooth",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1000",
    rating: 4.6,
    reviewCount: 165,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "8",
    name: "Parfum de luxe homme",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000",
    rating: 4.9,
    reviewCount: 289,
    deliveryTime: "30 min",
    category: "beauty"
  },
  {
    id: "12",
    name: "Chargeur sans fil",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000",
    rating: 4.7,
    reviewCount: 345,
    deliveryTime: "30 min",
    category: "tech"
  },
  {
    id: "13",
    name: "Micro Adaptateur USB",
    price: 0.03,
    image: "https://images.unsplash.com/photo-1589634749000-1e72e2c5f384?q=80&w=1000",
    rating: 4.5,
    reviewCount: 42,
    deliveryTime: "30 min",
    category: "tech"
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const searchProducts = (query: string, category: string = 'all'): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  
  let filteredProducts = products;
  
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.category === category
    );
  }
  
  return filteredProducts.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};

export const featuredProducts = products.slice(0, 6);
export const bestSellers = [products[4], products[2], products[0], products[5], products[1], products[7]];

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  addresses: Address[];
  favorites?: string[]; // Array of product IDs
};

export type Address = {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  date: Date;
  status: 'pending' | 'delivered' | 'canceled';
  items: CartItem[];
  total: number;
  deliveryAddress: Address;
};

// Les données mockées sont maintenant stockées dans localStorage
// Initialisons les données au premier chargement si elles n'existent pas
export const initializeData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
  }
};

// Mock user non plus utilisé directement
export const mockUser: User = {
  id: "u1",
  email: "user@example.com",
  name: "Jean Dupont",
  addresses: [
    {
      id: "a1",
      street: "123 Rue de Paris",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      isDefault: true
    }
  ],
  favorites: []
};

// Fonctions pour gérer les favoris
export const addToFavorites = (userId: string, productId: string): boolean => {
  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  
  const userIndex = users.findIndex((u: User) => u.id === userId);
  if (userIndex === -1) return false;
  
  if (!users[userIndex].favorites) {
    users[userIndex].favorites = [];
  }
  
  if (!users[userIndex].favorites.includes(productId)) {
    users[userIndex].favorites.push(productId);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user in localStorage if it's the same user
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.id === userId) {
        currentUser.favorites = users[userIndex].favorites;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
    
    return true;
  }
  
  return false;
};

export const removeFromFavorites = (userId: string, productId: string): boolean => {
  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  
  const userIndex = users.findIndex((u: User) => u.id === userId);
  if (userIndex === -1) return false;
  
  if (!users[userIndex].favorites) {
    return false;
  }
  
  const favIndex = users[userIndex].favorites.indexOf(productId);
  if (favIndex !== -1) {
    users[userIndex].favorites.splice(favIndex, 1);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user in localStorage if it's the same user
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.id === userId) {
        currentUser.favorites = users[userIndex].favorites;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
    
    return true;
  }
  
  return false;
};

export const getFavorites = (userId: string): Product[] => {
  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  
  const user = users.find((u: User) => u.id === userId);
  if (!user || !user.favorites) return [];
  
  return products.filter(product => user.favorites.includes(product.id));
};

export const isFavorite = (userId: string, productId: string): boolean => {
  const usersJson = localStorage.getItem('users') || '[]';
  const users = JSON.parse(usersJson);
  
  const user = users.find((u: User) => u.id === userId);
  if (!user || !user.favorites) return false;
  
  return user.favorites.includes(productId);
};

// Fonctions pour gérer les commandes
export const addOrder = (userId: string, order: Omit<Order, 'id'>): string => {
  const ordersJson = localStorage.getItem('orders') || '[]';
  const orders = JSON.parse(ordersJson);
  
  const orderId = `o${Date.now()}`;
  const newOrder = {
    ...order,
    id: orderId
  };
  
  orders.push({
    ...newOrder,
    userId
  });
  
  localStorage.setItem('orders', JSON.stringify(orders));
  return orderId;
};

export const getUserOrders = (userId: string): Order[] => {
  const ordersJson = localStorage.getItem('orders') || '[]';
  const orders = JSON.parse(ordersJson);
  
  return orders
    .filter((order: any) => order.userId === userId)
    .map((order: any) => {
      const { userId, ...orderData } = order;
      return {
        ...orderData,
        date: new Date(orderData.date) // Convert date string back to Date object
      };
    });
};

export const categories = [
  { name: 'Tech', slug: 'tech', image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1000' },
  { name: 'Beauté', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000' },
  { name: 'Maison & Déco', slug: 'home', image: 'https://images.unsplash.com/photo-1591130901921-3f0652bb3915?q=80&w=1000' }
];
