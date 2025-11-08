import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase, Order } from '../lib/supabase';
import { formatCurrency } from '../lib/cart';

interface ConfirmationPageProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

export default function ConfirmationPage({ orderId, onNavigate }: ConfirmationPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (data) {
      setOrder(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button
            onClick={() => onNavigate('home')}
            className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
            Order Confirmed
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order, {order.customer_name}!
          </p>
          <p className="text-sm text-gray-500">
            We've sent a confirmation email to {order.customer_email}
          </p>
        </div>

        <div className="bg-gray-50 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-3">Order Number</h2>
              <p className="text-lg font-mono">{order.order_number}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-3">Order Total</h2>
              <p className="text-lg">{formatCurrency(order.total_amount)}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h2>
              <p className="text-gray-700 capitalize">{order.payment_method}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {order.shipping_address}<br />
                {order.city}, {order.postal_code}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 mb-8">
          <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. You'll receive an order confirmation email shortly</li>
            <li>2. We'll process your payment and prepare your items</li>
            <li>3. Your order will be shipped within 2-3 business days</li>
            <li>4. Delivery typically takes 3-5 business days</li>
          </ul>
        </div>

        <div className="text-center space-y-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-block px-8 py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="text-gray-900 hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
