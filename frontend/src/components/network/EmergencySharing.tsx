import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface Props {
  clinics: any[];
  onShareRequest: (sourceId: string, targetId: string) => Promise<void>;
}

export const EmergencySharing: React.FC<Props> = ({ clinics, onShareRequest }) => {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (!sourceId || !targetId) return;
    
    setIsLoading(true);
    try {
      await onShareRequest(sourceId, targetId);
    } catch (error) {
      console.error('Failed to share bandwidth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Emergency Bandwidth Sharing</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Source Clinic</label>
          <Select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            options={clinics.map((clinic) => ({
              value: clinic.id,
              label: clinic.name,
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Clinic</label>
          <Select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            options={clinics.map((clinic) => ({
              value: clinic.id,
              label: clinic.name,
            }))}
          />
        </div>
        <Button
          onClick={handleShare}
          isLoading={isLoading}
          disabled={!sourceId || !targetId || sourceId === targetId}
          className="w-full"
        >
          Initiate Emergency Sharing
        </Button>
      </div>
    </div>
  );
}; 