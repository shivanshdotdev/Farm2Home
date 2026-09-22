import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import SectionHeading from '../components/SectionHeading';
import FarmerCard from '../components/FarmerCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';

const Farmers = () => {
  const { farmers, products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProductCountForFarmer = (farmerId) => {
    return products.filter(p => p.farmerId === farmerId).length;
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionHeading 
            title="Our Verified Farmers" 
            subtitle="Meet the hardworking individuals who grow your food. Buy directly from them to support their livelihood."
            centered
          />
          <div className="mt-6 max-w-md mx-auto">
            <SearchBar 
              onSearch={setSearchQuery} 
              placeholder="Search by name or location..." 
            />
          </div>
        </div>

        {filteredFarmers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredFarmers.map(farmer => (
              <FarmerCard 
                key={farmer.id} 
                farmer={farmer} 
                productCount={getProductCountForFarmer(farmer.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No farmers found"
            message={`We couldn't find any farmers matching "${searchQuery}".`}
          />
        )}
      </div>
    </div>
  );
};

export default Farmers;
