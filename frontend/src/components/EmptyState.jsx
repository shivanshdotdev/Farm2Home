import React from 'react';
import { PackageX } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon = PackageX, 
  title = "No items found", 
  message = "We couldn't find anything matching your criteria.",
  actionText,
  actionLink 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
      <div className="bg-earth-50 text-earth-800 p-4 rounded-full mb-4">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{message}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
