import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingCart, Info } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import Rating from './Rating';
import Button from './Button';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  if (!product) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-gray-900 shadow-sm">
          ₹{product.price} / {product.unit}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
              {product.categoryName}
            </span>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-bold text-gray-900 mt-2 hover:text-primary-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>

        <div className="mt-auto pt-4 space-y-3">
          {product.farmer && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">Farmer: {product.farmer.name}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1 mb-2">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{product.farmer.location}</span>
              </div>
              {product.farmer.verified && <VerifiedBadge />}
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button 
              variant="primary" 
              fullWidth 
              className="flex gap-2"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart size={18} />
              Add
            </Button>
            <Link to={`/product/${product.id}`} className="flex-1">
              <Button variant="outline" fullWidth>
                <Info size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
