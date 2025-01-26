import { useState, useEffect, useCallback } from 'react';
import webSocketService from '../services/websocket';

export function useWebSocket() {
  const [metrics, setMetrics] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.type === 'connection') {
        setIsConnected(data.status === 'connected');
      } else {
        setMetrics(data);
      }
    };

    const unsubscribe = webSocketService.subscribe(handleMessage);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { metrics, isConnected };
} 