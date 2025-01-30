import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, Shield, Edit2, Camera,
  Calendar, MapPin, Building, Clock, Save,
  Lock, Bell, Key, Globe
} from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import Avatar from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    avatar: user?.avatar || null,
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    department: 'Cardiology',
    joinDate: 'January 2023',
    timezone: 'PST (UTC-8)',
    language: 'English',
    notifications: true,
    twoFactorEnabled: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // Save profile data to backend
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType={user?.role?.toLowerCase() || 'user'} />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader userType={user?.role?.toLowerCase() || 'user'} />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="h-5 w-5 mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                      <Camera className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="relative -mt-16 mb-4">
                      <div className="relative">
                        <Avatar
                          src={profileData.avatar}
                          alt={profileData.name}
                          size="lg"
                          className="w-32 h-32 mx-auto ring-4 ring-white"
                        />
                        <button className="absolute bottom-0 right-1/3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                          <Camera className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                      <p className="text-sm text-gray-500">{profileData.role}</p>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-5 w-5 mr-3" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-5 w-5 mr-3" />
                        <span>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>{profileData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Settings Sections */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        value={profileData.department}
                        disabled={!isEditing}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                          Enabled
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Key className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Update your password regularly</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Notifications</p>
                          <p className="text-sm text-gray-500">Receive updates and alerts</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications"
                            className="sr-only peer"
                            checked={profileData.notifications}
                            onChange={handleInputChange}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Language</p>
                          <p className="text-sm text-gray-500">Choose your preferred language</p>
                        </div>
                      </div>
                      <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 