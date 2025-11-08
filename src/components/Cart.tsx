import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/cart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, total } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-light tracking-wide">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {formatCurrency(product.price)}
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(product.price * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-light">Total</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
