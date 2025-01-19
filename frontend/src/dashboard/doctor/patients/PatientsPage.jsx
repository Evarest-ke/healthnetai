import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download } from 'lucide-react';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const PatientsPage = () => {
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem('patients');
    return savedPatients ? JSON.parse(savedPatients) : [
      {
        id: 1,
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        contact: "+1 234-567-8900",
        email: "sarah.j@email.com",
        lastVisit: "2024-03-15",
        condition: "Hypertension",
        status: "Active"
      },
      {
        id: 2,
        name: "Michael Chen",
        age: 32,
        gender: "Male",
        contact: "+1 234-567-8901",
        email: "m.chen@email.com",
        lastVisit: "2024-03-10",
        condition: "Diabetes Type 2",
        status: "Inactive"
      },
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Save patients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Add download functionality
  const handleDownload = () => {
    // Convert patients data to CSV format
    const csvData = filteredPatients.map(patient => ({
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Contact: patient.contact,
      Email: patient.email,
      'Last Visit': patient.lastVisit,
      Condition: patient.condition,
      Status: patient.status
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `patients_list_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Add Patient Modal
  const AddPatientModal = ({ onClose }) => {
    const [newPatient, setNewPatient] = useState({
      name: '',
      age: '',
      gender: '',
      contact: '',
      email: '',
      condition: '',
      status: 'Active'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const patient = {
        id: Date.now(),
        ...newPatient,
        lastVisit: new Date().toISOString().split('T')[0]
      };
      setPatients([...patients, patient]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                className="w-full p-2 border rounded"
                required
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              />
              <input
                type="number"
                placeholder="Age"
                className="w-full p-2 border rounded"
                required
                value={newPatient.age}
                onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                required
                value={newPatient.gender}
                onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="tel"
                placeholder="Contact Number"
                className="w-full p-2 border rounded"
                required
                value={newPatient.contact}
                onChange={(e) => setNewPatient({...newPatient, contact: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
              />
              <input
                type="text"
                placeholder="Medical Condition"
                className="w-full p-2 border rounded"
                required
                value={newPatient.condition}
                onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                required
                value={newPatient.status}
                onChange={(e) => setNewPatient({...newPatient, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // View/Edit Patient Modal
  const PatientModal = ({ patient, isEdit, onClose }) => {
    const [editedPatient, setEditedPatient] = useState(patient);

    const handleSubmit = (e) => {
      e.preventDefault();
      setPatients(patients.map(p => p.id === patient.id ? editedPatient : p));
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">
            {isEdit ? 'Edit Patient' : 'Patient Details'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isEdit ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={editedPatient.name}
                      onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={editedPatient.age}
                      onChange={(e) => setEditedPatient({...editedPatient, age: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={editedPatient.gender}
                      onChange={(e) => setEditedPatient({...editedPatient, gender: e.target.value})}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded"
                      value={editedPatient.contact}
                      onChange={(e) => setEditedPatient({...editedPatient, contact: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded"
                      value={editedPatient.email}
                      onChange={(e) => setEditedPatient({...editedPatient, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Condition
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={editedPatient.condition}
                      onChange={(e) => setEditedPatient({...editedPatient, condition: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={editedPatient.status}
                      onChange={(e) => setEditedPatient({...editedPatient, status: e.target.value})}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {patient.name}</p>
                  <p><strong>Age:</strong> {patient.age}</p>
                  <p><strong>Gender:</strong> {patient.gender}</p>
                  <p><strong>Contact:</strong> {patient.contact}</p>
                  <p><strong>Email:</strong> {patient.email}</p>
                  <p><strong>Condition:</strong> {patient.condition}</p>
                  <p><strong>Status:</strong> {patient.status}</p>
                  <p><strong>Last Visit:</strong> {patient.lastVisit}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                {isEdit ? 'Cancel' : 'Close'}
              </button>
              {isEdit && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Patient
              </button>
            </div>

            {/* Updated Search and Filter Bar with Download Button */}
            <div className="mb-6 flex justify-between items-center">
              <div className="flex space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Export to CSV
              </button>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age/Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.age} / {patient.gender}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.contact}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{patient.lastVisit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.condition}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsEditMode(false);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPatient(patient);
                            setIsEditMode(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddPatientModal onClose={() => setIsAddModalOpen(false)} />
      )}
      
      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          isEdit={isEditMode}
          onClose={() => {
            setSelectedPatient(null);
            setIsEditMode(false);
          }}
        />
      )}
    </div>
  );
};

export default PatientsPage;