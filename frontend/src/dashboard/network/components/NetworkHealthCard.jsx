import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function NetworkHealthCard({ title, value, trend, subValue, icon: Icon, color }) {
  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 mr-1" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 mr-1" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
          {subValue && (
            <div className="flex items-center mt-1">
              <span className={`text-sm flex items-center ${getTrendColor()}`}>
                {getTrendIcon()}
                {subValue}
              </span>
            </div>
          )}
        </div>
        <div className={`bg-${color}-50 p-3 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );
} 