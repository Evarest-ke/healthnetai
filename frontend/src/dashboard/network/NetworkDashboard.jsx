import React, { useState } from 'react';
import { 
  Activity, 
  Server, 
  AlertTriangle, 
  Wifi, 
  Settings,
  Database,
  RefreshCw,
  Signal
} from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import NetworkStats from './NetworkStats';
import ConnectivityMap from './ConnectivityMap';
import MaintenanceSchedule from './MaintenanceSchedule';
import FacilityList from './FacilityList';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NetworkDashboard() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  
  const stats = [
    { 
      title: 'Network Uptime', 
      value: '99.9%', 
      icon: Signal,
      trend: 'up',
      change: '0.2%'
    },
    { 
      title: 'Active Facilities', 
      value: '42/45', 
      icon: Server,
      trend: 'stable',
      change: '0'
    },
    { 
      title: 'Pending Syncs', 
      value: '3', 
      icon: RefreshCw,
      trend: 'down',
      change: '-2'
    },
    { 
      title: 'Critical Alerts', 
      value: '2', 
      icon: AlertTriangle,
      trend: 'up',
      change: '+1'
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
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                onClick={() => {/* Handle refresh */}}
              >
                Refresh Data
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
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
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Connectivity Map */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Network Status</h2>
                  <ConnectivityMap onFacilitySelect={setSelectedFacility} />
                </div>
              </div>

              {/* Facility List */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                  <FacilityList selectedFacility={selectedFacility} />
                </div>
              </div>

              {/* Network Stats */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Network Analytics</h2>
                  <NetworkStats />
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Maintenance</h2>
                  <MaintenanceSchedule />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 