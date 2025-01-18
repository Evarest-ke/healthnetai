import React, { useState } from 'react';
import { Eye, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const AppointmentsList = ({ appointments, onViewDetails, onEdit, onDelete, onComplete }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'appointmentTime', direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleDelete = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      onDelete(appointmentId);
    }
  };

  const handleComplete = (appointment) => {
    if (window.confirm('Mark this appointment as completed?')) {
      onComplete(appointment.id);
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-8"></th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('patientName')}
            >
              Patient Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('appointmentTime')}
            >
              Date & Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAppointments.map((appointment) => (
            <React.Fragment key={appointment.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => setExpandedRow(expandedRow === appointment.id ? null : appointment.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedRow === appointment.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(appointment.appointmentTime).toLocaleString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                      appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onViewDetails(appointment)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onEdit(appointment)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    {appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleComplete(appointment)}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRow === appointment.id && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 bg-gray-50">
                    <div className="text-sm text-gray-900">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Contact Information</h4>
                          <p>Phone: {appointment.contact?.phone || 'Not provided'}</p>
                          <p>Email: {appointment.contact?.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Notes</h4>
                          <p>{appointment.notes || 'No notes'}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsList; 