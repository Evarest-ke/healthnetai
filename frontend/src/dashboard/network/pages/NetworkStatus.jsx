import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Server, 
  Wifi,
  WifiOff,
  RefreshCw,
  Zap,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import NetworkHealthCard from '../components/NetworkHealthCard';
import NetworkAlert from '../components/NetworkAlert';
import NetworkPerformanceChart from '../components/NetworkPerformanceChart';
import NetworkTopology from '../components/NetworkTopology';
import BandwidthDistribution from '../components/BandwidthDistribution';
import { useNetworkMetrics } from '../../../hooks/useNetwork';
import { networkService } from '../../../services/network';
import { toast } from 'react-toastify';

const NetworkStatus = () => {
  const [metrics, setMetrics] = useState({
    cpu_usage: 0,
    memory_usage: 0,
    network_latency: 0,
    bandwidth: {
      current: 0,
      total: 100,
      usage: 0
    },
    latency: {
      average: 0,
      peak: 0
    },
    packetLoss: {
      rate: 0,
      threshold: 5
    },
    activeConnections: {
      count: 0,
      capacity: 1000
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('bandwidth');
  const [extendedMetrics, setExtendedMetrics] = useState({
    ...metrics,
    networkHealth: {
      uptime: 0,
      reliability: 0,
      throughput: 0
    },
    edgeDevices: {
      total: 0,
      active: 0,
      syncing: 0
    },
    aiMetrics: {
      modelAccuracy: 0,
      inferenceTime: 0,
      lastUpdate: null
    }
  });

  useEffect(() => {
    let mounted = true;

    const fetchMetrics = async () => {
      if (!mounted) return;
      
      try {
        const data = await networkService.getMetrics();
        if (mounted) {
          setMetrics(prevMetrics => ({
            ...prevMetrics,
            ...data
          }));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
          toast.error('Failed to fetch network metrics');
        }
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 6000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading network status</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Performance metrics chart data
  const performanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Bandwidth Usage',
        data: [750, 820, 890, 920, 850, 800],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Latency',
        data: [20, 25, 30, 28, 22, 25],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Network Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Critical alerts
  const criticalAlerts = [
    {
      id: 1,
      facility: 'Facility A',
      issue: 'High Latency',
      severity: 'warning',
      timestamp: '5 minutes ago'
    },
    {
      id: 2,
      facility: 'Facility B',
      issue: 'Connection Lost',
      severity: 'critical',
      timestamp: '10 minutes ago'
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
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
                <h1 className="text-3xl font-bold text-gray-900">Network Status</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Real-time network performance monitoring
                </p>
              </div>
              <button 
                className={`inline-flex items-center px-4 py-2 rounded-lg 
                  ${isRefreshing ? 'bg-gray-100' : 'bg-indigo-600 hover:bg-indigo-700'} 
                  text-white transition-colors duration-200`}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}
              </button>
            </div>

            {/* Network Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <NetworkHealthCard
                title="Bandwidth Usage"
                value={metrics.bandwidth.current}
                trend="up"
                subValue={`${metrics.bandwidth.usage}% of ${metrics.bandwidth.total}`}
                icon={Zap}
                color="blue"
              />
              <NetworkHealthCard
                title="Average Latency"
                value={metrics.latency.average}
                trend="down"
                subValue={`Peak: ${metrics.latency.peak}`}
                icon={Clock}
                color="yellow"
              />
              <NetworkHealthCard
                title="Packet Loss"
                value={metrics.packetLoss.rate}
                trend="stable"
                subValue={`Threshold: ${metrics.packetLoss.threshold}`}
                icon={Activity}
                color="green"
              />
              <NetworkHealthCard
                title="Active Connections"
                value={metrics.activeConnections.count}
                trend="up"
                subValue={`${Math.round((metrics.activeConnections.count / metrics.activeConnections.capacity) * 100)}% of capacity`}
                icon={Users}
                color="indigo"
              />
            </div>

            {/* Performance Chart */}
            <NetworkPerformanceChart
              data={performanceData}
              timeRange={selectedTimeRange}
              metric={selectedMetric}
              onTimeRangeChange={setSelectedTimeRange}
              onMetricChange={setSelectedMetric}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <NetworkTopology />
              <BandwidthDistribution />
            </div>

            {/* Critical Alerts */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Critical Alerts</h2>
              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <NetworkAlert
                    key={alert.id}
                    alert={alert}
                    onActionClick={(alert) => {
                      // Handle alert action
                      console.log('Alert clicked:', alert);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus; 