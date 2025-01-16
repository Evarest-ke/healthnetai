import React from 'react';
import { Clock, User } from 'lucide-react';

export default function PatientQueue({ patients }) {
  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient.id} className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">{patient.type}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              patient.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}>
              {patient.status}
            </span>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>{patient.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 