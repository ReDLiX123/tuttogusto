'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Cart } from '@/domain/entities/Cart';
import { Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

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

interface ToastMessage {
  id: string;
  title: string;
  count: number;
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
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Helper to parse cart from storage string
  const parseStorageCart = useCallback((saved: string | null): Cart => {
    const newCart = new Cart();
    if (!saved) return newCart;
    try {
      const parsed: SerializedCartItem[] = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (item?.product?.id && item.quantity > 0) {
            const product = ProductFactory.create(item.product as any);
            newCart.addItem(product, item.quantity);
          }
        });
      }
    } catch (e) {
      console.error('Failed to parse cart from storage:', e);
    }
    return newCart;
  }, []);

  // Initial load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    setCart(parseStorageCart(saved));
    setIsInitialized(true);
  }, [parseStorageCart]);

  // Sync state between browser tabs using window 'storage' event listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        setCart(parseStorageCart(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [parseStorageCart]);

  // Save cart to localStorage on changes
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
    if (!product || !product.id) return;
    const safeQty = Math.max(1, Math.floor(isNaN(quantity) ? 1 : quantity));

    const updated = new Cart([...cart.items]);
    updated.addItem(product, safeQty);
    setCart(updated);
    setIsDrawerOpen(true);

    // Trigger visual toast feedback
    setToast({
      id: `${product.id}-${Date.now()}`,
      title: product.title,
      count: safeQty,
    });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const removeFromCart = (productId: string) => {
    if (!productId) return;
    const updated = new Cart([...cart.items]);
    updated.removeItem(productId);
    setCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!productId) return;
    const safeQty = isNaN(quantity) ? 0 : quantity;
    const updated = new Cart([...cart.items]);
    updated.updateQuantity(productId, safeQty);
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

      {/* Floating Visual Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-[#D4A373]/50 text-stone-100 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3.5"
          >
            <div className="p-2 bg-[#D4A373]/20 rounded-xl text-[#D4A373]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-[#D4A373] flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5" /> Добавлено в корзину
              </p>
              <p className="text-xs font-semibold text-stone-200 mt-0.5 truncate max-w-[220px]">
                {toast.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
