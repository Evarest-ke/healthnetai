import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  Wifi, 
  Settings,
  Database,
  RefreshCw,
  Signal,
  Share2
} from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import NetworkStats from './NetworkStats';
import ConnectivityMap from './ConnectivityMap';
import MaintenanceSchedule from './MaintenanceSchedule';
import FacilityList from './FacilityList';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import api from '../../services/api';

export default function NetworkDashboard() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const { metrics, isConnected } = useWebSocket();
  const [clinics, setClinics] = useState([]);
  const [error, setError] = useState(null);
  const [activeShares, setActiveShares] = useState([]);
  const [networkLoad, setNetworkLoad] = useState({
    total: 0,
    shared: 0,
    available: 100
  });
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await api.get('/api/network/kisumu/clinics');
        const data = response.data;
        
        // Transform the data to match expected format
        const transformedData = data.map(clinic => ({
          ...clinic,
          coordinates: {
            latitude: clinic.coordinates.lat,
            longitude: clinic.coordinates.lng
          },
          networkStatus: clinic.network_status || 'offline',
          terrainFactor: 0.8
        }));
        
        console.log('Transformed clinics data:', transformedData);
        setClinics(transformedData);
      } catch (err) {
        console.error('Failed to fetch clinics:', err);
        setError(err.message);
        setClinics([]);
      }
    };

    fetchClinics();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/network/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const handleEmergencyShare = async (sourceId, targetId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/network/kisumu/emergency-share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, targetId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate bandwidth sharing');
      }

      // Add new sharing relationship with unique ID
      const source = clinics.find(c => c.id === sourceId);
      const target = clinics.find(c => c.id === targetId);
      
      if (source && target) {
        const shareId = `share-${sourceId}-${targetId}-${Date.now()}`;
        setActiveShares(prev => [...prev, {
          id: shareId,
          source: source,
          target: target,
          bandwidth: 25, // Mbps being shared
          startTime: new Date(),
          status: 'active'
        }]);

        // Update network load
        setNetworkLoad(prev => ({
          ...prev,
          shared: prev.shared + 25,
          available: Math.max(0, prev.available - 25)
        }));
      }
    } catch (error) {
      console.error('Emergency sharing failed:', error);
    }
  };
  
  const statsOverview = [
    { 
      title: 'Network Uptime', 
      value: isConnected ? '99.9%' : 'Offline', 
      icon: Signal,
      trend: isConnected ? 'up' : 'down',
      change: isConnected ? '+0.2%' : '-'
    },
    { 
      title: 'Active Facilities', 
      value: clinics?.length ? `${clinics.filter(c => c.networkStatus === 'online').length}/${clinics.length}` : '0/0', 
      icon: Server,
      trend: 'stable',
      change: '0'
    },
    { 
      title: 'Active Shares', 
      value: String(activeShares.length), 
      icon: Share2,
      trend: activeShares.length > 0 ? 'up' : 'stable',
      change: activeShares.length > 0 ? `+${activeShares.length}` : '0'
    },
    { 
      title: 'Network Load', 
      value: `${Math.round((networkLoad.total + networkLoad.shared) / (networkLoad.available + networkLoad.total + networkLoad.shared) * 100)}%`, 
      icon: Activity,
      trend: networkLoad.shared > 0 ? 'up' : 'stable',
      change: networkLoad.shared > 0 ? `+${networkLoad.shared}Mbps` : '0'
    }
  ];

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
              <h1 className="text-3xl font-bold text-gray-900">Network Overview</h1>
              <div className="flex space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  onClick={() => window.location.reload()}
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={`stat-${index}`}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 text-indigo-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-500' : 
                        stat.trend === 'down' ? 'text-red-500' : 
                        'text-gray-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Connectivity Map */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6 h-[600px]">
                  <h2 className="text-xl font-semibold mb-4">Network Status</h2>
                  <div className="h-full">
                    <ConnectivityMap 
                      clinics={clinics}
                      networkStatus={metrics?.networkStatus}
                      onFacilitySelect={setSelectedFacility}
                      realTimeMetrics={metrics}
                    />
                  </div>
                </div>
              </div>

              {/* Facility List */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                  <FacilityList 
                    selectedFacility={selectedFacility}
                    clinics={clinics}
                    onEmergencyShare={handleEmergencyShare}
                  />
                </div>
              </div>

              {/* Network Stats */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Network Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Bandwidth Sharing</h3>
                      <p className="mt-2 text-3xl font-semibold text-indigo-600">
                        {activeShares.length > 0 ? 'Active' : 'Available'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activeShares.length} active shares
                      </p>
                      {activeShares.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {activeShares.map((share, index) => (
                            <div key={`share-list-${share.id}-${index}`} className="text-sm">
                              {share.source.name} → {share.target.name}
                              <span className="ml-2 text-green-600">{share.bandwidth} Mbps</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Network Load</h3>
                      <p className="mt-2 text-3xl font-semibold text-indigo-600">
                        {Math.round((networkLoad.total + networkLoad.shared) / (networkLoad.available + networkLoad.total + networkLoad.shared) * 100)}%
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Base Load:</span>
                          <span>{networkLoad.total} Mbps</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shared:</span>
                          <span>{networkLoad.shared} Mbps</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Available:</span>
                          <span>{networkLoad.available} Mbps</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500">Active Connections</h3>
                      <p className="mt-2 text-3xl font-semibold text-indigo-600">
                        {clinics.filter(c => c.networkStatus === 'online').length}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Online:</span>
                          <span>{clinics.filter(c => c.networkStatus === 'online').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Offline:</span>
                          <span>{clinics.filter(c => c.networkStatus !== 'online').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total:</span>
                          <span>{clinics.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NetworkStats 
                    metrics={metrics}
                    isConnected={isConnected}
                    activeShares={activeShares}
                    networkLoad={networkLoad}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}