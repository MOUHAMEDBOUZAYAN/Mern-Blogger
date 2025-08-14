import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium' }) => {
  let spinnerSize;
  switch (size) {
    case 'small':
      spinnerSize = 20;
      break;
    case 'large':
      spinnerSize = 60;
      break;
    default:
      spinnerSize = 32; 
  }

  return (
    <div className="flex items-center justify-center">
      <Loader size={spinnerSize} className="animate-spin text-emerald-500" />
    </div>
  );
};

export default LoadingSpinner;
