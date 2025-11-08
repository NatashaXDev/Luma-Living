import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/cart';
import { supabase } from '../lib/supabase';

interface CheckoutPageProps {
  onNavigate: (page: string, orderId?: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cartItems, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'payfast',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderNumber = `LUM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          total_amount: total,
          payment_method: formData.paymentMethod,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError || !order) {
        throw new Error('Failed to create order');
      }

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error('Failed to add order items');
      }

      await clearCart();
      onNavigate('confirmation', order.id);
    } catch (error) {
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => onNavigate('shop')}
            className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-light mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-light mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-light mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="payfast"
                      checked={formData.paymentMethod === 'payfast'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-sm">PayFast</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="ozow"
                      checked={formData.paymentMethod === 'ozow'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-sm">Ozow</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:border-gray-900 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="eft"
                      checked={formData.paymentMethod === 'eft'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mr-3"
                    />
                    <span className="text-sm">EFT</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="text-xl font-light mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-white">
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
                        <h3 className="text-sm font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm text-gray-900">
                        {formatCurrency(product.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{total >= 500 ? 'Free' : formatCurrency(60)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(total >= 500 ? total : total + 60)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
