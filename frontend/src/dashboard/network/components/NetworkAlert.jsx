import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function NetworkAlert({ alert, onActionClick }) {
  const getSeverityStyles = (severity) => {
    const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    switch (severity) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <AlertTriangle className={`h-5 w-5 ${
          alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
        }`} />
        <div className="ml-4">
          <p className="font-medium">{alert.facility}</p>
          <p className="text-sm text-gray-500">{alert.issue}</p>
          <div className="flex items-center mt-1 text-xs text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {alert.timestamp}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className={getSeverityStyles(alert.severity)}>
          {alert.severity}
        </span>
        <button
          onClick={() => onActionClick(alert)}
          className="block mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          View Details
        </button>
      </div>
    </div>
  );
} 