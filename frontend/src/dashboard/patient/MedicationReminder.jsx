import React from 'react';
import { Pill, Clock } from 'lucide-react';

export default function MedicationReminder({ medications }) {
  return (
    <div className="space-y-4">
      {medications.map((medication, index) => (
        <div key={index} className="p-4 bg-white rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{medication.name}</h3>
                <p className="text-sm text-gray-500">{medication.dosage}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{medication.frequency}</span>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Next dose: {medication.timeToTake}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 