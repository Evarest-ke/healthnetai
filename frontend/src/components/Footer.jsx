import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-white mr-2" />
              <span className="text-xl font-bold">HealthNetAi</span>
            </div>
            <p className="text-blue-100">
              Making chronic disease management easier for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a></li>
              <li><a href="/about" className="text-blue-100 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-blue-100 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-blue-100 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/faq" className="text-blue-100 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/support" className="text-blue-100 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-blue-100 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/compliance" className="text-blue-100 hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} HealthNetAi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 