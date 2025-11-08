import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/cart';

interface HomePageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(4);

    if (data) {
      setFeaturedProducts(data);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-light tracking-wide text-gray-900 mb-6">
            Simplicity Meets Elegance
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of minimalist homeware designed to bring calm and beauty to your living spaces.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked pieces that embody our philosophy of refined simplicity
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div
                  onClick={() => onNavigate('product', product.slug)}
                  className="aspect-square bg-gray-100 mb-4 overflow-hidden"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                </div>
                <h3
                  onClick={() => onNavigate('product', product.slug)}
                  className="text-lg font-light text-gray-900 mb-2 group-hover:text-gray-600 transition-colors"
                >
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium">{formatCurrency(product.price)}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 text-sm tracking-wide hover:border-gray-900 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-light mb-3 text-gray-900">Curated Selection</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every piece is thoughtfully chosen to complement modern minimalist living
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-light mb-3 text-gray-900">South African Made</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Supporting local artisans and sustainable production methods
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-light mb-3 text-gray-900">Quality First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Timeless designs crafted with attention to detail and longevity
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
