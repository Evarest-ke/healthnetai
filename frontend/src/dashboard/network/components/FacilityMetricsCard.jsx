import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Wifi, 
  Clock, 
  Users, 
  HardDrive,
  Zap,
  AlertTriangle 
} from 'lucide-react';

export default function FacilityMetricsCard({ metrics, className }) {
  const getStatusColor = (value, threshold) => {
    const numValue = parseFloat(value);
    if (numValue >= threshold.good) return 'text-green-500';
    if (numValue >= threshold.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  const thresholds = {
    uptime: { good: 99, warning: 95 },
    bandwidth: { good: 80, warning: 50 },
    latency: { good: 30, warning: 50 },
    packetLoss: { good: 0.5, warning: 2 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-indigo-600" />
        Facility Metrics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Uptime */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Uptime</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <p className={`text-xl font-bold ${getStatusColor(metrics.uptime, thresholds.uptime)}`}>
            {metrics.uptime}%
          </p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${metrics.uptime}%` }}
            />
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Bandwidth</span>
            <Wifi className="h-4 w-4 text-gray-400" />
          </div>
          <p className={`text-xl font-bold ${getStatusColor(metrics.bandwidth, thresholds.bandwidth)}`}>
            {metrics.bandwidth} Mbps
          </p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(metrics.bandwidth / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Active Users</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{metrics.activeUsers}</p>
          <p className="text-sm text-gray-500 mt-1">Peak today: {metrics.peakUsers}</p>
        </div>

        {/* Storage Usage */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Storage</span>
            <HardDrive className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{metrics.storageUsed}GB</p>
          <p className="text-sm text-gray-500 mt-1">of {metrics.storageTotal}GB</p>
        </div>

        {/* Critical Alerts */}
        <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Recent Alerts</span>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="space-y-2">
            {metrics.recentAlerts.map((alert, index) => (
              <div 
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{alert.message}</span>
                <span className="text-gray-400">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 