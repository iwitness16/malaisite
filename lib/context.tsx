'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, AdminUser } from './types';

// Cart Context
interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('elitepartz-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('elitepartz-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) => prevItems.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Admin Auth Context
interface AdminContextType {
  user: AdminUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  // Load admin session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('elitepartz-admin-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.username && session.timestamp && Date.now() - session.timestamp < 86400000) {
          // 24 hour session timeout
          setUser({ username: session.username, isAuthenticated: true });
        } else {
          localStorage.removeItem('elitepartz-admin-session');
        }
      } catch (error) {
        console.error('Failed to load admin session:', error);
        localStorage.removeItem('elitepartz-admin-session');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple authentication check
    if (username === 'admin' && password === 'Malai123#') {
      const session = { username, timestamp: Date.now() };
      localStorage.setItem('elitepartz-admin-session', JSON.stringify(session));
      setUser({ username, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('elitepartz-admin-session');
    setUser(null);
  };

  return (
    <AdminContext.Provider value={{ user, login, logout, isAuthenticated: user?.isAuthenticated || false }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
