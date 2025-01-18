import React, { useState } from 'react';
import { 
  Server, 
  Wifi, 
  Settings, 
  Search, 
  Plus,
  Filter,
  SortAsc,
  MapPin,
  Users,
  Activity,
  Signal
} from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import FacilityCard from '../components/FacilityCard';
import FacilityDetailsModal from '../components/FacilityDetailsModal';
import FacilityMap from '../components/FacilityMap';

export default function Facilities() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock facilities data
  const facilities = [
    {
      id: 1,
      name: 'Central Hospital',
      location: 'New York, NY',
      status: 'active',
      type: 'Hospital',
      connectionStrength: 95,
      lastSync: '2 minutes ago',
      activeUsers: 120,
      bandwidth: {
        used: 75,
        total: 100
      },
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      metrics: {
        uptime: '99.9%',
        latency: '15ms',
        packetLoss: '0.1%'
      }
    },
    // Add more facility objects...
  ];

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || facility.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
              <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Facility
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search facilities..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Server className="h-5 w-5" />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
                      onClick={() => setViewMode('map')}
                    >
                      <MapPin className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Signal className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Total Facilities</h3>
                    <p className="text-3xl font-bold">{facilities.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Active Users</h3>
                    <p className="text-3xl font-bold">
                      {facilities.reduce((sum, facility) => sum + facility.activeUsers, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">Average Uptime</h3>
                    <p className="text-3xl font-bold">99.8%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities List/Map View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    onClick={() => setSelectedFacility(facility)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <FacilityMap
                  facilities={filteredFacilities}
                  selectedFacility={selectedFacility}
                  onFacilitySelect={setSelectedFacility}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Facility Details Modal */}
      <FacilityDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facility={selectedFacility}
      />
    </div>
  );
} 