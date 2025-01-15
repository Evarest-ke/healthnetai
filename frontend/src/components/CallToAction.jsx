import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-blue-600 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who are already
            using our platform to manage chronic conditions effectively.
          </p>
          <Button
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            onClick={() => navigate('/signup')}
          >
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction; 