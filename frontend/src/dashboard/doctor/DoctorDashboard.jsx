import React, { useState, useEffect } from 'react';
import { Users, Calendar, Activity, DollarSign, Clock, Search, FileText, X, AlertTriangle, Heart } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import DashboardHeader from '../layout/DashboardHeader';
import PatientQueue from './PatientQueue';
import AppointmentCalendar from './AppointmentCalendar';
import PatientStats from './PatientStats';

const DoctorDashboard = () => {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  
  // Initialize patients state from localStorage or default value
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('todaysPatients');
    return savedPatients ? JSON.parse(savedPatients) : [
      {
        id: "1",
        name: "Sarah Johnson",
        time: "09:00 AM",
        type: "Follow-up",
        status: "Waiting"
      }
    ];
  });

  // New patient form state
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    medicalHistory: ''
  });

  // Save patients to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todaysPatients', JSON.stringify(patients));
  }, [patients]);

  // Add high-risk patients state
  const [highRiskPatients] = useState([
    {
      id: "hr1",
      name: "John Smith",
      condition: "Severe Hypertension",
      riskLevel: "High",
      lastReading: "180/110 mmHg",
      trend: "increasing",
      aiPrediction: "89% risk of cardiovascular event",
      lastVisit: "2024-12-15"
    },
    {
      id: "hr2",
      name: "Mary Johnson",
      condition: "Uncontrolled Diabetes",
      riskLevel: "Critical",
      lastReading: "HbA1c: 9.8%",
      trend: "stable",
      aiPrediction: "75% risk of complications",
      lastVisit: "2024-03-10"
    }
  ]);

  // Risk level color mapping
  const riskLevelColors = {
    High: "text-orange-600 bg-orange-50",
    Critical: "text-red-600 bg-red-50",
    Moderate: "text-yellow-600 bg-yellow-50"
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    
    // Get current time in AM/PM format
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Create new patient object
    const patientToAdd = {
      id: Date.now().toString(),
      name: newPatient.name,
      email: newPatient.email,
      phone: newPatient.phone,
      dateOfBirth: newPatient.dateOfBirth,
      gender: newPatient.gender,
      address: newPatient.address,
      medicalHistory: newPatient.medicalHistory,
      status: "Waiting",
      time: currentTime,
      type: "New Patient",
      createdAt: new Date().toISOString()
    };

    // Update patients list
    setPatients(prev => [...prev, patientToAdd]);
    
    // Reset form and close modal
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      medicalHistory: ''
    });
    setIsAddPatientOpen(false);

    // Show success message
    alert('Patient added successfully!');
  };

  // Optional: Clear today's queue at the start of a new day
  useEffect(() => {
    const checkDate = () => {
      const lastChecked = localStorage.getItem('lastCheckedDate');
      const today = new Date().toDateString();

      if (lastChecked !== today) {
        // Clear the queue for the new day
        setPatients([]);
        localStorage.setItem('lastCheckedDate', today);
      }
    };

    checkDate();
  }, []);

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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. Sarah Smith</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button 
                  onClick={() => setIsAddPatientOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Patient
                </button>
              </div>
            </div>

            {/* Stats Overview - Made more compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <stat.icon className="h-6 w-6 text-indigo-600" />
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-xl font-semibold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6">
                {/* High Risk Patients Card */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        High Risk Patients
                      </h2>
                      <span className="text-sm text-gray-500">AI Monitored</span>
                    </div>
                    <div className="space-y-3">
                      {highRiskPatients.map((patient) => (
                        <div key={patient.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{patient.name}</h3>
                              <p className="text-sm text-gray-500">{patient.condition}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskLevelColors[patient.riskLevel]}`}>
                              {patient.riskLevel}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <p className="text-gray-500">Last Reading</p>
                              <p className="font-medium">{patient.lastReading}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Trend</p>
                              <p className={`font-medium ${
                                patient.trend === 'increasing' ? 'text-red-600' : 
                                patient.trend === 'decreasing' ? 'text-green-600' : 
                                'text-yellow-600'
                              }`}>
                                {patient.trend.charAt(0).toUpperCase() + patient.trend.slice(1)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-indigo-600">
                                <Heart className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">AI Prediction</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {patient.aiPrediction}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                            </span>
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Patient Queue */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Today's Queue</h2>
                    <PatientQueue patients={patients} />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Calendar Card */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Schedule</h2>
                    <div className="h-[500px]"> {/* Adjusted height */}
                      <AppointmentCalendar />
                    </div>
                  </div>
                </div>

                {/* Patient Statistics */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Patient Statistics</h2>
                    <div className="h-[300px]">
                      <PatientStats />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Patient Modal - Kept as is */}
      {isAddPatientOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Patient</h2>
              <button 
                onClick={() => setIsAddPatientOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newPatient.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newPatient.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={newPatient.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newPatient.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={newPatient.medicalHistory}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddPatientOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard; 