import React, { useState } from 'react';
import { Calendar, Activity, Pill, FileText, Clock, X } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import AppointmentCard from './AppointmentCard';
import HealthMetricsChart from './HealthMetricsChart';
import MedicationReminder from './MedicationReminder';
import DashboardHeader from '../layout/DashboardHeader';

export default function PatientDashboard() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const upcomingAppointments = [
    {
      id: "1",
      doctorName: "Dr. Sarah Smith",
      specialty: "Cardiologist",
      date: "2024-03-25",
      time: "10:00 AM",
      status: "scheduled"
    }
  ];

  const medications = [
    {
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Daily",
      timeToTake: "Morning",
      nextDose: "2024-03-21 08:00"
    }
  ];

  const availableDoctors = [
    { id: 1, name: "Dr. Sarah Smith", specialty: "Cardiologist" },
    { id: 2, name: "Dr. John Davis", specialty: "General Physician" },
  ];

  const handleBookAppointment = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to book the appointment
    const newAppointment = {
      doctorName: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patientName: "John Doe", // This would come from user context/state
      status: "waiting"
    };

    // Add to your backend/state management
    console.log('New appointment:', newAppointment);
    setIsBookingOpen(false);
    // Reset form
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="patient" />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader 
          userType="patient"
          userName="John Doe"
          userImage="/path/to/patient-image.jpg"
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, Mary.</h1>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Book Appointment
              </button>
            </div>

            {/* Appointment Booking Modal */}
            {isBookingOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Book Appointment</h2>
                    <button 
                      onClick={() => setIsBookingOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                      <select 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                      >
                        <option value="">Select a doctor</option>
                        {availableDoctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.name}>
                            {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <input
                        type="time"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Confirm Booking
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { name: 'View Records', icon: FileText },
                { name: 'Message Doctor', icon: Calendar },
                { name: 'Lab Results', icon: Activity },
                { name: 'Prescriptions', icon: Pill }
              ].map((action, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <action.icon className="h-5 w-5 mr-2 text-indigo-600" />
                  <span>{action.name}</span>
                </button>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              </div>

              {/* Health Metrics */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Health Metrics</h2>
                <HealthMetricsChart />
              </div>

              {/* Medication Schedule */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Medication Schedule</h2>
                <MedicationReminder medications={medications} />
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                <div className="space-y-4">
                  {[
                    { activity: 'Lab results uploaded', time: '2 hours ago' },
                    { activity: 'Prescription renewed', time: 'Yesterday' },
                    { activity: 'Appointment completed', time: '2 days ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <span className="text-gray-700">{activity.activity}</span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 