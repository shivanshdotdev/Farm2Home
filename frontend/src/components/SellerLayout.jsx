import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, TrendingUp, Settings, LogOut, Store } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SellerLayout = ({ children, title }) => {
  const { user, logout } = useAppContext();
  const location = useLocation();

  if (!user || !user.sellerVerified) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/seller/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/seller/profile', icon: Store, label: 'Farmer Profile' },
    { path: '/seller/products', icon: Package, label: 'My Products' },
    { path: '/seller/orders', icon: TrendingUp, label: 'Sales & Orders' },
    { path: '/profile/settings', icon: Settings, label: 'Account Settings' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 flex items-center space-x-4 bg-earth-50">
                <div className="w-12 h-12 rounded-full bg-earth-200 text-earth-800 flex items-center justify-center font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-green-600 font-medium border border-green-200 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1 flex items-center gap-1">
                    ✓ Verified Farmer
                  </p>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path || (item.path !== '/seller/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-earth-100 text-earth-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon size={18} className="mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;
