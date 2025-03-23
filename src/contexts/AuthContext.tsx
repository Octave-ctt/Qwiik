
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../utils/data';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would call an API
    // For demo, we'll just check if the user exists in localStorage
    const usersJson = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersJson);
    
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }
    
    // Remove password before storing in state/localStorage
    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
  };

  const register = async (email: string, password: string, name: string) => {
    // In a real app, this would call an API
    const usersJson = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersJson);
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: `u${Date.now()}`,
      email,
      name,
      password,
      addresses: [],
      favorites: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Remove password before storing in state/localStorage
    const { password: _, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    localStorage.setItem('currentUser', JSON.stringify(safeUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
