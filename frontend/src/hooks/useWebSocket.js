import { useEffect, useCallback, useState } from 'react';
import WebSocketService from '../services/websocket';

export function useWebSocket(facilityId) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    // Subscribe to connection status
    const unsubscribeConnection = WebSocketService.subscribe('connection', 
      ({ status }) => {
        setIsConnected(status === 'connected');
        if (status === 'connected') {
          setError(null);
        }
      }
    );

    // Subscribe to errors
    const unsubscribeError = WebSocketService.subscribe('error',
      ({ error }) => {
        setError(error);
      }
    );

    // Subscribe to messages
    const unsubscribeMessage = WebSocketService.subscribe('message',
      (message) => {
        setLastMessage(message);
      }
    );

    // Connect to WebSocket
    WebSocketService.connect(facilityId);

    // Cleanup subscriptions
    return () => {
      unsubscribeConnection();
      unsubscribeError();
      unsubscribeMessage();
      WebSocketService.disconnect();
    };
  }, [facilityId]);

  const sendMessage = useCallback((type, payload) => {
    WebSocketService.sendMessage(type, payload);
  }, []);

  return {
    isConnected,
    error,
    lastMessage,
    sendMessage
  };
} 