import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';

const FloatingHelpButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/help') {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/help');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group z-40"
      aria-label="Help Center"
    >
      <FaQuestionCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {location.pathname === '/help' ? 'Go Back' : 'Need Help?'}
      </span>
    </button>
  );
};

export default FloatingHelpButton; 