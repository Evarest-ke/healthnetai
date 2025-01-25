import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Target, Zap, Award, Users, BarChart, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const stats = [
  { value: '30%', label: 'Reduction in NCD complications' },
  { value: '50%', label: 'Improvement in follow-up rates' },
  { value: '40%', label: 'Increase in early interventions' },
  { value: '75%', label: 'Improvement in data accuracy' }
];

const features = [
  {
    icon: Shield,
    title: 'Network Optimization',
    description: 'Dynamic bandwidth allocation, predictive maintenance, and load balancing to minimize downtime.'
  },
  {
    icon: Users,
    title: 'Clinical Support',
    description: 'Dedicated dashboard for doctors to schedule appointments, analyze patient data, and send SMS reminders.'
  },
  {
    icon: BarChart,
    title: 'Resource Management',
    description: 'Automated inventory tracking, specialist scheduling, and bandwidth optimization for improved efficiency.'
  },
  {
    icon: Globe,
    title: 'Patient Engagement',
    description: 'Multilingual SMS reminders, mobile app integration, and community health worker portal.'
  }
];

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Bridging Gaps, Transforming Lives
              </h1>
              <p className="text-xl text-blue-100">
                At HealthNET AI, we believe that access to quality healthcare should never be limited by connectivity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed">
                HealthNET AI is a groundbreaking platform designed to revolutionize healthcare delivery in areas with limited or unreliable internet connectivity. By combining advanced AI technology with an offline-first approach, we empower healthcare providers to deliver consistent, proactive, and high-quality care—even in the most challenging environments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md text-center"
                >
                  <p className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">The Problem We Solve</h2>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  In Kenya, rural healthcare facilities struggle with Non-Communicable Diseases (NCDs), which account for 33% of total deaths. With only 56% of rural facilities having reliable internet:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>45% of NCD patients miss follow-up appointments</li>
                  <li>40% of patient data is lost or delayed</li>
                  <li>Limited access to specialist care and resources</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Solution</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
              <p className="text-gray-600 mb-8">
                Our platform delivers significant economic benefits, including $500,000 in annual savings per county and the creation of 200+ technical jobs.
              </p>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage; 