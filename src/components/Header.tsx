import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ onCartClick, currentPage, onNavigate }: HeaderProps) {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'Shop', path: 'shop' },
    { name: 'Journal', path: 'journal' },
    { name: 'Contact', path: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl font-light tracking-wider text-gray-900 hover:text-gray-600 transition-colors"
          >
            LUMA LIVING
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`text-sm tracking-wide transition-colors ${
                  currentPage === item.path
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-6">
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm tracking-wide transition-colors ${
                  currentPage === item.path
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
