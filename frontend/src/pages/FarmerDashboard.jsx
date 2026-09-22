import React from 'react';
import { Link } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';

const FarmerDashboard = () => {
  return (
    <SellerLayout title="Farmer Portal">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">₹24,500</h3>
            <p className="text-sm text-green-600 mt-2 font-medium">+12% this month</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
            <h3 className="text-3xl font-bold text-gray-900">12</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">4 need restocking</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
            <h3 className="text-3xl font-bold text-gray-900">5</h3>
            <p className="text-sm text-yellow-600 mt-2 font-medium">Requires action</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Link to="/seller/orders" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
          </div>
          <div className="p-6 text-center text-gray-500">
            No recent orders.
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default FarmerDashboard;
