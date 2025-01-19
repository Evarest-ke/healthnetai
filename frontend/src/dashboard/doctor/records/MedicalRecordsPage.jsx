import React, { useState } from 'react';
import { Search, Filter, FileText, Download, Clock, Plus, Calendar, Activity } from 'lucide-react';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const MedicalRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient records data
  const [patients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 45,
      gender: "Female",
      bloodType: "A+",
      overview: {
        allergies: ["Penicillin", "Peanuts"],
        chronicConditions: ["Hypertension", "Type 2 Diabetes"],
        currentMedications: [
          { name: "Lisinopril", dosage: "10mg daily", startDate: "2023-01-15" },
          { name: "Metformin", dosage: "500mg twice daily", startDate: "2023-02-01" }
        ]
      },
      history: [
        {
          date: "2024-03-15",
          type: "Check-up",
          doctor: "Dr. Smith",
          diagnosis: "Routine follow-up for hypertension",
          prescription: "Continued current medications",
          notes: "Blood pressure: 130/85, Weight: 68kg"
        },
        {
          date: "2024-02-01",
          type: "Emergency",
          doctor: "Dr. Brown",
          diagnosis: "Acute bronchitis",
          prescription: "Prescribed antibiotics",
          notes: "Follow up in 2 weeks"
        }
      ],
      tests: [
        {
          date: "2024-03-15",
          type: "Blood Test",
          results: "Normal range",
          doctor: "Dr. Smith",
          notes: "Cholesterol levels improved"
        },
        {
          date: "2024-02-01",
          type: "X-Ray",
          results: "Clear",
          doctor: "Dr. Brown",
          notes: "Chest X-ray shows no abnormalities"
        }
      ]
    },
    // Add more patient records as needed
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = (patient) => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{patient.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="font-medium">{patient.age}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium">{patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Blood Type</p>
            <p className="font-medium">{patient.bloodType}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Medical Overview</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
            <div className="flex flex-wrap gap-2">
              {patient.overview.allergies.map((allergy, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Chronic Conditions</h4>
            <div className="flex flex-wrap gap-2">
              {patient.overview.chronicConditions.map((condition, index) => (
                <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {condition}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
            <div className="space-y-2">
              {patient.overview.currentMedications.map((medication, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-600">{medication.dosage}</p>
                  </div>
                  <p className="text-sm text-gray-600">Started: {medication.startDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = (patient) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Medical History</h3>
      <div className="space-y-4">
        {patient.history.map((record, index) => (
          <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium">{record.date}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                record.type === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {record.type}
              </span>
            </div>
            <div className="ml-7 space-y-2">
              <p><span className="text-gray-600">Doctor:</span> {record.doctor}</p>
              <p><span className="text-gray-600">Diagnosis:</span> {record.diagnosis}</p>
              <p><span className="text-gray-600">Prescription:</span> {record.prescription}</p>
              <p><span className="text-gray-600">Notes:</span> {record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTests = (patient) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Test Results</h3>
      <div className="space-y-4">
        {patient.tests.map((test, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium">{test.type}</span>
              </div>
              <span className="text-sm text-gray-600">{test.date}</span>
            </div>
            <div className="space-y-2">
              <p><span className="text-gray-600">Results:</span> {test.results}</p>
              <p><span className="text-gray-600">Doctor:</span> {test.doctor}</p>
              <p><span className="text-gray-600">Notes:</span> {test.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Add export functionality
  const handleExportRecords = () => {
    if (!selectedPatient) {
      alert('Please select a patient to export records');
      return;
    }

    // Format the data for CSV export
    const recordData = {
      patientInfo: {
        name: selectedPatient.name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        bloodType: selectedPatient.bloodType
      },
      allergies: selectedPatient.overview.allergies.join(', '),
      chronicConditions: selectedPatient.overview.chronicConditions.join(', '),
      medications: selectedPatient.overview.currentMedications.map(med => 
        `${med.name} (${med.dosage}) - Started: ${med.startDate}`
      ).join('; '),
      medicalHistory: selectedPatient.history.map(record => ({
        date: record.date,
        type: record.type,
        doctor: record.doctor,
        diagnosis: record.diagnosis,
        prescription: record.prescription,
        notes: record.notes
      })),
      testResults: selectedPatient.tests.map(test => ({
        date: test.date,
        type: test.type,
        results: test.results,
        doctor: test.doctor,
        notes: test.notes
      }))
    };

    // Create CSV data
    const csvData = [
      // Patient Information
      ['PATIENT INFORMATION'],
      ['Name', recordData.patientInfo.name],
      ['Age', recordData.patientInfo.age],
      ['Gender', recordData.patientInfo.gender],
      ['Blood Type', recordData.patientInfo.bloodType],
      [''],
      
      // Allergies and Conditions
      ['MEDICAL OVERVIEW'],
      ['Allergies', recordData.allergies],
      ['Chronic Conditions', recordData.chronicConditions],
      ['Current Medications', recordData.medications],
      [''],
      
      // Medical History
      ['MEDICAL HISTORY'],
      ['Date', 'Type', 'Doctor', 'Diagnosis', 'Prescription', 'Notes'],
      ...recordData.medicalHistory.map(record => [
        record.date,
        record.type,
        record.doctor,
        record.diagnosis,
        record.prescription,
        record.notes
      ]),
      [''],
      
      // Test Results
      ['TEST RESULTS'],
      ['Date', 'Type', 'Results', 'Doctor', 'Notes'],
      ...recordData.testResults.map(test => [
        test.date,
        test.type,
        test.results,
        test.doctor,
        test.notes
      ])
    ];

    // Convert to CSV and download
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `medical_records_${selectedPatient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
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
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button 
                  onClick={handleExportRecords}
                  className={`flex items-center px-4 py-2 rounded-lg border border-gray-300 ${
                    selectedPatient 
                      ? 'text-gray-600 hover:bg-gray-100 cursor-pointer' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedPatient}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export Records
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Patient List */}
              <div className="col-span-4">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Patients</h2>
                    <div className="space-y-2">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setSelectedPatient(patient)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedPatient?.id === patient.id
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3" />
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-gray-500">
                                {patient.age} years • {patient.gender}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Record Details */}
              <div className="col-span-8">
                {selectedPatient ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow">
                      <div className="border-b">
                        <nav className="flex">
                          <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-6 py-4 text-sm font-medium ${
                              activeTab === 'overview'
                                ? 'border-b-2 border-indigo-500 text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Overview
                          </button>
                          <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-4 text-sm font-medium ${
                              activeTab === 'history'
                                ? 'border-b-2 border-indigo-500 text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            History
                          </button>
                          <button
                            onClick={() => setActiveTab('tests')}
                            className={`px-6 py-4 text-sm font-medium ${
                              activeTab === 'tests'
                                ? 'border-b-2 border-indigo-500 text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            Test Results
                          </button>
                        </nav>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {activeTab === 'overview' && renderOverview(selectedPatient)}
                      {activeTab === 'history' && renderHistory(selectedPatient)}
                      {activeTab === 'tests' && renderTests(selectedPatient)}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    Select a patient to view their medical records
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage; 