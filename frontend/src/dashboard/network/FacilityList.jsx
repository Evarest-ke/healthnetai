import React, { useState } from 'react';
import { Search, Wifi, WifiOff, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FacilityList({ selectedFacility }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const facilities = [
    {
      id: 1,
      name: 'Facility A',
      status: 'online',
      bandwidth: '45 Mbps',
      latency: '25ms',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Facility B',
      status: 'offline',
      bandwidth: '0 Mbps',
      latency: 'N/A',
      trend: 'down'
    },
    {
      id: 3,
      name: 'Facility C',
      status: 'warning',
      bandwidth: '30 Mbps',
      latency: '45ms',
      trend: 'up'
    }
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

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    }
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search facilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Facilities List */}
      <div className="space-y-3">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className={`
              p-4 rounded-lg border transition-all
              ${selectedFacility?.id === facility.id 
                ? 'border-indigo-500 ring-2 ring-indigo-200' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(facility.status)}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {facility.name}
                  </h3>
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${facility.status === 'online' ? 'bg-green-100 text-green-800' :
                      facility.status === 'offline' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {facility.status}
                  </span>
                </div>
              </div>
              {facility.status !== 'offline' && (
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-900">
                      {facility.bandwidth}
                    </span>
                    {getTrendIcon(facility.trend)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Latency: {facility.latency}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No facilities found matching your search.
        </div>
      )}
    </div>
  );
} 