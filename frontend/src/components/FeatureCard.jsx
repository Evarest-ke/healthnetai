import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, LineChart, MessageCircle } from 'lucide-react';

const icons = {
  UserCircle,
  LineChart,
  MessageCircle
};

const FeatureCard = ({ title, description, icon, index }) => {
  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default FeatureCard; 