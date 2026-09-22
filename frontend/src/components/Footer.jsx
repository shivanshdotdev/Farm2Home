import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-earth-900 text-earth-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500 text-white p-1.5 rounded-lg">
                <Leaf size={24} />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Farm<span className="text-primary-500">2</span>Home
              </span>
            </Link>
            <p className="text-earth-200 mb-6">
              Connecting you directly with verified farmers. Eat fresh, eat healthy, support local agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-earth-200 hover:text-white transition-colors font-medium">
                FB
              </a>
              <a href="#" className="text-earth-200 hover:text-white transition-colors font-medium">
                TW
              </a>
              <a href="#" className="text-earth-200 hover:text-white transition-colors font-medium">
                IG
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-earth-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/explore" className="text-earth-200 hover:text-white transition-colors">Explore</Link></li>
              <li><Link to="/farmers" className="text-earth-200 hover:text-white transition-colors">Farmers</Link></li>
              <li><Link to="/about" className="text-earth-200 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-earth-200 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-earth-200 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="text-earth-200 hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-earth-200 hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Newsletter</h3>
            <p className="text-earth-200 mb-4">Subscribe to get updates on fresh produce and offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="bg-earth-800 border-none rounded-l-lg py-2 px-4 w-full text-white placeholder-earth-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-500 text-white rounded-r-lg px-4 py-2 transition-colors flex items-center justify-center"
              >
                <Mail size={20} />
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-earth-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-earth-200">
          <p>&copy; {new Date().getFullYear()} Farm2Home. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
