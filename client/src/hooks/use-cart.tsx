import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@shared/schema";

export interface CartItem {
  product: Product;
  quantity: number;
  duration: string;
  price: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, duration?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('digital-store-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('digital-store-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1, duration = "1") => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.duration === duration
      );

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.duration === duration
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Calculate price based on duration
      const basePrice = parseFloat(product.salePrice || product.price);
      let finalPrice = basePrice;
      
      if (duration === "3") finalPrice = basePrice * 2.8;
      else if (duration === "6") finalPrice = basePrice * 5.3;
      else if (duration === "12") finalPrice = basePrice * 10;

      return [...currentItems, {
        product,
        quantity,
        duration,
        price: finalPrice.toString()
      }];
    });
    
    setIsOpen(true);
  };

  const removeItem = (productId: number) => {
    setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        getTotalItems,
        getTotalPrice,
      }}
    >
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