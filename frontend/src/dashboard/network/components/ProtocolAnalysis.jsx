import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle } from 'lucide-react';

export default function ProtocolAnalysis() {
  const protocolData = [
    { protocol: 'HTTP', packets: 45000, anomalies: 23 },
    { protocol: 'HTTPS', packets: 78000, anomalies: 12 },
    { protocol: 'FTP', packets: 12000, anomalies: 45 },
    { protocol: 'SSH', packets: 34000, anomalies: 8 },
    { protocol: 'DNS', packets: 56000, anomalies: 15 },
    { protocol: 'SMTP', packets: 23000, anomalies: 19 }
  ];

  const securityEvents = [
    { type: 'Suspicious Pattern', count: 15, severity: 'high' },
    { type: 'Port Scan', count: 8, severity: 'medium' },
    { type: 'Invalid Protocol', count: 23, severity: 'low' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Protocol Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protocol Traffic */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Protocol Traffic Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="protocol" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="packets" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Events */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Security Events</h3>
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <div 
                key={event.type}
                className={`p-4 rounded-lg ${
                  event.severity === 'high' ? 'bg-red-50' :
                  event.severity === 'medium' ? 'bg-yellow-50' :
                  'bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className={`h-5 w-5 ${
                      event.severity === 'high' ? 'text-red-500' :
                      event.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <span className="ml-2 font-medium">{event.type}</span>
                  </div>
                  <span className="text-sm">{event.count} events</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Anomalies */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Protocol Anomalies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {protocolData.map((item) => (
              <div key={item.protocol} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.protocol}</span>
                  <AlertTriangle className={`h-5 w-5 ${
                    item.anomalies > 30 ? 'text-red-500' :
                    item.anomalies > 15 ? 'text-yellow-500' :
                    'text-green-500'
                  }`} />
                </div>
                <p className="text-sm text-gray-500">
                  {item.anomalies} anomalies detected
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 