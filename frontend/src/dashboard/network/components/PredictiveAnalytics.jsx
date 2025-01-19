import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';

export default function PredictiveAnalytics() {
  const forecastData = [
    { time: '1h', actual: 65, predicted: 68 },
    { time: '2h', actual: 68, predicted: 72 },
    { time: '3h', actual: 72, predicted: 75 },
    { time: '4h', actual: 75, predicted: 79 },
    { time: '5h', actual: null, predicted: 82 },
    { time: '6h', actual: null, predicted: 85 }
  ];

  const potentialIssues = [
    {
      title: 'Bandwidth Saturation',
      probability: 75,
      impact: 'high',
      timeframe: '2-3 hours'
    },
    {
      title: 'Server Overload',
      probability: 45,
      impact: 'medium',
      timeframe: '4-6 hours'
    },
    {
      title: 'Network Congestion',
      probability: 60,
      impact: 'medium',
      timeframe: '1-2 hours'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Predictive Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Network Load Forecast</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#4F46E5" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#D1D5DB" 
                  strokeDasharray="5 5"
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Potential Issues */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Predicted Issues</h3>
          <div className="space-y-4">
            {potentialIssues.map((issue) => (
              <div 
                key={issue.title}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <AlertCircle className={`h-5 w-5 ${
                      issue.impact === 'high' ? 'text-red-500' :
                      issue.impact === 'medium' ? 'text-yellow-500' :
                      'text-green-500'
                    }`} />
                    <span className="ml-2 font-medium">{issue.title}</span>
                  </div>
                  <span className="text-sm">{issue.probability}% probability</span>
                </div>
                <div className="text-sm text-gray-500">
                  Expected in {issue.timeframe}
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      issue.probability > 70 ? 'bg-red-500' :
                      issue.probability > 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${issue.probability}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Automated Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                <h4 className="ml-2 font-medium text-indigo-900">Resource Optimization</h4>
              </div>
              <p className="text-sm text-indigo-700">
                Consider load balancing across secondary servers during predicted peak hours
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h4 className="ml-2 font-medium text-green-900">Capacity Planning</h4>
              </div>
              <p className="text-sm text-green-700">
                Increase bandwidth allocation by 15% to handle predicted traffic surge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 