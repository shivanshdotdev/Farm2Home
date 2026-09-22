import React from 'react';

const VerificationMethodCard = ({ title, description, icon: Icon, selected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center space-y-4 ${
        selected 
          ? 'border-primary-500 bg-primary-50 shadow-sm' 
          : 'border-gray-200 bg-white hover:border-primary-200 hover:bg-gray-50'
      }`}
    >
      <div className={`p-4 rounded-full ${selected ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
        <Icon size={32} />
      </div>
      <div>
        <h3 className={`font-bold text-lg mb-1 ${selected ? 'text-primary-800' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm ${selected ? 'text-primary-600' : 'text-gray-500'}`}>{description}</p>
      </div>
    </div>
  );
};

export default VerificationMethodCard;
