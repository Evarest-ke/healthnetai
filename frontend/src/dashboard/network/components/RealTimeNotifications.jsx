import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate incoming notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const types = ['info', 'warning', 'error', 'success'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newNotification = {
          id: Date.now(),
          type,
          message: getRandomMessage(type),
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomMessage = (type) => {
    const messages = {
      info: [
        'Sync completed successfully',
        'Backup process started',
        'System update available'
      ],
      warning: [
        'High bandwidth usage detected',
        'Storage space running low',
        'Connection latency increasing'
      ],
      error: [
        'Connection lost to remote facility',
        'Database sync failed',
        'Critical system error detected'
      ],
      success: [
        'Network optimization completed',
        'Security update installed',
        'Backup completed successfully'
      ]
    };
    return messages[type][Math.floor(Math.random() * messages[type].length)];
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <Bell className="h-6 w-6" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="ml-2 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 