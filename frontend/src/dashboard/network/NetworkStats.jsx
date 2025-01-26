import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Signal, Wifi, AlertTriangle, Share2 } from 'lucide-react';

// Helper function to generate sample data if metrics history is not available
const generateSampleData = (hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      latency: Math.random() * 100 + 50, // 50-150ms
      bandwidth: Math.random() * 50 + 25, // 25-75 Mbps
      packetLoss: Math.random() * 2, // 0-2%
    });
  }
  return data;
};

export default function NetworkStats({ metrics, isConnected, activeShares, networkLoad }) {
  const data = metrics?.history || generateSampleData();
  const latestMetrics = data[data.length - 1] || {};

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Latency</p>
              <p className={`text-2xl font-semibold ${getStatusColor(latestMetrics.latency, { good: 80, warning: 120 })}`}>
                {latestMetrics.latency?.toFixed(1) || '0'} ms
              </p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bandwidth Usage</p>
              <p className={`text-2xl font-semibold ${getStatusColor(latestMetrics.bandwidth, { good: 40, warning: 70 })}`}>
                {latestMetrics.bandwidth?.toFixed(1) || '0'} Mbps
              </p>
            </div>
            <Signal className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Packet Loss</p>
              <p className={`text-2xl font-semibold ${getStatusColor(latestMetrics.packetLoss, { good: 1, warning: 2 })}`}>
                {latestMetrics.packetLoss?.toFixed(2) || '0'}%
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Network Status</p>
              <p className={`text-2xl font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <Wifi className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Shared Bandwidth</p>
              <p className={`text-2xl font-semibold ${networkLoad.shared > 0 ? 'text-indigo-600' : 'text-gray-600'}`}>
                {networkLoad.shared} Mbps
              </p>
            </div>
            <Share2 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Network Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Network Performance</h3>
          {activeShares.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm">
                {activeShares.length} Active Shares
              </span>
            </div>
          )}
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="packetLossGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="sharedBandwidthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" orientation="left" stroke="#818CF8" />
              <YAxis yAxisId="right" orientation="right" stroke="#34D399" />
              <YAxis yAxisId="right2" orientation="right" stroke="#F87171" />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="text-sm font-semibold">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {entry.value.toFixed(2)} {entry.name.includes('Bandwidth') ? 'Mbps' : 
                                                                 entry.name.includes('Latency') ? 'ms' : '%'}
                        </p>
                      ))}
                      {networkLoad.shared > 0 && (
                        <p className="text-sm text-indigo-600">
                          Shared Bandwidth: {networkLoad.shared} Mbps
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="latency"
                stroke="#818CF8"
                fillOpacity={1}
                fill="url(#latencyGradient)"
                name="Latency (ms)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="bandwidth"
                stroke="#34D399"
                fillOpacity={1}
                fill="url(#bandwidthGradient)"
                name="Bandwidth (Mbps)"
              />
              <Area
                yAxisId="right2"
                type="monotone"
                dataKey="packetLoss"
                stroke="#F87171"
                fillOpacity={1}
                fill="url(#packetLossGradient)"
                name="Packet Loss (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Network Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Network Load</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestMetrics.bandwidth > 70 ? 'bg-red-500' :
                  latestMetrics.bandwidth > 40 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((latestMetrics.bandwidth || 0) / 100 * 100, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">
              {Math.round((latestMetrics.bandwidth || 0) / 100 * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Connection Quality</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestMetrics.latency > 120 ? 'bg-red-500' :
                  latestMetrics.latency > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100 - (latestMetrics.latency || 0) / 2, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">
              {Math.round(100 - (latestMetrics.latency || 0) / 2)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Network Stability</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  latestMetrics.packetLoss > 2 ? 'bg-red-500' :
                  latestMetrics.packetLoss > 1 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(100 - (latestMetrics.packetLoss || 0) * 50, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">
              {Math.round(100 - (latestMetrics.packetLoss || 0) * 50)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Bandwidth Sharing</h4>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  networkLoad.shared > 50 ? 'bg-indigo-500' :
                  networkLoad.shared > 25 ? 'bg-indigo-400' : 'bg-indigo-300'
                }`}
                style={{ width: `${Math.min((networkLoad.shared / networkLoad.available) * 100, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium">
              {Math.round((networkLoad.shared / networkLoad.available) * 100)}%
            </span>
          </div>
          {activeShares.length > 0 && (
            <div className="mt-2 space-y-1">
              {activeShares.map((share, index) => (
                <div key={`share-${share.id}-${index}`} className="text-xs text-gray-500">
                  {share.source.name.split(' ')[0]} → {share.target.name.split(' ')[0]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 