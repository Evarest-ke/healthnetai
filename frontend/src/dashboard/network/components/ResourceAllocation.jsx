import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Wrench,
  Calendar,
  AlertTriangle,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceAllocation({ maintenanceTask }) {
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'forecast'

  const resources = {
    technicians: [
      { id: 1, name: 'John Doe', role: 'Network Engineer', availability: 'available', tasks: 2 },
      { id: 2, name: 'Jane Smith', role: 'System Administrator', availability: 'assigned', tasks: 3 },
      { id: 3, name: 'Mike Johnson', role: 'Security Specialist', availability: 'unavailable', tasks: 4 }
    ],
    equipment: [
      { id: 1, name: 'Network Diagnostic Kit', status: 'available', location: 'Facility A' },
      { id: 2, name: 'Cable Testing Tools', status: 'in-use', location: 'Facility B' },
      { id: 3, name: 'Backup Server', status: 'available', location: 'Facility C' }
    ],
    timeSlots: [
      { id: 1, time: '02:00 AM - 04:00 AM', utilization: 45 },
      { id: 2, time: '04:00 AM - 06:00 AM', utilization: 75 },
      { id: 3, time: '06:00 AM - 08:00 AM', utilization: 30 }
    ]
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'text-green-500';
      case 'assigned':
        return 'text-yellow-500';
      case 'unavailable':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset";
    switch (status) {
      case 'available':
        return `${baseClasses} bg-green-100 text-green-700 ring-green-600/20`;
      case 'in-use':
        return `${baseClasses} bg-yellow-100 text-yellow-700 ring-yellow-600/20`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 ring-gray-600/20`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Resource Allocation</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('current')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'current' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Current
          </button>
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-3 py-1 rounded-md text-sm ${
              viewMode === 'forecast' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Forecast
          </button>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Staff */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Technical Staff</h4>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {resources.technicians.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.role}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getAvailabilityColor(tech.availability)}`}>
                    {tech.availability}
                  </span>
                  <p className="text-xs text-gray-500">Tasks: {tech.tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg border"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Equipment</h4>
            <Wrench className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {resources.equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.location}</p>
                </div>
                <span className={getStatusBadge(item.status)}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Time Slot Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg border md:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Time Slot Utilization</h4>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {resources.timeSlots.map((slot) => (
              <div key={slot.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{slot.time}</span>
                  <span className="text-sm font-medium text-gray-900">{slot.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      slot.utilization > 80 ? 'bg-red-500' :
                      slot.utilization > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${slot.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Resource Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Resource Alerts</h4>
            <ul className="mt-2 text-sm text-yellow-700 space-y-1">
              <li>• High utilization period detected between 04:00 AM - 06:00 AM</li>
              <li>• Limited technical staff availability for emergency tasks</li>
              <li>• Equipment maintenance due for Network Diagnostic Kit</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Resource Optimization Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-indigo-50 border border-indigo-200 rounded-lg p-4"
      >
        <div className="flex items-start">
          <BarChart2 className="h-5 w-5 text-indigo-400 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-indigo-800">Optimization Suggestions</h4>
            <ul className="mt-2 text-sm text-indigo-700 space-y-1">
              <li>• Consider rescheduling non-critical tasks to low utilization periods</li>
              <li>• Cross-train staff for better resource flexibility</li>
              <li>• Implement equipment sharing between nearby facilities</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 