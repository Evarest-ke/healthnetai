import React, { useState } from 'react';
import { Cpu, Activity, BarChart2, Clock } from 'lucide-react';

export default function SystemPerformanceSettings() {
  const [performanceSettings, setPerformanceSettings] = useState({
    resourceThresholds: {
      cpu: 80,
      memory: 85,
      storage: 90,
      network: 75
    },
    optimizationSchedule: {
      enabled: true,
      interval: 'daily',
      time: '02:00',
      tasks: ['cache-clear', 'log-rotation', 'index-rebuild']
    },
    monitoring: {
      sampleRate: 60,
      retentionPeriod: 30,
      alertThreshold: 3
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-indigo-500" />
        System Performance Configuration
      </h3>

      {/* Resource Thresholds */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Resource Thresholds (%)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(performanceSettings.resourceThresholds).map(([resource, threshold]) => (
            <div key={resource} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 capitalize">{resource}</span>
              </div>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setPerformanceSettings({
                  ...performanceSettings,
                  resourceThresholds: {
                    ...performanceSettings.resourceThresholds,
                    [resource]: parseInt(e.target.value)
                  }
                })}
                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Schedule */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Optimization Schedule</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Interval</label>
            <select
              value={performanceSettings.optimizationSchedule.interval}
              onChange={(e) => setPerformanceSettings({
                ...performanceSettings,
                optimizationSchedule: {
                  ...performanceSettings.optimizationSchedule,
                  interval: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={performanceSettings.optimizationSchedule.time}
              onChange={(e) => setPerformanceSettings({
                ...performanceSettings,
                optimizationSchedule: {
                  ...performanceSettings.optimizationSchedule,
                  time: e.target.value
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Monitoring Configuration */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-4">Monitoring Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sample Rate (seconds)</label>
            <input
              type="number"
              value={performanceSettings.monitoring.sampleRate}
              onChange={(e) => setPerformanceSettings({
                ...performanceSettings,
                monitoring: {
                  ...performanceSettings.monitoring,
                  sampleRate: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Retention Period (days)</label>
            <input
              type="number"
              value={performanceSettings.monitoring.retentionPeriod}
              onChange={(e) => setPerformanceSettings({
                ...performanceSettings,
                monitoring: {
                  ...performanceSettings.monitoring,
                  retentionPeriod: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alert Threshold</label>
            <input
              type="number"
              value={performanceSettings.monitoring.alertThreshold}
              onChange={(e) => setPerformanceSettings({
                ...performanceSettings,
                monitoring: {
                  ...performanceSettings.monitoring,
                  alertThreshold: parseInt(e.target.value)
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 