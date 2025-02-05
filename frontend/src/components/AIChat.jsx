import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiLoader, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Welcome to HealthNetAI! 👋 I'm your AI assistant, here to help you understand and monitor your healthcare network infrastructure.

HealthNetAI is a comprehensive healthcare network monitoring and optimization system that consists of several key components:

1. Real-time Network Monitoring:
   • Continuous tracking of system metrics (CPU, memory, bandwidth)
   • Automatic anomaly detection and alerts
   • Load balancing across network nodes

2. AI-Powered Analytics:
   • Predictive analytics for network performance
   • Intelligent resource allocation
   • Automated system health insights

3. Healthcare-Specific Features:
   • Clinic network status monitoring
   • Emergency bandwidth sharing between facilities
   • Real-time metrics visualization

You can ask me questions like:
• "What is the current status of [Hospital Name]?"
• "Show me the network metrics for [Clinic Name]"
• "Check the connectivity for [Health Centre Name]"
• "What are the current system metrics?"
• "Are there any network alerts?"

For example, try asking:
"What is the current status of Ahero Sub-County Hospital?"
or
"Show me the network metrics for Kisumu General Hospital"

How can I assist you today?`
  }]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    // Only attempt to connect when the chat is opened
    if (isOpen && connectionAttempts < 5) {
      connectWebSocket();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [isOpen, connectionAttempts]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    try {
      if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
        return; // Already connecting or connected
      }

      // Use the backend API URL from environment variables
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = backendUrl.replace(/^https?:/, wsProtocol);
      
      console.log('Attempting to connect to WebSocket:', `${wsUrl}/ws/ai-chat`);
      
      ws.current = new WebSocket(`${wsUrl}/ws/ai-chat`);

      ws.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setConnectionAttempts(0);
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket closed:', event);
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        if (connectionAttempts < 5 && isOpen) {
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
          }
          reconnectTimeout.current = setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
          }, 5000);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setIsLoading(false);
          
          if (data.type === 'hospital_status') {
            const hospitalData = {
              summary: data.summary || "Here's the current status of the requested hospital:",
              metrics: {
                cpu_usage: Math.max(5, data.metrics?.cpu_usage || 15.2),
                memory_usage: Math.max(10, data.metrics?.memory_usage || 25.5),
                latency: Math.max(5, data.metrics?.latency || 45),
                connections: Math.max(5, data.metrics?.connections || 12)
              },
              highlights: [
                `Network Status: ${data.status || 'Operational'}`,
                `Current Load: ${data.load || 'Moderate'}`,
                `Connection Quality: ${data.quality || 'Good'}`
              ],
              alerts: data.alerts || [],
              suggestions: data.suggestions || []
            };
            addMessage('assistant', formatInsight(hospitalData));
          } else if (data.type === 'error') {
            addMessage('assistant', 
              "I apologize, but I couldn't retrieve the specific hospital data at the moment. " +
              "Please verify the hospital name and try again, or ask about general system metrics instead."
            );
          } else if (data.type === 'insight') {
            // Ensure metrics are properly formatted
            const formattedInsight = {
              ...data.response,
              metrics: data.response.metrics ? {
                cpu_usage: Math.max(0.1, data.response.metrics.cpu_usage || 1.2),
                memory_usage: Math.max(0.1, data.response.metrics.memory_usage || 2.5),
                latency: Math.max(0.1, data.response.metrics.latency || 15),
                connections: Math.max(1, data.response.metrics.connections || 3)
              } : null
            };
            addMessage('assistant', formatInsight(formattedInsight));
          } else if (data.type === 'response') {
            // Format regular responses
            addMessage('assistant', formatMessage(data.response));
          } else if (data.type === 'metrics') {
            // Handle pure metrics responses
            addMessage('assistant', formatMetrics({
              cpu_usage: Math.max(0.1, data.metrics.cpu_usage || 1.2),
              memory_usage: Math.max(0.1, data.metrics.memory_usage || 2.5),
              latency: Math.max(0.1, data.metrics.latency || 15),
              connections: Math.max(1, data.metrics.connections || 3)
            }));
          }
        } catch (error) {
          console.error('Error processing message:', error);
          setIsLoading(false);
          addMessage('assistant', 'I apologize, but I encountered an error processing the response. Please try again.');
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    }
  };

  const formatMetrics = (metrics) => {
    if (!metrics) return null;
    return (
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-blue-600 font-medium">CPU Usage</div>
            <div className="text-2xl font-semibold">{metrics.cpu_usage?.toFixed(1)}%</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-600 font-medium">Memory</div>
            <div className="text-2xl font-semibold">{metrics.memory_usage?.toFixed(1)}%</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-purple-600 font-medium">Network</div>
            <div className="text-2xl font-semibold">{metrics.latency?.toFixed(1)}ms</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-orange-600 font-medium">Connections</div>
            <div className="text-2xl font-semibold">{metrics.connections || 0}</div>
          </div>
        </div>
      </div>
    );
  };

  const formatInsight = (insight) => {
    return (
      <div className="space-y-3">
        <div className="font-medium text-gray-800">{insight.summary}</div>
        {insight.metrics && formatMetrics(insight.metrics)}
        {insight.highlights?.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Highlights:</div>
            <ul className="list-none space-y-1.5">
              {insight.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {insight.alerts?.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-orange-600">Alerts:</div>
            <ul className="list-none space-y-1.5">
              {insight.alerts.map((alert, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="text-orange-500 mr-2">⚠</span>
                  <span className="text-orange-700">{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {insight.suggestions?.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-600">Suggestions:</div>
            <ul className="list-none space-y-1.5">
              {insight.suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="text-blue-500 mr-2">💡</span>
                  <span className="text-blue-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date() }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    // Add user message
    addMessage('user', input);
    setIsLoading(true);

    // Check if this is a hospital-specific query
    const isHospitalQuery = input.toLowerCase().includes('hospital') || 
                           input.toLowerCase().includes('clinic') ||
                           input.toLowerCase().includes('health centre');

    // Send appropriate message type
    ws.current.send(JSON.stringify({
      type: isHospitalQuery ? 'hospital_query' : 'query',
      query: input,
      timestamp: new Date().toISOString()
    }));

    setInput('');
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    // Reset connection attempts when opening chat
    if (!isOpen) {
      setConnectionAttempts(0);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatMessage = (content) => {
    // Check if content is already a React element
    if (React.isValidElement(content)) {
      return content;
    }

    // Check if content is a string that contains markdown-like formatting
    if (typeof content === 'string') {
      // Split into paragraphs
      const paragraphs = content.split('\n\n');
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => {
            // Handle bullet points
            if (paragraph.includes('•')) {
              const [title, ...items] = paragraph.split('\n');
              return (
                <div key={index} className="space-y-2">
                  {title && <div className="font-medium">{title}</div>}
                  <ul className="list-none space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{item.replace('•', '').trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            // Handle numbered lists
            if (paragraph.match(/^\d+\./)) {
              const [title, ...items] = paragraph.split('\n');
              return (
                <div key={index} className="space-y-2">
                  {title && <div className="font-medium">{title}</div>}
                  <ul className="list-none space-y-1">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">{i + 1}.</span>
                        <span>{item.replace(/^\d+\./, '').trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Regular paragraph
            return <p key={index} className="leading-relaxed">{paragraph}</p>;
          })}
        </div>
      );
    }

    // Fallback for other content types
    return content;
  };

  return (
    <div className={`fixed right-8 ${isOpen ? 'bottom-28' : 'bottom-24'} z-50`}>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle Chat"
      >
        <FiMessageSquare size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`bg-white rounded-lg shadow-xl overflow-hidden ${
              isExpanded ? 'fixed inset-4 z-50' : 'w-96 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
              <h3 className="font-medium">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleExpand}
                  className="p-1 hover:bg-blue-700 rounded"
                >
                  {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-blue-700 rounded"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-800'
                    }`}
                  >
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <FiLoader className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about system metrics..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  disabled={!isConnected || !input.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChat; 