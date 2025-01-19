import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  Users,
  Server,
  Settings,
  History,
  BarChart,
  Plus,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import MaintenanceSchedule from '../MaintenanceSchedule';
import MaintenanceTaskForm from '../components/MaintenanceTaskForm';
import MaintenanceHistory from '../components/MaintenanceHistory';
import ImpactAnalysis from '../components/ImpactAnalysis';
import ResourceAllocation from '../components/ResourceAllocation';

export default function MaintenancePage() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('upcoming');

  const maintenanceStats = [
    {
      title: 'Scheduled Tasks',
      value: '12',
      icon: Calendar,
      trend: 'up',
      change: '+2',
      color: 'blue'
    },
    {
      title: 'Completed Tasks',
      value: '45',
      icon: CheckCircle,
      trend: 'up',
      change: '+5',
      color: 'green'
    },
    {
      title: 'Critical Updates',
      value: '3',
      icon: AlertCircle,
      trend: 'down',
      change: '-1',
      color: 'red'
    },
    {
      title: 'Resource Utilization',
      value: '85%',
      icon: Users,
      trend: 'stable',
      change: '0%',
      color: 'yellow'
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Schedule and track network maintenance tasks
                </p>
              </div>
              <button 
                onClick={() => setIsTaskFormOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Maintenance Task
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {maintenanceStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm ${
                          stat.trend === 'up' ? 'text-green-500' :
                          stat.trend === 'down' ? 'text-red-500' :
                          'text-gray-500'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`bg-${stat.color}-50 p-3 rounded-full`}>
                      <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid - Updated Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Maintenance Schedule */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Maintenance Schedule</h2>
                  <MaintenanceSchedule 
                    onTaskSelect={setSelectedTask}
                    filterStatus={filterStatus}
                    dateRange={dateRange}
                  />
                </div>
              </div>

              {/* Impact Analysis */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
                  <ImpactAnalysis selectedTask={selectedTask} />
                </div>
              </div>

              {/* Resource Allocation - New Section */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <ResourceAllocation maintenanceTask={selectedTask} />
                </div>
              </div>

              {/* Quick Actions Panel - New Section */}
              <div className="lg:col-span-1 space-y-6">
                {/* Task Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setIsTaskFormOpen(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Schedule New Task
                    </button>
                    <button 
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      View Calendar
                    </button>
                    <button 
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Export Schedule
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Filters</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance History */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Maintenance History</h2>
                  <MaintenanceHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Task Form Modal */}
      <MaintenanceTaskForm 
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        task={selectedTask}
      />
    </div>
  );
} 