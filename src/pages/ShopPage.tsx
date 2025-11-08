import { useEffect, useState } from 'react';
import { supabase, Product, Category } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/cart';

interface ShopPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function ShopPage({ onNavigate }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const loadProducts = async () => {
    let query = supabase.from('products').select('*');

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query.order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our full range of minimalist homeware, from elegant décor to handcrafted ceramics
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 text-sm tracking-wide transition-colors ${
              selectedCategory === null
                ? 'bg-gray-900 text-white'
                : 'border border-gray-300 text-gray-700 hover:border-gray-900'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 text-sm tracking-wide transition-colors ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-gray-900'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div
                  onClick={() => onNavigate('product', product.slug)}
                  className="aspect-square bg-gray-100 mb-4 overflow-hidden cursor-pointer"
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
                  className="text-lg font-light text-gray-900 mb-2 cursor-pointer group-hover:text-gray-600 transition-colors"
                >
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
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
        )}
      </div>
    </div>
  );
}
