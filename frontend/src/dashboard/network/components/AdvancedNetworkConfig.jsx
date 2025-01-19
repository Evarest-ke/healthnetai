import React, { useState } from 'react';
import { Network, Cpu, HardDrive, Wifi, Settings, Save, RefreshCw } from 'lucide-react';

export default function AdvancedNetworkConfig() {
  const [qosSettings, setQosSettings] = useState({
    enabled: true,
    priorityServices: ['voip', 'medical-data', 'emergency-comms'],
    bandwidthLimits: {
      high: 100,
      medium: 50,
      low: 20
    },
    trafficShaping: true
  });

  const [loadBalancing, setLoadBalancing] = useState({
    enabled: true,
    algorithm: 'round-robin',
    healthChecks: true,
    checkInterval: 30,
    failoverEnabled: true,
    activeNodes: ['node1', 'node2', 'node3']
  });

  const [vlan, setVlan] = useState({
    configurations: [
      { id: 1, name: 'Medical Devices', vlanId: 10, subnet: '192.168.10.0/24', priority: 'high' },
      { id: 2, name: 'Staff Network', vlanId: 20, subnet: '192.168.20.0/24', priority: 'medium' },
      { id: 3, name: 'Guest Access', vlanId: 30, subnet: '192.168.30.0/24', priority: 'low' }
    ]
  });

  return (
    <div className="space-y-8">
      {/* QoS Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Network className="h-5 w-5 mr-2 text-indigo-500" />
          Quality of Service (QoS)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority Services</label>
            <select
              multiple
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {qosSettings.priorityServices.map(service => (
                <option key={service} value={service}>
                  {service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Bandwidth Limits (Mbps)</h4>
            <div className="space-y-2">
              {Object.entries(qosSettings.bandwidthLimits).map(([priority, limit]) => (
                <div key={priority} className="flex items-center">
                  <span className="w-20 text-sm text-gray-500 capitalize">{priority}:</span>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => setQosSettings({
                      ...qosSettings,
                      bandwidthLimits: {
                        ...qosSettings.bandwidthLimits,
                        [priority]: parseInt(e.target.value)
                      }
                    })}
                    className="ml-2 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Load Balancing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <RefreshCw className="h-5 w-5 mr-2 text-indigo-500" />
          Load Balancing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Algorithm</label>
            <select
              value={loadBalancing.algorithm}
              onChange={(e) => setLoadBalancing({...loadBalancing, algorithm: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="round-robin">Round Robin</option>
              <option value="least-connections">Least Connections</option>
              <option value="weighted">Weighted</option>
              <option value="ip-hash">IP Hash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Health Check Interval (s)</label>
            <input
              type="number"
              value={loadBalancing.checkInterval}
              onChange={(e) => setLoadBalancing({...loadBalancing, checkInterval: parseInt(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* VLAN Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Wifi className="h-5 w-5 mr-2 text-indigo-500" />
          VLAN Configuration
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VLAN ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subnet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vlan.configurations.map((config) => (
                <tr key={config.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{config.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{config.vlanId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{config.subnet}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${config.priority === 'high' ? 'bg-red-100 text-red-800' :
                        config.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}>
                      {config.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 