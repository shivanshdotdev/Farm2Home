import React from 'react';
import { Navigate } from 'react-router-dom';
import { PackageX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SellerLayout from '../components/SellerLayout';

const SellerOrders = () => {
  const { user } = useAppContext();
  
  if (!user || !user.sellerVerified || !user.farmerId) {
    return <Navigate to="/login" replace />;
  }

  // Since we don't have mock orders yet, we'll just show an empty state.
  return (
    <SellerLayout title="Orders">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        
        <div className="p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageX size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            You don't have any pending or past orders right now. When customers buy your products, they will appear here.
          </p>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerOrders;
