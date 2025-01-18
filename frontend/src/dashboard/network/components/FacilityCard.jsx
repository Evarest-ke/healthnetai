import React from 'react';
import { Server, MapPin, Users, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FacilityCard({ facility, onClick }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Server className="h-6 w-6 text-indigo-600" />
            <h3 className="ml-2 text-lg font-semibold text-gray-900">{facility.name}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(facility.status)}`}>
            {facility.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{facility.location}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">{facility.activeUsers} active users</span>
          </div>

          <div className="flex items-center text-gray-500">
            <Activity className="h-4 w-4 mr-2" />
            <span className="text-sm">Last sync: {facility.lastSync}</span>
          </div>

          {/* Bandwidth Usage Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">Bandwidth Usage</span>
              <span className="font-medium">{facility.bandwidth.used}/{facility.bandwidth.total} Mbps</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 rounded-full h-2"
                style={{ width: `${(facility.bandwidth.used / facility.bandwidth.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={onClick}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-indigo-600 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );
} 