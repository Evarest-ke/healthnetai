import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/ncd-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-blue-900/70 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Managing Chronic Conditions Made Simple
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            A comprehensive platform connecting patients with healthcare providers
            for better chronic disease management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="shadow-md hover:shadow-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/login')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 