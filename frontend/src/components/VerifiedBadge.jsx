import React from 'react';
import { ShieldCheck } from 'lucide-react';

const VerifiedBadge = ({ text = "Verified Farmer", className = "" }) => {
  return (
    <div className={`inline-flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200 ${className}`}>
      <ShieldCheck size={14} className="text-green-600" />
      <span>{text}</span>
    </div>
  );
};

export default VerifiedBadge;
