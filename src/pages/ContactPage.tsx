import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products or need styling advice, we're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900"
                  placeholder="Your name"
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
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-light mb-8 text-gray-900">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">hello@lumaliving.co.za</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+27 21 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Showroom</h3>
                    <p className="text-gray-600">
                      123 Long Street<br />
                      Cape Town, 8001<br />
                      South Africa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
