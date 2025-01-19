import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function AlertRules() {
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'High CPU Usage',
      condition: 'cpu_usage > 90',
      duration: '5m',
      severity: 'critical',
      notification: ['email', 'slack'],
      enabled: true
    },
    {
      id: 2,
      name: 'Network Latency',
      condition: 'latency > 100ms',
      duration: '3m',
      severity: 'warning',
      notification: ['email'],
      enabled: true
    }
  ]);

  const [editingRule, setEditingRule] = useState(null);
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);

  const handleToggleRule = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (ruleId) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Alert Rules</h2>
        <button
          onClick={() => setShowNewRuleForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </button>
      </div>

      <div className="space-y-4">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`border rounded-lg p-4 ${
              rule.enabled ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{rule.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Condition: {rule.condition}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    rule.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {rule.severity}
                  </span>
                  <span className="text-sm text-gray-500">
                    Duration: {rule.duration}
                  </span>
                  <div className="flex items-center space-x-2">
                    {rule.notification.map(type => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setEditingRule(rule)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 