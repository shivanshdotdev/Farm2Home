import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Package, ArrowRight } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import Rating from './Rating';
import Button from './Button';

const FarmerCard = ({ farmer, productCount = 0 }) => {
  if (!farmer) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      <div className="h-24 bg-primary-50 relative">
        {/* Placeholder banner */}
        <div className="absolute -bottom-10 left-6">
          <img 
            src={farmer.image} 
            alt={farmer.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
            loading="lazy"
          />
        </div>
      </div>
      
      <div className="px-6 pt-12 pb-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {farmer.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin size={14} className="mr-1 text-gray-400" />
              <span>{farmer.location}</span>
            </div>
          </div>
        </div>

        <div className="my-3">
          {farmer.verified && <VerifiedBadge />}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mt-2 mb-4 flex-grow">
          {farmer.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Package size={16} className="mr-1.5 text-primary-500" />
            <span className="font-medium">{productCount || Math.floor(Math.random() * 10) + 2} Products</span>
          </div>
          
          <Link to={`/farmer/${farmer.id}`}>
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 p-0 pr-2">
              View Profile <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerCard;
