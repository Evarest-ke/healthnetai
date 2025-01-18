import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Wifi, Database, Cloud, AlertTriangle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function NetworkTopology({ nodes, connections }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mock data for demonstration
  const networkNodes = [
    { 
      id: 1, 
      type: 'server', 
      label: 'Main Server', 
      status: 'active', 
      x: 400, 
      y: 200,
      metrics: {
        cpu: '45%',
        memory: '60%',
        connections: 128
      }
    },
    { 
      id: 2, 
      type: 'facility', 
      label: 'Facility A', 
      status: 'active', 
      x: 200, 
      y: 300,
      metrics: {
        bandwidth: '75 Mbps',
        latency: '25ms',
        packetLoss: '0.1%'
      }
    },
    { id: 3, type: 'facility', label: 'Facility B', status: 'warning', x: 600, y: 300 },
    { id: 4, type: 'database', label: 'Central DB', status: 'active', x: 400, y: 400 },
    { id: 5, type: 'cloud', label: 'Cloud Storage', status: 'active', x: 400, y: 100 }
  ];

  const getNodeIcon = (type, status) => {
    const baseClass = `h-6 w-6 ${
      status === 'active' ? 'text-green-500' :
      status === 'warning' ? 'text-yellow-500' : 'text-red-500'
    }`;

    switch (type) {
      case 'server':
        return <Server className={baseClass} />;
      case 'facility':
        return <Wifi className={baseClass} />;
      case 'database':
        return <Database className={baseClass} />;
      case 'cloud':
        return <Cloud className={baseClass} />;
      default:
        return <AlertTriangle className={baseClass} />;
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply transformations
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(zoom, zoom);

    // Draw connections with different styles based on status
    networkNodes.forEach(node => {
      networkNodes.forEach(targetNode => {
        if (node.id !== targetNode.id) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          
          // Create curved lines
          const midX = (node.x + targetNode.x) / 2;
          const midY = (node.y + targetNode.y) / 2 - 50;
          
          ctx.quadraticCurveTo(midX, midY, targetNode.x, targetNode.y);
          
          // Style based on node status
          ctx.strokeStyle = node.status === 'active' && targetNode.status === 'active' 
            ? '#10B981' 
            : '#E5E7EB';
          
          ctx.lineWidth = selectedNode?.id === node.id || selectedNode?.id === targetNode.id 
            ? 3 
            : 1;
            
          ctx.stroke();
          
          // Draw data flow animation
          if (node.status === 'active' && targetNode.status === 'active') {
            const gradient = ctx.createLinearGradient(node.x, node.y, targetNode.x, targetNode.y);
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.strokeStyle = gradient;
            ctx.stroke();
          }
        }
      });
    });
    
    ctx.restore();
  }, [networkNodes, zoom, position, selectedNode]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Network Topology</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Active
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              Warning
            </span>
            <span className="flex items-center text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              Offline
            </span>
          </div>
          
          <div className="flex items-center space-x-2 border-l pl-4">
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 hover:bg-gray-100 rounded"
              title="Reset View"
            >
              <RotateCcw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div 
        className="relative" 
        style={{ height: '400px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-move"
        />
        
        {networkNodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: (node.x * zoom) + position.x,
              y: (node.y * zoom) + position.y
            }}
            transition={{ duration: 0.3 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => handleNodeClick(node)}
          >
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-full cursor-pointer transition-all duration-200 ${
                selectedNode?.id === node.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              } ${
                node.status === 'active' ? 'bg-green-100' :
                node.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {getNodeIcon(node.type, node.status)}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {node.label}
              </span>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
            >
              <h3 className="font-semibold mb-2">{selectedNode.label}</h3>
              <div className="space-y-1">
                {Object.entries(selectedNode.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 