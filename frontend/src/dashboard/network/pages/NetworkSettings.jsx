import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  Server,
  Shield,
  Users,
  Bell,
  Database,
  Network,
  Clock,
  Lock,
  Key,
  Globe,
  Sliders,
  RefreshCw,
  HardDrive,
  Wifi,
  Activity,
  Cpu
} from 'lucide-react';
import Sidebar from '../../layout/Sidebar';
import DashboardHeader from '../../layout/DashboardHeader';
import AdvancedNetworkConfig from '../components/AdvancedNetworkConfig';
import SystemPerformanceSettings from '../components/SystemPerformanceSettings';

export default function NetworkSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState({
    networkName: 'HealthNet Primary Network',
    description: 'Main healthcare facility network infrastructure',
    timezone: 'UTC-5',
    dataRetention: '90',
    autoBackup: true,
    maintenanceWindow: '01:00-05:00'
  });

  const [monitoringSettings, setMonitoringSettings] = useState({
    pingInterval: '30',
    timeout: '5',
    retries: '3',
    bandwidthThreshold: '85',
    latencyThreshold: '100',
    packetLossThreshold: '2'
  });

  const [securitySettings, setSecuritySettings] = useState({
    firewallEnabled: true,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    encryptionLevel: 'AES-256',
    passwordPolicy: {
      minLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      expiryDays: 90
    },
    twoFactorAuth: true,
    sessionTimeout: '30'
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
    retention: '30',
    location: '/backup/network',
    encryptBackups: true,
    compressionLevel: 'high'
  });

  const handleSaveSettings = () => {
    // Implement save functionality
    setIsEditing(false);
    // Show success notification
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Network Name</label>
          <input
            type="text"
            value={generalSettings.networkName}
            onChange={(e) => setGeneralSettings({...generalSettings, networkName: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Timezone</label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC-6">Central Time (UTC-6)</option>
            <option value="UTC-7">Mountain Time (UTC-7)</option>
            <option value="UTC-8">Pacific Time (UTC-8)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={generalSettings.description}
            onChange={(e) => setGeneralSettings({...generalSettings, description: e.target.value})}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
          <input
            type="number"
            value={generalSettings.dataRetention}
            onChange={(e) => setGeneralSettings({...generalSettings, dataRetention: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maintenance Window</label>
          <input
            type="text"
            value={generalSettings.maintenanceWindow}
            onChange={(e) => setGeneralSettings({...generalSettings, maintenanceWindow: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ping Interval (seconds)</label>
          <input
            type="number"
            value={monitoringSettings.pingInterval}
            onChange={(e) => setMonitoringSettings({...monitoringSettings, pingInterval: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Timeout (seconds)</label>
          <input
            type="number"
            value={monitoringSettings.timeout}
            onChange={(e) => setMonitoringSettings({...monitoringSettings, timeout: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bandwidth Threshold (%)</label>
          <input
            type="number"
            value={monitoringSettings.bandwidthThreshold}
            onChange={(e) => setMonitoringSettings({...monitoringSettings, bandwidthThreshold: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Latency Threshold (ms)</label>
          <input
            type="number"
            value={monitoringSettings.latencyThreshold}
            onChange={(e) => setMonitoringSettings({...monitoringSettings, latencyThreshold: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">IP Whitelist</label>
          <textarea
            value={securitySettings.ipWhitelist.join('\n')}
            onChange={(e) => setSecuritySettings({
              ...securitySettings,
              ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Encryption Level</label>
          <select
            value={securitySettings.encryptionLevel}
            onChange={(e) => setSecuritySettings({...securitySettings, encryptionLevel: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="AES-128">AES-128</option>
            <option value="AES-256">AES-256</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
          <input
            type="number"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Length</label>
              <input
                type="number"
                value={securitySettings.passwordPolicy.minLength}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  passwordPolicy: {
                    ...securitySettings.passwordPolicy,
                    minLength: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry (days)</label>
              <input
                type="number"
                value={securitySettings.passwordPolicy.expiryDays}
                onChange={(e) => setSecuritySettings({
                  ...securitySettings,
                  passwordPolicy: {
                    ...securitySettings.passwordPolicy,
                    expiryDays: parseInt(e.target.value)
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
          <select
            value={backupSettings.frequency}
            onChange={(e) => setBackupSettings({...backupSettings, frequency: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Retention Period (days)</label>
          <input
            type="number"
            value={backupSettings.retention}
            onChange={(e) => setBackupSettings({...backupSettings, retention: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Backup Location</label>
          <input
            type="text"
            value={backupSettings.location}
            onChange={(e) => setBackupSettings({...backupSettings, location: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Compression Level</label>
          <select
            value={backupSettings.compressionLevel}
            onChange={(e) => setBackupSettings({...backupSettings, compressionLevel: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="admin" />
      
      <div className="flex-1 ml-64 overflow-hidden flex flex-col">
        <DashboardHeader 
          userType="admin"
          userName="Admin Smith"
          userImage="/path/to/admin-image.jpg"
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Network Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Configure network parameters and system preferences
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Settings Navigation */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'general', name: 'General', icon: Settings },
                  { id: 'monitoring', name: 'Monitoring', icon: Activity },
                  { id: 'security', name: 'Security', icon: Shield },
                  { id: 'backup', name: 'Backup', icon: Database },
                  { id: 'advanced', name: 'Advanced Network', icon: Network },
                  { id: 'performance', name: 'Performance', icon: Cpu }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    <tab.icon className={`
                      h-5 w-5 mr-2
                      ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'monitoring' && renderMonitoringSettings()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'backup' && renderBackupSettings()}
              {activeTab === 'advanced' && <AdvancedNetworkConfig />}
              {activeTab === 'performance' && <SystemPerformanceSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 