import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  Activity,
  Zap,
  AlertTriangle,
  Clock,
  Signal,
  Wifi,
  Server,
  Users,
  ArrowUp,
  ArrowDown,
  RefreshCcw,
  Download,
  Upload,
  Calendar
} from 'lucide-react';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import NetworkTopology from '../components/NetworkTopology';
import ProtocolAnalysis from '../components/ProtocolAnalysis';
import PredictiveAnalytics from '../components/PredictiveAnalytics';

export default function NetworkAnalytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('bandwidth');

  // Sample data - Replace with actual data from your backend
  const performanceData = {
    bandwidth: [
      { time: '00:00', usage: 45, available: 100 },
      { time: '04:00', usage: 30, available: 100 },
      { time: '08:00', usage: 65, available: 100 },
      { time: '12:00', usage: 85, available: 100 },
      { time: '16:00', usage: 75, available: 100 },
      { time: '20:00', usage: 55, available: 100 }
    ],
    latency: [
      { time: '00:00', value: 15 },
      { time: '04:00', value: 12 },
      { time: '08:00', value: 25 },
      { time: '12:00', value: 18 },
      { time: '16:00', value: 22 },
      { time: '20:00', value: 16 }
    ]
  };

  const networkHealth = {
    uptime: 99.98,
    activeConnections: 1250,
    avgLatency: 18,
    packetLoss: 0.02,
    bandwidthUtilization: 65,
    errorRate: 0.05
  };

  const facilityMetrics = [
    { name: 'Facility A', performance: 98, issues: 1, status: 'optimal' },
    { name: 'Facility B', performance: 92, issues: 3, status: 'warning' },
    { name: 'Facility C', performance: 95, issues: 2, status: 'good' },
    { name: 'Facility D', performance: 88, issues: 5, status: 'critical' }
  ];

  const trafficDistribution = [
    { name: 'HTTP/HTTPS', value: 45 },
    { name: 'VPN', value: 25 },
    { name: 'File Transfer', value: 15 },
    { name: 'Video', value: 10 },
    { name: 'Other', value: 5 }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="admin" />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader 
          userType="admin"
          userName="Admin Smith"
          userImage="/path/to/admin-image.jpg"
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Network Analytics</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive overview of network performance and health metrics
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
                <button className="flex items-center px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>

            {/* Network Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Uptime</p>
                    <p className="text-2xl font-semibold text-green-600">{networkHealth.uptime}%</p>
                  </div>
                  <Signal className="h-8 w-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Connections</p>
                    <p className="text-2xl font-semibold text-indigo-600">{networkHealth.activeConnections}</p>
                  </div>
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg Latency</p>
                    <p className="text-2xl font-semibold text-blue-600">{networkHealth.avgLatency}ms</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Packet Loss</p>
                    <p className="text-2xl font-semibold text-yellow-600">{networkHealth.packetLoss}%</p>
                  </div>
                  <RefreshCcw className="h-8 w-8 text-yellow-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bandwidth Usage</p>
                    <p className="text-2xl font-semibold text-purple-600">{networkHealth.bandwidthUtilization}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-4 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Error Rate</p>
                    <p className="text-2xl font-semibold text-red-600">{networkHealth.errorRate}%</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </motion.div>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bandwidth Usage Chart */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Network Performance</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData.bandwidth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="usage" 
                          stackId="1"
                          stroke="#4F46E5" 
                          fill="#4F46E5" 
                          fillOpacity={0.2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="available" 
                          stackId="1"
                          stroke="#E5E7EB" 
                          fill="#E5E7EB" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Traffic Distribution */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Traffic Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {trafficDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                      {trafficDistribution.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Facility Performance */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Facility Performance</h2>
                  <div className="space-y-4">
                    {facilityMetrics.map((facility) => (
                      <div key={facility.name} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{facility.name}</h3>
                          <span className={`${getStatusColor(facility.status)}`}>
                            {facility.status}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              facility.performance > 95 ? 'bg-green-500' :
                              facility.performance > 90 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${facility.performance}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                          <span>Performance: {facility.performance}%</span>
                          <span>Issues: {facility.issues}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Network Alerts */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Network Alerts</h2>
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-red-800">High Priority</h4>
                          <ul className="mt-2 text-sm text-red-700 space-y-1">
                            <li>• Bandwidth threshold exceeded in Facility B</li>
                            <li>• Unusual traffic pattern detected</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-yellow-800">Medium Priority</h4>
                          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                            <li>• Latency spike in Facility C</li>
                            <li>• Connection drops above normal</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <NetworkTopology />
              </div>

              <div className="lg:col-span-3">
                <ProtocolAnalysis />
              </div>

              <div className="lg:col-span-3">
                <PredictiveAnalytics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 