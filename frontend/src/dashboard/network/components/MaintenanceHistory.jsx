import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaintenanceHistory() {
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const maintenanceHistory = [
    {
      id: 1,
      task: 'System Backup',
      facility: 'Facility A',
      date: '2024-03-20',
      time: '01:00 AM',
      duration: '45 minutes',
      status: 'completed',
      technician: 'John Doe',
      notes: 'Completed successfully with no issues'
    },
    {
      id: 2,
      task: 'Network Optimization',
      facility: 'Facility B',
      date: '2024-03-19',
      time: '02:30 AM',
      duration: '60 minutes',
      status: 'failed',
      technician: 'Jane Smith',
      notes: 'Failed due to hardware compatibility issues'
    },
    {
      id: 3,
      task: 'Security Update',
      facility: 'Facility C',
      date: '2024-03-18',
      time: '03:15 AM',
      duration: '30 minutes',
      status: 'completed',
      technician: 'Mike Johnson',
      notes: 'Security patches applied successfully'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700 ring-green-600/20`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-700 ring-red-600/20`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-700 ring-yellow-600/20`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-500 focus:ring-0"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-500 focus:ring-0"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700">
          <Download className="h-5 w-5" />
          <span>Export History</span>
        </button>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Facility
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technician
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {maintenanceHistory.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.task}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{record.facility}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{record.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{record.time}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{record.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(record.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(record.status)}
                      <span>{record.status}</span>
                    </div>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{record.technician}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{record.notes}</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 