import React, { useState } from 'react';
import { Search, Plus, Download, LogOut, Calendar as CalendarIcon, List } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentsList from './AppointmentsList';
import AddAppointmentModal from './AddAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { useAppointments } from '../../hooks/useAppointments';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';

// Mock data for development
const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2024-03-25",
    time: "10:00 AM",
    reason: "Diabetes Follow-up",
    status: "upcoming",
    contact: "+1 234 567 8900",
    email: "john.doe@example.com",
    notes: "Regular checkup for blood sugar levels"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2024-03-25",
    time: "11:30 AM",
    reason: "Hypertension Check",
    status: "upcoming",
    contact: "+1 234 567 8901",
    email: "jane.smith@example.com",
    notes: "Monthly blood pressure monitoring"
  }
];

export default function AppointmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [view, setView] = useState('calendar');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showSuccess, showError } = useNotification();

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const handleAddAppointment = async (appointmentData) => {
    try {
      // Mock adding appointment
      const newAppointment = {
        id: appointments.length + 1,
        ...appointmentData,
        status: 'upcoming'
      };
      setAppointments([...appointments, newAppointment]);
      showSuccess('Appointment created successfully');
      setIsAddModalOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to create appointment');
    }
  };

  const handleUpdateAppointment = async (id, appointmentData) => {
    try {
      // Mock updating appointment
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, ...appointmentData } : apt
      ));
      showSuccess('Appointment updated successfully');
      setIsDetailsModalOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to update appointment');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        // Mock deleting appointment
        setAppointments(appointments.filter(apt => apt.id !== id));
        showSuccess('Appointment deleted successfully');
        setIsDetailsModalOpen(false);
      } catch (err) {
        showError(err.message || 'Failed to delete appointment');
      }
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // Filter appointments based on search query
    const filtered = MOCK_APPOINTMENTS.filter(apt => 
      apt.patientName.toLowerCase().includes(query) ||
      apt.reason.toLowerCase().includes(query)
    );
    setAppointments(filtered);
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
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-600 text-white"
                  icon={<Plus className="h-5 w-5" />}
                >
                  Add Appointment
                </Button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  view === 'calendar'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar View
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  view === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-5 w-5 mr-2" />
                List View
              </button>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Main Content */}
            {!loading && !error && (
              <div className="bg-white rounded-lg shadow">
                {view === 'calendar' ? (
                  <AppointmentCalendar
                    appointments={appointments}
                    onAppointmentClick={handleAppointmentClick}
                  />
                ) : (
                  <AppointmentsList
                    appointments={appointments}
                    onAppointmentClick={handleAppointmentClick}
                    onDeleteAppointment={handleDeleteAppointment}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddAppointmentModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddAppointment}
        />
      )}
      
      {isDetailsModalOpen && selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setIsDetailsModalOpen(false)}
          onUpdate={handleUpdateAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
} 