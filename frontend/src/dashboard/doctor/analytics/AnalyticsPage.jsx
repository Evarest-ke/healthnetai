import React from 'react';
import { BarChart2, TrendingUp, Users, Calendar, Clock, Activity } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  // Update patient visits data to include all months
  const patientVisitsData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Patient Visits',
        data: [65, 59, 80, 81, 56, 75, 70, 68, 72, 83, 78, 76],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      }
    ]
  };

  // Update the Bar chart options for better display of all months
  const patientVisitsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  const conditionsData = {
    labels: ['Hypertension', 'Diabetes', 'Asthma', 'Heart Disease', 'Arthritis'],
    datasets: [
      {
        data: [30, 25, 15, 20, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const appointmentTrendsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Scheduled',
        data: [40, 45, 38, 42],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Completed',
        data: [38, 42, 35, 40],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      }
    ]
  };

  const stats = [
    {
      title: 'Total Patients',
      value: '1,284',
      change: '+12.5%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Avg. Daily Visits',
      value: '24',
      change: '+4.3%',
      icon: Calendar,
      trend: 'up'
    },
    {
      title: 'Avg. Visit Duration',
      value: '28m',
      change: '-2.1%',
      icon: Clock,
      trend: 'down'
    },
    {
      title: 'Treatment Success Rate',
      value: '94%',
      change: '+1.2%',
      icon: Activity,
      trend: 'up'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="doctor" />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader 
          userType="doctor"
          userName="Dr. Sarah Smith"
          userImage="/path/to/doctor-image.jpg"
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-500">Track your practice performance and patient trends</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${
                      stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <stat.icon className={`h-6 w-6 ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500"> vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Updated Patient Visits Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Patient Visits</h2>
                <div className="h-80">
                  <Bar 
                    data={patientVisitsData}
                    options={patientVisitsOptions}
                  />
                </div>
              </div>

              {/* Common Conditions Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Common Conditions</h2>
                <div className="h-80">
                  <Doughnut 
                    data={conditionsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Appointment Trends */}
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <h2 className="text-lg font-semibold mb-4">Appointment Trends</h2>
                <div className="h-80">
                  <Line 
                    data={appointmentTrendsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage; 