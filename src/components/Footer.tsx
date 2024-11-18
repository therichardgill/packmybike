import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Github, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary-300" />
              <span className="text-xl font-bold text-gray-900">packmybike</span>
            </Link>
            <p className="text-gray-600">
              Connecting cyclists with secure bike transport solutions worldwide.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Github, href: 'https://github.com' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-300 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'How It Works', 'Pricing', 'Blog'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-600 hover:text-primary-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                'Help Center',
                'Safety Information',
                'Cancellation Options',
                'Contact Us'
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-600 hover:text-primary-300 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">
              Subscribe for updates and special offers
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
              />
              <button
                type="submit"
                className="w-full bg-primary-300 hover:bg-primary-400 text-gray-900 py-2 rounded-lg transition duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} packmybike. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;