class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.isConnecting = false;
    this.subscribers = new Set();
    this.mockMode = import.meta.env.PROD; // Enable mock mode in production
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Connect if not already connected
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.connect();
    }
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  handleMessage(data) {
    // Notify all subscribers
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  getWebSocketUrl() {
    if (this.mockMode) {
      return null; // Don't create actual WebSocket in production
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = 'localhost:8080'; // Always use localhost for development
    return `${protocol}//${host}/api/network/kisumu/ws`;
  }

  connect() {
    if (this.mockMode) {
      this.startMockConnection();
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const wsUrl = this.getWebSocketUrl();
      if (!wsUrl) return;

      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.handleMessage({ type: 'connection', status: 'error', error });
    }
  }

  startMockConnection() {
    // Simulate successful connection
    setTimeout(() => {
      this.handleMessage({ type: 'connection', status: 'connected' });
      this.startMockDataStream();
    }, 1000);
  }

  startMockDataStream() {
    // Generate mock data periodically
    setInterval(() => {
      const mockData = {
        type: 'metrics',
        bandwidth: Math.random() * 100,
        latency: Math.random() * 50,
        activeUsers: Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString()
      };
      this.handleMessage(mockData);
    }, 2000);
  }

  setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.handleMessage({ type: 'connection', status: 'connected' });
    };

    this.ws.onclose = (event) => {
      this.handleWebSocketClose(event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleMessage({ type: 'connection', status: 'error', error });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  handleWebSocketClose(event) {
    this.isConnecting = false;
    console.log('WebSocket closed:', event);
    
    // Notify subscribers of disconnection
    this.handleMessage({ type: 'connection', status: 'disconnected' });
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
      console.log(`Reconnecting in ${delay}ms...`);
      
      this.reconnectTimeout = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  sendMessage(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected. Message not sent:', { type, payload });
    }
  }
}

// Create a single instance
const wsService = new WebSocketService();

// Named export
export { wsService };

// Default export if needed
export default wsService; 