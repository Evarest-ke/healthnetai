import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Server, 
  MapPin, 
  Users, 
  Activity, 
  Wifi, 
  Clock, 
  Settings,
  AlertTriangle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { Line } from 'react-chartjs-2';

export default function FacilityDetailsModal({ isOpen, onClose, facility }) {
  const [activeTab, setActiveTab] = useState('overview');

  const performanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Network Performance',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (!facility) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center">
                  <Server className="h-6 w-6 text-indigo-600" />
                  <h2 className="ml-2 text-2xl font-semibold text-gray-900">{facility.name}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'performance', 'settings', 'alerts'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Activity className="h-5 w-5 text-green-600" />
                          <span className="ml-2 text-sm font-medium text-gray-500">Status</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold">{facility.status}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-blue-600" />
                          <span className="ml-2 text-sm font-medium text-gray-500">Active Users</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold">{facility.activeUsers}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <span className="ml-2 text-sm font-medium text-gray-500">Last Sync</span>
                        </div>
                        <p className="mt-2 text-xl font-semibold">{facility.lastSync}</p>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Network Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Uptime</p>
                          <p className="text-xl font-semibold">{facility.metrics.uptime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Latency</p>
                          <p className="text-xl font-semibold">{facility.metrics.latency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Packet Loss</p>
                          <p className="text-xl font-semibold">{facility.metrics.packetLoss}</p>
                        </div>
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-lg font-medium">Location Details</span>
                      </div>
                      <p className="text-gray-600">{facility.location}</p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">Coordinates</p>
                        <p className="text-gray-600">
                          {facility.coordinates.lat}, {facility.coordinates.lng}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Network Performance</h3>
                      <div className="h-64">
                        <Line data={performanceData} options={chartOptions} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Add more tab content as needed */}
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-4 flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update Facility
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 