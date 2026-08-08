'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';

interface SerializedCartItem {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    type: string;
    weightVolume?: string;
    prepTime?: number;
    discount?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    categoryId: string;
  };
  quantity: number;
}

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tuttogusto_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(new Cart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: SerializedCartItem[] = JSON.parse(saved);
        const newCart = new Cart();
        parsed.forEach((item) => {
          const product = ProductFactory.create(item.product);
          newCart.addItem(product, item.quantity);
        });
        setCart(newCart);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const serialized = cart.items.map((item) => ({
        product: {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description,
          price: item.product.price,
          image: item.product.image,
          type: item.product.type,
          weightVolume: item.product.weightVolume,
          prepTime: item.product.prepTime,
          discount: item.product.discount,
          isAvailable: item.product.isAvailable,
          isFeatured: item.product.isFeatured,
          categoryId: item.product.categoryId,
        },
        quantity: item.quantity,
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serialized));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const updated = new Cart([...cart.items]);
    updated.addItem(product, quantity);
    setCart(updated);
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updated = new Cart([...cart.items]);
    updated.removeItem(productId);
    setCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updated = new Cart([...cart.items]);
    updated.updateQuantity(productId, quantity);
    setCart(updated);
  };

  const clearCart = () => {
    setCart(new Cart());
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
