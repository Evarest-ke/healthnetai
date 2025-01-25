import React from 'react';
import { motion } from 'framer-motion';
import {
  Network, Stethoscope, Users, Database, 
  Signal, Shield, LineChart, MessageSquare,
  Clock, Zap, Globe, Smartphone
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/ui/Button';

const platformFeatures = [
  {
    icon: Network,
    title: 'Intelligent Network Management',
    description: 'Advanced bandwidth optimization and offline-first architecture ensuring 99.9% uptime in low-connectivity areas.',
    metrics: ['60% reduction in network downtime', '75% improvement in data accuracy'],
    technical: 'Edge computing, predictive maintenance, dynamic load balancing'
  },
  {
    icon: Stethoscope,
    title: 'Clinical Decision Support',
    description: 'AI-powered diagnostics and treatment recommendations supporting healthcare providers in remote settings.',
    metrics: ['40% increase in early interventions', '30% reduction in NCD complications'],
    technical: 'Machine learning algorithms, real-time analytics, evidence-based protocols'
  },
  {
    icon: Database,
    title: 'Offline-First Data Management',
    description: 'Seamless data synchronization and secure storage ensuring continuous access to critical patient information.',
    metrics: ['100% data availability offline', '99.99% sync success rate'],
    technical: 'Local-first architecture, conflict resolution, encrypted storage'
  },
  {
    icon: Users,
    title: 'Multi-Stakeholder Platform',
    description: 'Unified interface for patients, providers, and administrators with role-specific dashboards and controls.',
    metrics: ['50% improvement in follow-up rates', '45% increase in patient engagement'],
    technical: 'Role-based access control, customizable workflows, audit trails'
  }
];

const FeaturesPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Enterprise-Grade Healthcare Technology for Everyone
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Powering the future of healthcare delivery with AI-driven insights
                and offline-first architecture.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-bold">99.9%</h3>
                  <p className="text-blue-100">Platform Uptime</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-bold">75%</h3>
                  <p className="text-blue-100">Data Accuracy Improvement</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-2xl font-bold">40%</h3>
                  <p className="text-blue-100">Early Intervention Rate</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Enterprise Features for Rural Healthcare
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform combines cutting-edge technology with practical healthcare
                solutions, making advanced medical care accessible in any setting.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all p-8 border border-gray-100"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="space-y-2">
                          {feature.metrics.map((metric, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {metric}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Technical Stack:</span> {feature.technical}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dashboard Showcase */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              Specialized Dashboards for Every Role
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Network Dashboard</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Signal className="w-5 h-5 text-green-500 mr-2" />
                      <span>Real-time connectivity monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <Shield className="w-5 h-5 text-blue-500 mr-2" />
                      <span>Automated security protocols</span>
                    </li>
                    <li className="flex items-center">
                      <LineChart className="w-5 h-5 text-purple-500 mr-2" />
                      <span>Performance analytics</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Doctor Dashboard</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Users className="w-5 h-5 text-blue-500 mr-2" />
                      <span>Patient management</span>
                    </li>
                    <li className="flex items-center">
                      <MessageSquare className="w-5 h-5 text-green-500 mr-2" />
                      <span>Secure messaging</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="w-5 h-5 text-orange-500 mr-2" />
                      <span>Appointment scheduling</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Patient Dashboard</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Smartphone className="w-5 h-5 text-purple-500 mr-2" />
                      <span>Mobile-first interface</span>
                    </li>
                    <li className="flex items-center">
                      <Globe className="w-5 h-5 text-blue-500 mr-2" />
                      <span>Offline access</span>
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                      <span>Quick health tracking</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-white text-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">
              Ready to Transform Healthcare Delivery?
            </h2>
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-900"
              onClick={() => {}}
            >
              Schedule a Demo
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage; 