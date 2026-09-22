import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Package, Heart, Settings, LogOut, ChevronRight, Store } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';

const CustomerDashboard = () => {
  const { user, logout, orders } = useAppContext();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={`Welcome back, ${user.name}`} />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="p-2">
                {[
                  { id: 'orders', icon: Package, label: 'My Orders' },
                  { id: 'favorites', icon: Heart, label: 'Saved Products' },
                  { id: 'settings', icon: Settings, label: 'Account Settings' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      activeTab === item.id 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon size={18} className="mr-3" />
                      {item.label}
                    </div>
                    {activeTab === item.id && <ChevronRight size={16} />}
                  </button>
                ))}
                
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-2"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </button>
              </nav>

              {!user.sellerVerified && (
                <div className="p-4 bg-green-50 border-t border-green-100 m-2 rounded-xl">
                  <h4 className="font-bold text-green-800 text-sm mb-1">Are you a Farmer?</h4>
                  <p className="text-xs text-green-700 mb-3">Verify your occupation to start selling directly to customers.</p>
                  <Link to="/seller-verification" className="w-full flex justify-center items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                    <Store size={16} className="mr-2" />
                    Become a Seller
                  </Link>
                </div>
              )}

            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                  ))
                ) : (
                  <EmptyState 
                    title="No orders yet"
                    message="When you buy fresh produce, your orders will appear here."
                    actionText="Start Shopping"
                    actionLink="/explore"
                  />
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No saved items</h3>
                <p className="text-gray-500">Items you favorite will appear here.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h3>
                <p className="text-gray-500">Settings implementation pending.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
