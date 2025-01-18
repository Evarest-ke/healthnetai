import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  Download, 
  Upload, 
  Users,
  RefreshCw,
  Zap,
  Radio
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useWebSocket } from '../../../hooks/useWebSocket';

export default function FacilityMonitor({ facilityId }) {
  const [realTimeData, setRealTimeData] = useState({
    bandwidth: [],
    latency: [],
    users: [],
    timestamp: []
  });
  const [isLive, setIsLive] = useState(true);
  const [alerts, setAlerts] = useState([]);
  
  const { isConnected, error, lastMessage, sendMessage } = useWebSocket(facilityId);

  useEffect(() => {
    if (lastMessage && isLive) {
      switch (lastMessage.type) {
        case 'metrics':
          setRealTimeData(prev => ({
            bandwidth: [...prev.bandwidth.slice(-20), lastMessage.bandwidth],
            latency: [...prev.latency.slice(-20), lastMessage.latency],
            users: [...prev.users.slice(-20), lastMessage.activeUsers],
            timestamp: [...prev.timestamp.slice(-20), new Date().toLocaleTimeString()]
          }));
          break;
        case 'alert':
          setAlerts(prev => [lastMessage.alert, ...prev].slice(0, 5));
          break;
        default:
          break;
      }
    }
  }, [lastMessage, isLive]);

  useEffect(() => {
    if (isConnected && isLive) {
      // Request initial data
      sendMessage('subscribe', {
        metrics: ['bandwidth', 'latency', 'users'],
        interval: 2000
      });
    }

    return () => {
      if (isConnected) {
        sendMessage('unsubscribe', {
          metrics: ['bandwidth', 'latency', 'users']
        });
      }
    };
  }, [isConnected, isLive, sendMessage]);

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 0
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const bandwidthData = {
    labels: realTimeData.timestamp,
    datasets: [
      {
        label: 'Bandwidth Usage (Mbps)',
        data: realTimeData.bandwidth,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const latencyData = {
    labels: realTimeData.timestamp,
    datasets: [
      {
        label: 'Latency (ms)',
        data: realTimeData.latency,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="ml-2 text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {error && (
            <span className="text-sm text-red-500">
              Error: {error.message}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded-full text-sm ${
            isLive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bandwidth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Bandwidth Usage</h3>
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-green-500" />
              <Download className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <div className="h-48">
            <Line data={bandwidthData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Latency Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Network Latency</h3>
            <Radio className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="h-48">
            <Line data={latencyData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Real-time Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Live Alerts</h3>
          <span className="text-sm text-gray-500">{alerts.length} active alerts</span>
        </div>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                alert.type === 'critical' ? 'bg-red-50' : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className={`h-5 w-5 ${
                  alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <span className="ml-2 text-sm font-medium">{alert.message}</span>
              </div>
              <span className="text-xs text-gray-500">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No active alerts
            </div>
          )}
        </div>
      </motion.div>

      {/* Active Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Active Users</h3>
          <Users className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-3xl font-bold text-indigo-600">
          {realTimeData.users[realTimeData.users.length - 1]}
        </div>
        <div className="mt-4 h-24">
          <Line
            data={{
              labels: realTimeData.timestamp,
              datasets: [{
                label: 'Active Users',
                data: realTimeData.users,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }}
            options={chartOptions}
          />
        </div>
      </motion.div>
    </div>
  );
} 