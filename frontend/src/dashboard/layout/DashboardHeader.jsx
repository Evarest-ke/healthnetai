import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { authService } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import UserDropdown from './UserDropdown';

const DashboardHeader = ({ userType }) => {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    email: 'loading@example.com',
    avatar: null
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData({
            name: parsedUser.full_name,
            role: parsedUser.role.charAt(0).toUpperCase() + parsedUser.role.slice(1),
            email: parsedUser.email,
            avatar: parsedUser.avatar
          });
          return;
        }

        // If not in localStorage, fetch from backend
        const currentUser = await authService.getCurrentUser();
        if (currentUser?.data) {
          const userData = currentUser.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUserData({
            name: userData.full_name,
            role: userData.role.charAt(0).toUpperCase() + userData.role.slice(1),
            email: userData.email,
            avatar: userData.avatar
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // On error, clear stored data and show guest state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserData({
          name: 'Guest',
          role: 'Guest',
          email: 'guest@example.com',
          avatar: null
        });
      }
    };

    fetchUserData();
  }, [userType]);

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
          
          <UserDropdown userData={userData} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 