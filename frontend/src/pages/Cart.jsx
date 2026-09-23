import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import SectionHeading from '../components/SectionHeading';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 px-4">
        <EmptyState 
          title="Your cart is empty"
          message="Looks like you haven't added any fresh produce to your cart yet."
          actionText="Start Shopping"
          actionLink="/explore"
        />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Your Shopping Cart" />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li key={item.product.id} className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center">
                    <Link to={`/product/${item.product.id}`} className="shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full sm:w-24 h-24 object-cover rounded-xl"
                      />
                    </Link>
                    
                    <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <Link to={`/product/${item.product.id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.product.farmer?.name}</p>
                        <div className="text-primary-700 font-bold mt-2">
                          ₹{item.product.price} <span className="text-sm font-normal text-gray-500">/ {item.product.unit}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end sm:space-x-8 mt-2 sm:mt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button 
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors rounded-l-lg"
                            onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-semibold text-gray-900">{item.quantity}</span>
                          <button 
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} // Assuming no stock limit for simplicity in UI, ideally checking availableQuantity
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="font-bold text-lg text-gray-900 w-20 text-right">
                            ₹{item.product.price * item.quantity}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
                    Add ₹{500 - subtotal} more to your order for free delivery!
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-primary-700">₹{total}</span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">Inclusive of all taxes</p>
              </div>
              
              <Link to="/checkout" className="block">
                <Button size="lg" fullWidth>
                  Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500 space-x-2">
                <ShoppingBag size={16} />
                <span>Secure Checkout Process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
