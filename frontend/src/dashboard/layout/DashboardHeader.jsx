import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

function useOutsideClick(callback) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export default function DashboardHeader({ userType, userName, userImage }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useOutsideClick(() => setShowNotifications(false));
  const profileMenuRef = useOutsideClick(() => setShowProfileMenu(false));

  // Different notifications for doctors and patients
  const doctorNotifications = [
    { 
      id: 1, 
      message: 'New appointment request from John Doe', 
      time: '5 minutes ago', 
      isUnread: true,
      type: 'appointment'
    },
    { 
      id: 2, 
      message: 'Patient Sarah Smith cancelled appointment', 
      time: '1 hour ago', 
      isUnread: true,
      type: 'cancellation'
    },
    { 
      id: 3, 
      message: 'Lab results ready for patient Mike Johnson', 
      time: '2 hours ago', 
      isUnread: false,
      type: 'lab'
    },
    { 
      id: 4, 
      message: 'Emergency consultation requested', 
      time: '3 hours ago', 
      isUnread: true,
      type: 'emergency'
    }
  ];

  const patientNotifications = [
    { 
      id: 1, 
      message: 'Appointment confirmed with Dr. Smith', 
      time: '30 minutes ago', 
      isUnread: true,
      type: 'appointment'
    },
    { 
      id: 2, 
      message: 'Your prescription is ready for pickup', 
      time: '1 hour ago', 
      isUnread: true,
      type: 'prescription'
    },
    { 
      id: 3, 
      message: 'Reminder: Take your medication', 
      time: '2 hours ago', 
      isUnread: false,
      type: 'reminder'
    },
    { 
      id: 4, 
      message: 'Your lab results are available', 
      time: '1 day ago', 
      isUnread: false,
      type: 'lab'
    }
  ];

  const notifications = userType === 'doctor' ? doctorNotifications : patientNotifications;
  const unreadCount = notifications.filter(n => n.isUnread).length;

  // Get notification background color based on type
  const getNotificationColor = (type, isUnread) => {
    if (!isUnread) return 'bg-white hover:bg-gray-50';
    
    switch (type) {
      case 'emergency':
        return 'bg-red-50 hover:bg-red-100';
      case 'appointment':
        return 'bg-blue-50 hover:bg-blue-100';
      case 'prescription':
        return 'bg-green-50 hover:bg-green-100';
      case 'cancellation':
        return 'bg-orange-50 hover:bg-orange-100';
      case 'lab':
        return 'bg-purple-50 hover:bg-purple-100';
      case 'reminder':
        return 'bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {userType === 'doctor' ? 'Doctor Dashboard' : 'Patient Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 transition-colors duration-200 ${
                          getNotificationColor(notification.type, notification.isUnread)
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                            notification.isUnread ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                          <div className="ml-3 flex-1">
                            <p className={`text-sm ${
                              notification.isUnread ? 'font-medium text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {userImage ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                    src={userImage}
                    alt={userName}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{userName}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 mt-1">john.doe@example.com</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    Settings
                  </button>
                  <div className="border-t border-gray-200">
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 