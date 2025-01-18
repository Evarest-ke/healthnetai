import React from 'react';
import { Calendar, Clock, Wrench, CheckCircle, AlertCircle } from 'lucide-react';

export default function MaintenanceSchedule() {
  const maintenanceTasks = [
    {
      id: 1,
      facility: 'Facility A',
      task: 'Router Firmware Update',
      date: '2024-03-25',
      time: '02:00 AM',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 2,
      facility: 'Facility B',
      task: 'Bandwidth Optimization',
      date: '2024-03-26',
      time: '03:00 AM',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      facility: 'Facility C',
      task: 'Network Cable Replacement',
      date: '2024-03-27',
      time: '01:00 AM',
      status: 'pending',
      priority: 'critical'
    }
  ];

  const getStatusBadge = (status, priority) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset";
    
    switch (status) {
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-700 ring-blue-600/20`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-700 ring-green-600/20`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-700 ring-yellow-600/20`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 ring-gray-600/20`;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      default:
        return <Wrench className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Tasks</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-900">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {maintenanceTasks.map((task) => (
          <div 
            key={task.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getPriorityIcon(task.priority)}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{task.task}</h4>
                  <p className="text-sm text-gray-500">{task.facility}</p>
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{task.date}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
              <span className={getStatusBadge(task.status, task.priority)}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Schedule New Maintenance
        </button>
      </div>
    </div>
  );
} 