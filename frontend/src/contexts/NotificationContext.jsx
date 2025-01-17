import React, { createContext, useContext, useState } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto remove after delay
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (message) => {
    addNotification({
      type: 'success',
      message,
      icon: CheckCircle
    });
  };

  const showError = (message) => {
    addNotification({
      type: 'error',
      message,
      icon: AlertCircle
    });
  };

  const showInfo = (message) => {
    addNotification({
      type: 'info',
      message,
      icon: Info
    });
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {/* Notification Stack */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`
              flex items-center p-4 rounded-lg shadow-lg
              ${notification.type === 'success' ? 'bg-green-50 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'}
            `}
          >
            <notification.icon className="h-5 w-5 mr-3" />
            <p>{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4"
            >
              <XCircle className="h-5 w-5 opacity-60 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext); 