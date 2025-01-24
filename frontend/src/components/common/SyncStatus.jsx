import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

const SyncStatus = ({ status, lastSync }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
      <div className="flex items-center space-x-2">
        {status === 'online' ? (
          <Cloud className="text-green-500" />
        ) : status === 'syncing' ? (
          <RefreshCw className="text-blue-500 animate-spin" />
        ) : (
          <CloudOff className="text-red-500" />
        )}
        <span className="text-sm">
          {status === 'online' ? 'Connected' : 
           status === 'syncing' ? 'Syncing...' : 
           'Offline'}
        </span>
        {lastSync && (
          <span className="text-xs text-gray-500">
            Last sync: {new Date(lastSync).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;
