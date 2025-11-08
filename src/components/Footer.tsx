export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4 text-gray-900">LUMA LIVING</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Creating beautiful spaces through refined design and natural elegance.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4 text-gray-900">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Home Décor</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Candles</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Linen</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Ceramics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4 text-gray-900">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Shipping</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium tracking-wide mb-4 text-gray-900">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe for design inspiration and updates.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2025 Luma Living. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
