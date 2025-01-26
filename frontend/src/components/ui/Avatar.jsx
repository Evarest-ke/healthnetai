import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-gray-200 ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || 'User avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-100">
          <User className="w-1/2 h-1/2 text-blue-600" />
        </div>
      )}
    </div>
  );
};

export default Avatar; 