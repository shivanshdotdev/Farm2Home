import React from 'react';
import { Filter, X } from 'lucide-react';
import Button from './Button';

const FilterPanel = ({ categories, selectedCategory, onSelectCategory, onClear, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-50 w-72 bg-white lg:bg-transparent lg:w-full 
        transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
        border-l lg:border-none border-gray-100 shadow-xl lg:shadow-none
        flex flex-col h-full lg:h-auto
      `}>
        <div className="p-5 border-b border-gray-100 lg:hidden flex justify-between items-center bg-white">
          <h2 className="font-bold text-lg flex items-center">
            <Filter size={18} className="mr-2" /> Filters
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex-grow overflow-y-auto bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm">
          <div className="hidden lg:flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg flex items-center text-gray-900">
              <Filter size={18} className="mr-2 text-primary-600" /> Filters
            </h2>
            {selectedCategory && (
              <button onClick={onClear} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Clear
              </button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  checked={selectedCategory === null}
                  onChange={() => onSelectCategory(null)}
                />
                <span className="text-gray-700">All Products</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    checked={selectedCategory === cat.id}
                    onChange={() => onSelectCategory(cat.id)}
                  />
                  <span className="text-gray-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 lg:hidden bg-white">
          <Button variant="primary" fullWidth onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
