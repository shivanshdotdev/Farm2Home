import React from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-7892',
    date: '2026-09-15',
    status: 'Delivered',
    amount: '₹450',
    farmerName: 'Anil Sharma',
    products: ['Fresh Tomatoes', 'Organic Potatoes']
  },
  {
    id: 'ORD-7945',
    date: '2026-09-20',
    status: 'In Transit',
    amount: '₹820',
    farmerName: 'Ram Singh',
    products: ['Desi Ghee', 'Wheat Flour']
  }
];

const UserOrders = () => {
  const { user } = useAppContext();

  // Defensive check
  if (!user) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary-100 text-primary-700 p-2 rounded-lg">
          <Package size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {mockOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID & Date</th>
                  <th className="px-6 py-4 font-medium">Products</th>
                  <th className="px-6 py-4 font-medium">Farmer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{order.id}</div>
                      <div className="text-gray-500">{order.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">
                        {order.products.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {order.farmerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="outline" size="sm" className="inline-flex items-center gap-1.5">
                        Details <ExternalLink size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders with our farmers.</p>
            <Button variant="primary">Start Exploring</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
