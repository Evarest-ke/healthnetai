import React, { useState } from 'react';
import { Search, Wifi, WifiOff, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FacilityList({ clinics, selectedFacility, onEmergencyShare }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sharingSource, setSharingSource] = useState(null);

  const handleShareRequest = (targetId) => {
    if (sharingSource && targetId) {
      onEmergencyShare(sharingSource, targetId);
      setSharingSource(null);
    }
  };

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

  const filteredFacilities = clinics.filter(clinic =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        {filteredFacilities.map((clinic) => (
          <motion.div
            key={clinic.id}
            className={`
              p-4 rounded-lg border transition-all
              ${selectedFacility === clinic.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}
            `}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{clinic.name}</h3>
                <p className="text-sm text-gray-500">
                  Signal: {(clinic.terrainFactor * 100).toFixed(0)}%
                </p>
              </div>
              <div className="flex space-x-2">
                {sharingSource ? (
                  <button
                    onClick={() => handleShareRequest(clinic.id)}
                    className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                  >
                    Share With
                  </button>
                ) : (
                  <button
                    onClick={() => setSharingSource(clinic.id)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full"
                  >
                    Share Bandwidth
                  </button>
                )}
              </div>
            </div>
          </motion.div>
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