import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../lib/supabase';

interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from memory on mount
  const loadCart = async () => {
    // Cart is already in state, nothing to load from external source
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    const existingItem = cartItems.find(item => item.product_id === product.id);

    if (existingItem) {
      // Update existing item quantity
      setCartItems(cartItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_id: product.id,
        product: product,
        quantity: quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = async (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}