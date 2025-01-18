import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Server,
  Database,
  Shield,
  Wifi
} from 'lucide-react';

export default function FacilityHealthCheck({ facilityId }) {
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState({
    network: { status: 'healthy', latency: '15ms' },
    database: { status: 'warning', syncDelay: '5m' },
    security: { status: 'healthy', lastUpdate: '1h ago' },
    storage: { status: 'critical', space: '95%' }
  });

  const runHealthCheck = async () => {
    setIsChecking(true);
    // Simulate health check
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Update health status with new values
    setIsChecking(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'healthy':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Health Check</h3>
        <button
          onClick={runHealthCheck}
          disabled={isChecking}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
          Run Check
        </button>
      </div>

      <div className="space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Wifi className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">Network</p>
              <p className="text-sm text-gray-500">Latency: {healthStatus.network.latency}</p>
            </div>
          </div>
          <span className={getStatusBadge(healthStatus.network.status)}>
            {healthStatus.network.status}
          </span>
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">Database</p>
              <p className="text-sm text-gray-500">Sync Delay: {healthStatus.database.syncDelay}</p>
            </div>
          </div>
          <span className={getStatusBadge(healthStatus.database.status)}>
            {healthStatus.database.status}
          </span>
        </div>

        {/* Security Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">Security</p>
              <p className="text-sm text-gray-500">Last Update: {healthStatus.security.lastUpdate}</p>
            </div>
          </div>
          <span className={getStatusBadge(healthStatus.security.status)}>
            {healthStatus.security.status}
          </span>
        </div>

        {/* Storage Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Server className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">Storage</p>
              <p className="text-sm text-gray-500">Used Space: {healthStatus.storage.space}</p>
            </div>
          </div>
          <span className={getStatusBadge(healthStatus.storage.status)}>
            {healthStatus.storage.status}
          </span>
        </div>
      </div>
    </div>
  );
} 