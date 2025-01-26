import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';

const DashboardHeader = ({ userType }) => {
  // User data mapping based on userType
  const getUserData = (type) => {
    switch (type) {
      case 'admin':
        return {
          name: 'Mike Otieno',
          role: 'Network Administrator',
          avatar: null // Add avatar URL when available
        };
      case 'doctor':
        return {
          name: 'Dr. Alfred Gitonga',
          role: 'Doctor',
          avatar: null // Add avatar URL when available
        };
      case 'patient':
        return {
          name: 'Mary Akinyi',
          role: 'Patient',
          avatar: null // Add avatar URL when available
        };
      default:
        return {
          name: 'User',
          role: 'Guest',
          avatar: null
        };
    }
  };

  const userData = getUserData(userType);

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <Avatar 
              src={userData.avatar}
              alt={userData.name}
              size="sm"
            />
            <div className="text-sm">
              <p className="font-medium text-gray-900">{userData.name}</p>
              <p className="text-gray-500">{userData.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 