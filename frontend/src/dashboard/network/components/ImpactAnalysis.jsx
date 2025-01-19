import React from 'react';
import { Users, Server, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImpactAnalysis({ selectedTask }) {
  if (!selectedTask) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Select a maintenance task to view impact analysis
      </div>
    );
  }

  const impactMetrics = {
    affectedUsers: 250,
    downtime: '45 minutes',
    affectedServices: ['Network Access', 'VPN', 'Cloud Storage'],
    riskLevel: 'medium',
    contingencyPlan: 'Failover to backup systems'
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Affected Users</span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{impactMetrics.affectedUsers}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estimated Downtime</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{impactMetrics.downtime}</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-gray-50 rounded-lg"
      >
        <h3 className="text-sm font-medium text-gray-900 mb-2">Affected Services</h3>
        <div className="space-y-2">
          {impactMetrics.affectedServices.map((service, index) => (
            <div key={index} className="flex items-center text-sm">
              <Server className="h-4 w-4 text-gray-400 mr-2" />
              <span>{service}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Risk Assessment</h3>
          <AlertTriangle className={`h-4 w-4 ${
            impactMetrics.riskLevel === 'high' ? 'text-red-500' :
            impactMetrics.riskLevel === 'medium' ? 'text-yellow-500' :
            'text-green-500'
          }`} />
        </div>
        <p className="text-sm text-gray-500">{impactMetrics.contingencyPlan}</p>
      </motion.div>
    </div>
  );
} 