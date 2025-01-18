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
  Pill,
  Network,
  Server,
  Activity,
  Wrench,
  Building2
} from 'lucide-react';

export default function Sidebar({ userType }) {
  const location = useLocation();

  const doctorNavigation = [
    { name: 'Dashboard', icon: Home, href: '/doctor/dashboard' },
    { name: 'Appointments', icon: Calendar, href: '/doctor/appointments' },
    { name: 'Patients', icon: Users, href: '/doctor/patients' },
    { name: 'Medical Records', icon: FileText, href: '/doctor/records' },
    { name: 'Analytics', icon: BarChart2, href: '/doctor/analytics' },
    { name: 'AI Insights', icon: Heart, href: '/doctor/ai-insights' },
    { name: 'Settings', icon: Settings, href: '/doctor/settings' },
  ];

  const patientNavigation = [
    { name: 'Dashboard', icon: Home, href: '/patient/dashboard' },
    { name: 'Appointments', icon: Calendar, href: '/patient/appointments' },
    { name: 'Medical Records', icon: FileText, href: '/patient/records' },
    { name: 'Messages', icon: MessageSquare, href: '/patient/messages' },
    { name: 'Lab Results', icon: TestTube2, href: '/patient/lab-results' },
    { name: 'Prescriptions', icon: Pill, href: '/patient/prescriptions' },
    { name: 'Settings', icon: Settings, href: '/patient/settings' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', icon: Home, href: '/network/dashboard' },
    { name: 'Network Status', icon: Activity, href: '/network/status' },
    { name: 'Facilities', icon: Building2, href: '/network/facilities' },
    { name: 'Maintenance', icon: Wrench, href: '/network/maintenance' },
    { name: 'Analytics', icon: BarChart2, href: '/network/analytics' },
    { name: 'Alerts', icon: Activity, href: '/network/alerts' },
    { name: 'Settings', icon: Settings, href: '/network/settings' },
  ];

  const navigation = 
    userType === 'doctor' ? doctorNavigation : 
    userType === 'admin' ? adminNavigation :
    patientNavigation;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-indigo-700 to-indigo-900">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${location.pathname === item.href
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'}
                `}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${location.pathname === item.href ? 'text-white' : 'text-indigo-300'}
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