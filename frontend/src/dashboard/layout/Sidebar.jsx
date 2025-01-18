import React from 'react';
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
  Wrench
} from 'lucide-react';

export default function Sidebar({ userType }) {
  const doctorNavigation = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Appointments', icon: Calendar, current: false },
    { name: 'Patients', icon: Users, current: false },
    { name: 'Medical Records', icon: FileText, current: false },
    { name: 'Analytics', icon: BarChart2, current: false },
    { name: 'AI Insights', icon: Heart, current: false },
    { name: 'Settings', icon: Settings, current: false },
  ];

  const patientNavigation = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Appointments', icon: Calendar, current: false },
    { name: 'Medical Records', icon: FileText, current: false },
    { name: 'Messages', icon: MessageSquare, current: false },
    { name: 'Lab Results', icon: TestTube2, current: false },
    { name: 'Prescriptions', icon: Pill, current: false },
    { name: 'Settings', icon: Settings, current: false },
  ];

  const adminNavigation = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Network Status', icon: Network, current: false },
    { name: 'Facilities', icon: Server, current: false },
    { name: 'Maintenance', icon: Wrench, current: false },
    { name: 'Analytics', icon: BarChart2, current: false },
    { name: 'Alerts', icon: Activity, current: false },
    { name: 'Settings', icon: Settings, current: false },
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
              <a
                key={item.name}
                href="#"
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${item.current
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'}
                `}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${item.current ? 'text-white' : 'text-indigo-300'}
                  `}
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
} 