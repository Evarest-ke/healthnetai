import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PatientStats() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patients Seen',
        data: [12, 19, 15, 17, 14, 8, 5],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        padding: 8,
      },
      title: {
        display: true,
        text: 'Weekly Patient Statistics',
        padding: {
          top: 8,
          bottom: 16
        },
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    },
    layout: {
      padding: {
        left: 8,
        right: 8,
        top: 0,
        bottom: 8
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3">
      <div className="w-full h-[280px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
} 