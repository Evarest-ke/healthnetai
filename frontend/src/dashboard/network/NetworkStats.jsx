import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function NetworkStats() {
  const data = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Bandwidth Usage (Mbps)',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4
      },
      {
        label: 'Latency (ms)',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Network Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Average Bandwidth</h3>
          <p className="text-2xl font-semibold text-blue-900">75 Mbps</p>
          <p className="text-sm text-blue-600">+5% from last hour</p>
        </div>
        
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Average Latency</h3>
          <p className="text-2xl font-semibold text-yellow-900">45 ms</p>
          <p className="text-sm text-yellow-600">-2ms from last hour</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Packet Loss</h3>
          <p className="text-2xl font-semibold text-green-900">0.1%</p>
          <p className="text-sm text-green-600">Within acceptable range</p>
        </div>
      </div>
    </div>
  );
} 