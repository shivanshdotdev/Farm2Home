import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Leaf, User, LogOut, Settings, Package, Store, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from './Button';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { cart, user, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Farmers', path: '/farmers' },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle clicking outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    // Handle Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Farm<span className="text-primary-600">2</span>Home
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 hover:text-primary-600 transition-colors p-2">
              <Search size={20} />
            </button>
            
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="bg-primary-100 text-primary-700 p-1.5 rounded-full">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none overflow-hidden origin-top-right">
                    <div className="px-4 py-3 bg-gray-50/50">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 size={12} />
                        Verified User
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3 text-gray-400" />
                        My Profile
                      </Link>
                      
                      {user.sellerVerified ? (
                        <>
                          <Link 
                            to="/seller/dashboard" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Store size={16} className="mr-3 text-gray-400" />
                            Farmer Dashboard
                          </Link>
                          <Link 
                            to="/seller/products" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Package size={16} className="mr-3 text-gray-400" />
                            My Products
                          </Link>
                          <Link 
                            to="/seller/orders" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Package size={16} className="mr-3 text-gray-400" />
                            Orders
                          </Link>
                          <Link 
                            to="/profile/settings" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Settings size={16} className="mr-3 text-gray-400" />
                            Account Settings
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link 
                            to="/orders" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Package size={16} className="mr-3 text-gray-400" />
                            My Orders
                          </Link>
                          <Link 
                            to="/seller-verification" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Store size={16} className="mr-3 text-gray-400" />
                            Become a Seller
                          </Link>
                        </>
                      )}
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-500">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-3 space-y-1 shadow-lg absolute w-full left-0 z-50">
          <div className="px-3 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-2">
            {user ? (
              <div className="px-4 space-y-3 pb-3">
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 text-primary-700 p-2 rounded-full mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{user.name}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <CheckCircle2 size={12} />
                      Verified User
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-1">
                  <Link 
                    to="/profile" 
                    className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} className="mr-3 text-gray-500" />
                    My Profile
                  </Link>
                  
                  {user.sellerVerified ? (
                    <>
                      <Link 
                        to="/seller/dashboard" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Store size={18} className="mr-3 text-gray-500" />
                        Farmer Dashboard
                      </Link>
                      <Link 
                        to="/seller/products" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package size={18} className="mr-3 text-gray-500" />
                        My Products
                      </Link>
                      <Link 
                        to="/seller/orders" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package size={18} className="mr-3 text-gray-500" />
                        Orders
                      </Link>
                      <Link 
                        to="/profile/settings" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings size={18} className="mr-3 text-gray-500" />
                        Account Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/orders" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package size={18} className="mr-3 text-gray-500" />
                        My Orders
                      </Link>
                      <Link 
                        to="/seller-verification" 
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Store size={18} className="mr-3 text-gray-500" />
                        Become a Seller
                      </Link>
                    </>
                  )}
                  
                  
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 mt-2"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 space-y-3 pb-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="outline" fullWidth>Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                  <Button variant="primary" fullWidth>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
