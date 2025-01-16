import React from 'react';
import { Calendar, Activity, Pill, FileText, Clock } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import AppointmentCard from './AppointmentCard';
import HealthMetricsChart from './HealthMetricsChart';
import MedicationReminder from './MedicationReminder';
import DashboardHeader from '../layout/DashboardHeader';

export default function PatientDashboard() {
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, John</h1>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Book Appointment
              </button>
            </div>

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