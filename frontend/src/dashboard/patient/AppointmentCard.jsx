import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function AppointmentCard({ appointment }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{appointment.doctorName}</h3>
          <span className="text-sm text-gray-500">{appointment.specialty}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {appointment.status}
        </span>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.date}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{appointment.time}</span>
        </div>
      </div>
    </div>
  );
} 