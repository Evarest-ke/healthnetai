import React, { useState } from 'react';
import { X, User, Calendar, Clock, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AppointmentDetailsModal({ appointment, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(appointment.notes || '');

  const handleSaveNotes = () => {
    // Save notes logic here
    setIsEditing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {/* Handle reschedule */}}
            >
              Reschedule
            </Button>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-md font-medium text-gray-900">
                {appointment.patientName}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span>{appointment.contact}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span>{appointment.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span>{appointment.time}</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span>{appointment.reason}</span>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-900">Notes</h4>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {notes || 'No notes added yet.'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="danger"
              onClick={() => {/* Handle cancellation */}}
            >
              Cancel Appointment
            </Button>
            <Button
              onClick={() => {/* Handle follow-up scheduling */}}
            >
              Schedule Follow-up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 