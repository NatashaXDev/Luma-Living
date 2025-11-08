import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Product, CartItem } from '../lib/supabase';
import { getSessionId } from '../lib/cart';

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

  const loadCart = async () => {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('session_id', sessionId);

    if (!error && data) {
      setCartItems(data);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addToCart = async (product: Product, quantity = 1) => {
    const sessionId = getSessionId();

    const existingItem = cartItems.find(item => item.product_id === product.id);

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          product_id: product.id,
          quantity,
        });

      if (!error) {
        await loadCart();
      }
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (!error) {
      await loadCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      await loadCart();
    }
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (!error) {
      setCartItems([]);
    }
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
