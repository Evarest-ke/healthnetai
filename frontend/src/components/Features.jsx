import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

const features = [
  {
    title: 'Patient Management',
    description: 'Track your health metrics, appointments, and medications in one place.',
    icon: 'UserCircle'
  },
  {
    title: 'Provider Dashboard',
    description: 'Efficiently manage patient records and monitor progress.',
    icon: 'LineChart'
  },
  {
    title: 'Secure Communication',
    description: 'Stay connected with your healthcare team through secure messaging.',
    icon: 'MessageCircle'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container px-4 mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-3xl font-bold text-center md:text-4xl"
        >
          Features Designed for Patients, Providers, and Admins
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 