import React, { useState, useEffect } from 'react';
import { Calendar, Search, Plus, Filter, RefreshCw, Check, X, CheckCircle } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import AppointmentCalendar from '../doctor/dashboard/AppointmentCalendar';
import PatientQueue from '../doctor/dashboard/PatientQueue';
import PatientStats from '../doctor/dashboard/PatientStats';
import AddAppointmentModal from './components/AddAppointmentModal';
import AppointmentDetailsModal from './components/AppointmentDetailsModal';
import AppointmentsList from './components/AppointmentsList';

const AppointmentsPage = () => {
  const [view, setView] = useState('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize appointments from localStorage or default data
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : [
      {
        id: 1,
        patientName: "John Doe",
        appointmentTime: "2024-03-25T10:00:00",
        reason: "Blood Pressure Check",
        status: "pending",
        priority: "medium",
        contact: { phone: "123-456-7890", email: "john@example.com" },
        notes: "Regular checkup for hypertension",
        requestedAt: "2024-03-20T08:00:00"
      },
      {
        id: 2,
        patientName: "Jane Smith",
        appointmentTime: "2024-03-26T14:00:00",
        reason: "Diabetes Follow-up",
        status: "pending",
        priority: "high",
        contact: { phone: "098-765-4321", email: "jane@example.com" },
        notes: "Monthly diabetes check",
        requestedAt: "2024-03-20T09:30:00"
      }
    ];
  });

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
  };

  const handleAppointmentResponse = (appointmentId, approved) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: approved ? 'upcoming' : 'rejected',
            responseDate: new Date().toISOString()
          }
        : apt
    );
    setAppointments(updatedAppointments);
  };

  // Filter appointments based on search query and status
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle appointment deletion
  const handleDeleteAppointment = (appointmentId) => {
    const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
    setAppointments(updatedAppointments);
  };

  // Format appointments for calendar view
  const calendarAppointments = appointments
    .filter(apt => apt.status === 'upcoming' || apt.status === 'completed')
    .map(apt => ({
      title: `${apt.patientName} - ${apt.reason}`,
      start: new Date(apt.appointmentTime),
      end: new Date(new Date(apt.appointmentTime).getTime() + 60 * 60 * 1000), // 1 hour duration
      backgroundColor: apt.status === 'upcoming' ? '#818CF8' : '#10B981',
      borderColor: apt.status === 'upcoming' ? '#6366F1' : '#059669',
      extendedProps: {
        ...apt
      }
    }));

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditMode(true);
  };

  const handleSaveEdit = (updatedData) => {
    setAppointments(appointments.map(apt => 
      apt.id === selectedAppointment.id ? { ...apt, ...updatedData } : apt
    ));
    setSelectedAppointment(null);
    setIsEditMode(false);
  };

  const handleCompleteAppointment = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'completed',
            completedAt: new Date().toISOString()
          }
        : apt
    ));
  };

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
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={handleSync}
                  className={`p-2 rounded-lg border ${isSyncing ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Appointment
                </button>
              </div>
            </div>

            {/* Add Pending Appointments Section */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Appointment Requests</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {appointments.filter(apt => apt.status === 'pending').map(appointment => (
                    <div key={appointment.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-500">
                              Requested: {new Date(appointment.requestedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-900">
                              Preferred Time: {new Date(appointment.appointmentTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Reason: {appointment.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center space-x-2">
                        <button
                          onClick={() => handleAppointmentResponse(appointment.id, true)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAppointmentResponse(appointment.id, false)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List View
              </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 bg-white rounded-lg shadow">
                {view === 'calendar' ? (
                  <AppointmentCalendar 
                    appointments={calendarAppointments}
                    onSelectEvent={(event) => setSelectedAppointment(event.extendedProps)}
                  />
                ) : (
                  <AppointmentsList 
                    appointments={filteredAppointments}
                    onViewDetails={setSelectedAppointment}
                    onEdit={handleEdit}
                    onDelete={handleDeleteAppointment}
                    onComplete={handleCompleteAppointment}
                  />
                )}
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-medium mb-4">Today's Queue</h2>
                  <PatientQueue patients={[]} />
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-medium mb-4">Statistics</h2>
                  <PatientStats />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddAppointmentModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(data) => {
            const newAppointment = {
              id: Date.now(),
              ...data,
              status: 'pending',
              requestedAt: new Date().toISOString()
            };
            setAppointments([...appointments, newAppointment]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isEditMode={isEditMode}
          onClose={() => {
            setSelectedAppointment(null);
            setIsEditMode(false);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default AppointmentsPage; 