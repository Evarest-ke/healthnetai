import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart2,
  Settings, 
  Heart,
  FileText, 
  MessageSquare, 
  TestTube2,
  Pill
} from 'lucide-react';

export default function Sidebar({ userType }) {
  const location = useLocation();

  const doctorNavigation = [
    { name: 'Dashboard', icon: Home, path: '/doctor/dashboard' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Patients', icon: Users, path: '/doctor/patients' },
    { name: 'Analytics', icon: BarChart2, path: '/doctor/analytics' },
    { name: 'AI Insights', icon: Heart, path: '/doctor/insights' },
    { name: 'Settings', icon: Settings, path: '/doctor/settings' },
  ];

  const patientNavigation = [
    { name: 'Dashboard', icon: Home, path: '/patient/dashboard' },
    { name: 'Appointments', icon: Calendar, path: '/patient/appointments' },
    { name: 'Medical Records', icon: FileText, path: '/patient/records' },
    { name: 'Messages', icon: MessageSquare, path: '/patient/messages' },
    { name: 'Lab Results', icon: TestTube2, path: '/patient/lab-results' },
    { name: 'Prescriptions', icon: Pill, path: '/patient/prescriptions' },
    { name: 'Settings', icon: Settings, path: '/patient/settings' },
  ];

  const navigation = userType === 'doctor' ? doctorNavigation : patientNavigation;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-indigo-700 to-indigo-900">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${location.pathname === item.path
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'}
                `}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${location.pathname === item.path ? 'text-white' : 'text-indigo-300'}
                  `}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 