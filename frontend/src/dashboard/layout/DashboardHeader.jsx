import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export default function DashboardHeader({ userType, userName, userImage }) {
  const getDashboardTitle = (type) => {
    switch (type) {
      case 'admin':
        return 'Network Dashboard';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'patient':
        return 'Patient Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {getDashboardTitle(userType)}
        </h1>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <img
              src={userImage}
              alt={userName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-gray-700">{userName}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
} 