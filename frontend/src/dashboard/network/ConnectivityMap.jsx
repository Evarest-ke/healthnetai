import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export default function ConnectivityMap({ onFacilitySelect }) {
  // Mock data for facilities
  const facilities = [
    { id: 1, name: 'Facility A', status: 'online', lat: 30, lng: 20, signal: 90 },
    { id: 2, name: 'Facility B', status: 'offline', lat: 35, lng: 25, signal: 0 },
    { id: 3, name: 'Facility C', status: 'warning', lat: 40, lng: 30, signal: 60 }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'offline':
        return 'bg-red-100 text-red-800 ring-red-600/20';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Map placeholder - Replace with actual map implementation */}
      <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map Component Goes Here</p>
      </div>

      {/* Facility list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilities.map((facility) => (
          <button
            key={facility.id}
            onClick={() => onFacilitySelect(facility)}
            className="flex items-center p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            {getStatusIcon(facility.status)}
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">{facility.name}</h3>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(facility.status)}`}>
                  {facility.status}
                </span>
                {facility.status !== 'offline' && (
                  <span className="ml-2 text-xs text-gray-500">
                    Signal: {facility.signal}%
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 