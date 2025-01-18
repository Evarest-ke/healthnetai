import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AppointmentDetailsModal = ({ appointment, isEditMode, onClose, onSave }) => {
  const [editedData, setEditedData] = useState({
    ...appointment,
    contact: appointment.contact || { phone: '', email: '' }
  });

  useEffect(() => {
    setEditedData({
      ...appointment,
      contact: appointment.contact || { phone: '', email: '' }
    });
  }, [appointment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedData);
  };

  const handleContactChange = (field, value) => {
    setEditedData({
      ...editedData,
      contact: {
        ...editedData.contact,
        [field]: value
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {isEditMode ? 'Edit Appointment' : 'Appointment Details'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            {isEditMode ? (
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={editedData.patientName}
                onChange={(e) => setEditedData({...editedData, patientName: e.target.value})}
                required
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{appointment.patientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
            {isEditMode ? (
              <DatePicker
                selected={new Date(editedData.appointmentTime)}
                onChange={(date) => setEditedData({...editedData, appointmentTime: date.toISOString()})}
                showTimeSelect
                dateFormat="MMMM d, yyyy HH:mm"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {new Date(appointment.appointmentTime).toLocaleString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Contact Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditMode ? (
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editedData.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  pattern="[0-9+-\s]+"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{appointment.contact?.phone || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              {isEditMode ? (
                <input
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editedData.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{appointment.contact?.email || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            {isEditMode ? (
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={editedData.status}
                onChange={(e) => setEditedData({...editedData, status: e.target.value})}
                required
              >
                <option value="pending">Pending</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-900">{appointment.status}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            {isEditMode ? (
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={editedData.reason}
                onChange={(e) => setEditedData({...editedData, reason: e.target.value})}
                required
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{appointment.reason}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            {isEditMode ? (
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="3"
                value={editedData.notes}
                onChange={(e) => setEditedData({...editedData, notes: e.target.value})}
                placeholder="Add any additional notes here"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{appointment.notes || 'No notes'}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            {isEditMode && (
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
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

export default AppointmentDetailsModal; 