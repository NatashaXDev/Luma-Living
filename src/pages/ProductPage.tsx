import { useEffect, useState } from 'react';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/cart';

interface ProductPageProps {
  slug: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function ProductPage({ slug, onNavigate }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => onNavigate('shop')}
            className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-gray-900 font-medium mb-6">
              {formatCurrency(product.price)}
            </p>

            <div className="prose prose-gray mb-8">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-700 mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-gray-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors mb-4"
            >
              Add to Cart
            </button>

            <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Product Details</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Free shipping on orders over R500</li>
                  <li>Delivery within 3-5 business days</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
