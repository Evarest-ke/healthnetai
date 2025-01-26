import React from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';

const DashboardHeader = ({ 
  onMenuClick, 
  user = {
    name: 'John Doe',
    role: 'Doctor',
    avatar: null // URL to user's avatar image
  }
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <div className="relative flex items-center">
              <button className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Avatar 
                  src={user.avatar}
                  alt={user.name}
                  size="sm"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown menu could be added here */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;