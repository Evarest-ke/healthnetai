import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function AddAppointmentModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    time: '',
    duration: '30',
    reason: '',
    priority: 'medium',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'weekly'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Appointment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Selection */}
          <div className="relative">
            <Input
              label="Patient Name"
              name="patientName"
              placeholder="Search patient..."
              value={formData.patientName}
              onChange={handleChange}
              error={errors.patientName}
              icon={<User className="h-5 w-5 text-gray-400" />}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              icon={<Calendar className="h-5 w-5 text-gray-400" />}
            />
            <Input
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              icon={<Clock className="h-5 w-5 text-gray-400" />}
            />
          </div>

          {/* Duration and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '1 hour' }
              ]}
            />
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
            />
          </div>

          {/* Reason for Visit */}
          <Select
            label="Reason for Visit"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            error={errors.reason}
            options={[
              { value: '', label: 'Select reason' },
              { value: 'diabetes-followup', label: 'Diabetes Follow-up' },
              { value: 'hypertension-check', label: 'Hypertension Check' },
              { value: 'cardiac-review', label: 'Cardiac Review' },
              { value: 'general-consultation', label: 'General Consultation' },
              { value: 'other', label: 'Other' }
            ]}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Recurring Appointment */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isRecurring"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="text-sm text-gray-700">
              Make this a recurring appointment
            </label>
          </div>

          {formData.isRecurring && (
            <Select
              label="Recurring Frequency"
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
              options={[
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' }
              ]}
            />
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Appointment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 