import React from 'react';
import { Clock, Users, ArrowRight, Plus } from 'lucide-react';

export default function AlertEscalation() {
  const escalationPolicies = [
    {
      id: 1,
      name: 'Critical Infrastructure',
      steps: [
        {
          level: 1,
          targets: ['Primary On-Call'],
          timeout: '5m'
        },
        {
          level: 2,
          targets: ['Secondary On-Call', 'Team Lead'],
          timeout: '10m'
        },
        {
          level: 3,
          targets: ['Operations Manager'],
          timeout: '15m'
        }
      ]
    },
    {
      id: 2,
      name: 'Network Issues',
      steps: [
        {
          level: 1,
          targets: ['Network Team'],
          timeout: '10m'
        },
        {
          level: 2,
          targets: ['Network Lead'],
          timeout: '15m'
        }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Escalation Policies</h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </button>
      </div>

      <div className="space-y-6">
        {escalationPolicies.map(policy => (
          <div key={policy.id} className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">{policy.name}</h3>
            <div className="space-y-4">
              {policy.steps.map((step, index) => (
                <div
                  key={step.level}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">
                      {step.level}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {step.targets.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Wait {step.timeout}
                      </span>
                    </div>
                  </div>
                  {index < policy.steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 