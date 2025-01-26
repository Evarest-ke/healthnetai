class MetricsWebSocket {
  constructor() {
    this.subscribers = new Set();
    this.isConnected = false;
    this.baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(`${this.baseUrl}/api/network/kisumu/ws`);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.isConnected = true;
        this.notifySubscribers({ type: 'connection', status: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifySubscribers(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.notifySubscribers({ type: 'connection', status: 'error' });
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
        this.notifySubscribers({ type: 'connection', status: 'disconnected' });
        setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error('Subscribe requires a function callback');
      return () => {};
    }
    this.subscribers.add(callback);
    callback({ type: 'connection', status: this.isConnected ? 'connected' : 'disconnected' });
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => {
      try {
        if (typeof callback === 'function') {
          callback(data);
        }
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.isConnected = false;
    }
  }
}

// Create a singleton instance
const webSocketService = new MetricsWebSocket();
export default webSocketService; 