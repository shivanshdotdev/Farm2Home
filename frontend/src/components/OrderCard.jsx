import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';
import Button from './Button';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={16} className="mr-1" />;
      case 'Processing': return <Clock size={16} className="mr-1" />;
      default: return <Package size={16} className="mr-1" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order #{order.id}</p>
          <p className="text-sm font-medium text-gray-900">{order.date}</p>
        </div>
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          {order.status}
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.quantity}x {item.name}</span>
            <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="font-medium text-gray-900">Total: ₹{order.total}</span>
        <Button variant="outline" size="sm">View Details</Button>
      </div>
    </div>
  );
};

export default OrderCard;
