import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Loading...", fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
