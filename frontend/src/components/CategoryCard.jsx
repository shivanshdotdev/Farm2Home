import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const CategoryCard = ({ category }) => {
  const IconComponent = Icons[category.icon] || Icons.HelpCircle;

  return (
    <Link 
      to={`/explore?category=${category.id}`}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
    >
      <div className={`p-4 rounded-full mb-4 transition-transform group-hover:scale-110 ${category.color}`}>
        <IconComponent size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-gray-900 font-medium text-center">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;
