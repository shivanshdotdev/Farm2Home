import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ rating, count, className = "" }) => {
  const roundedRating = Math.round(rating * 10) / 10;
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium text-gray-700">{roundedRating}</span>
      {count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
};

export default Rating;
