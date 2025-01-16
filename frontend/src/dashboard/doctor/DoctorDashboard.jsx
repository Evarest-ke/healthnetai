import React from 'react';
import { Users, Calendar, Activity, DollarSign, Clock, Search, FileText } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import PatientQueue from './PatientQueue';
import AppointmentCalendar from './AppointmentCalendar';
import PatientStats from './PatientStats';

const DoctorDashboard = () => {
  const todaysPatients = [
    {
      id: "1",
      name: "Sarah Johnson",
      time: "09:00 AM",
      type: "Follow-up",
      status: "Waiting"
    }
  ];

  const stats = [
    { title: 'Patients Today', value: '12', icon: Users },
    { title: 'Appointments', value: '8', icon: Calendar },
    { title: 'Completion Rate', value: '95%', icon: Activity },
    { title: 'Revenue Today', value: '$1,200', icon: DollarSign }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="doctor" />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader 
          userType="doctor"
          userName="Dr. Sarah Smith"
          userImage="/path/to/doctor-image.jpg"
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header with Search */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Sarah Smith</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  Add Patient
                </button>
                <button className="flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200">
                  <FileText className="h-5 w-5 mr-2" />
                  Medical Records
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <stat.icon className="h-8 w-8 text-indigo-600" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Patient Queue */}
              <div className="lg:col-span-1 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Today's Queue</h2>
                  <PatientQueue patients={todaysPatients} />
                </div>
              </div>

              {/* Calendar and Appointments */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Schedule</h2>
                  <AppointmentCalendar />
                </div>
              </div>

              {/* Patient Statistics */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Patient Statistics</h2>
                  <PatientStats />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 