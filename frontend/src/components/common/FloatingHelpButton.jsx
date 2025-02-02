import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';

const FloatingHelpButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/help')}
      className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group z-50"
      aria-label="Help Center"
    >
      <FaQuestionCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Need Help?
      </span>
    </button>
  );
};

export default FloatingHelpButton; 