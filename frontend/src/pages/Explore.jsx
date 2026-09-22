import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { categories } from '../data/mockData';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';

const Explore = () => {
  const { products } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    let result = products;
    
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.categoryName.toLowerCase().includes(q) ||
        (p.farmer && p.farmer.location.toLowerCase().includes(q))
      );
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Explore Fresh Produce" />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filter Panel */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterPanel 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              onClear={() => handleCategoryChange(null)}
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex gap-4 mb-6">
              <SearchBar 
                onSearch={setSearchQuery} 
                placeholder="Search products, categories, or locations..." 
              />
              <Button 
                variant="outline" 
                className="lg:hidden shrink-0 px-3"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter size={20} />
              </Button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No products found"
                message="Try adjusting your filters or search query to find what you're looking for."
                actionText="Clear Filters"
                actionLink="#"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
