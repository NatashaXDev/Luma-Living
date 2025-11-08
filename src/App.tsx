import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import JournalPage from './pages/JournalPage';
import ContactPage from './pages/ContactPage';

type Page = 'home' | 'shop' | 'product' | 'checkout' | 'confirmation' | 'journal' | 'contact' | 'article';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageSlug, setPageSlug] = useState<string>('');
  const [cartOpen, setCartOpen] = useState(false);

  const handleNavigate = (page: string, slug?: string) => {
    setCurrentPage(page as Page);
    setPageSlug(slug || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          onCartClick={() => setCartOpen(true)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        <main className="flex-1">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'shop' && <ShopPage onNavigate={handleNavigate} />}
          {currentPage === 'product' && <ProductPage slug={pageSlug} onNavigate={handleNavigate} />}
          {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
          {currentPage === 'confirmation' && <ConfirmationPage orderId={pageSlug} onNavigate={handleNavigate} />}
          {currentPage === 'journal' && <JournalPage onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        </main>

        <Footer />

        <Cart
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />
      </div>
    </CartProvider>
  );
}

export default App;
