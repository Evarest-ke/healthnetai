import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export default function BandwidthDistribution({ data }) {
  const chartData = {
    labels: ['Healthcare Data', 'Telemedicine', 'Administrative', 'System Updates', 'Other'],
    datasets: [{
      data: [40, 25, 15, 12, 8],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(99, 102, 241, 0.6)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%'
  };

  const totalBandwidth = '950 Mbps';
  const bandwidthIncrease = '+12%';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Bandwidth Distribution</h2>
          <p className="text-sm text-gray-500">Current usage by category</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">{totalBandwidth}</span>
          <span className="flex items-center text-sm text-green-500">
            <ArrowUpRight className="h-4 w-4" />
            {bandwidthIncrease}
          </span>
        </div>
      </div>

      <div className="h-[300px] relative">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Usage</p>
            <p className="text-2xl font-bold text-indigo-600">85%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Peak Usage Time</p>
          <p className="text-lg font-semibold">14:00 - 16:00</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Available Bandwidth</p>
          <p className="text-lg font-semibold">150 Mbps</p>
        </div>
      </div>
    </div>
  );
} 