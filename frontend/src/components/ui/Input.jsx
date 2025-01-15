import React from 'react';
import { Info } from 'lucide-react';

const Input = ({
  label,
  error,
  tooltip,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          {tooltip && (
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400" />
              <div className="absolute right-0 w-48 p-2 mt-1 text-xs text-white bg-gray-900 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        <input
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input; 