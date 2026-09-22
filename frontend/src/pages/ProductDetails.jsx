import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Package, Calendar, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import Rating from '../components/Rating';
import EmptyState from '../components/EmptyState';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart } = useAppContext();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="py-20">
        <EmptyState 
          title="Product Not Found"
          message="The product you're looking for doesn't exist or has been removed."
          actionText="Back to Explore"
          actionLink="/explore"
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Ideal: Show toast here, but keeping it simple for now
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/explore" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Explore
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image section */}
            <div className="relative h-64 md:h-auto bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content section */}
            <div className="p-8 lg:p-12">
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-4">
                {product.categoryName}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <Rating rating={product.rating} count={product.reviews || Math.floor(Math.random() * 50) + 10} />
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-medium">{product.availableQuantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>

              <div className="text-3xl font-extrabold text-gray-900 mb-6">
                ₹{product.price} <span className="text-lg font-medium text-gray-500">/ {product.unit}</span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-earth-50 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-earth-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Harvest Date</p>
                    <p className="text-sm font-semibold text-gray-900">{product.harvestDate}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-earth-50 p-2 rounded-lg mr-3">
                    <Package className="w-5 h-5 text-earth-700" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Available</p>
                    <p className="text-sm font-semibold text-gray-900">{product.availableQuantity} {product.unit}s</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                    <button 
                      className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors rounded-l-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                    <button 
                      className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                      onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Total: <span className="font-bold text-gray-900">₹{product.price * quantity}</span>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                fullWidth 
                className="mb-8"
                onClick={handleAddToCart}
                disabled={product.availableQuantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              {/* Farmer Info */}
              {product.farmer && (
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Sold by</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.farmer.image} 
                        alt={product.farmer.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{product.farmer.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <MapPin size={12} className="mr-1" />
                          {product.farmer.location}
                        </div>
                      </div>
                    </div>
                    <Link to={`/farmer/${product.farmer.id}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                  </div>
                  {product.farmer.verified && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 w-fit px-2 py-1 rounded-full border border-green-200">
                        <ShieldCheck size={14} className="mr-1 text-green-600" />
                        Verified Farm2Home Seller
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
