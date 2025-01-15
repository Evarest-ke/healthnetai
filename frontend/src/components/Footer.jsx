import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-xl font-bold">HealthNetAi</span>
            </div>
            <p className="text-gray-600">
              Making chronic disease management easier for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600">About Us</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="text-gray-600 hover:text-blue-600">Blog</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</a></li>
              <li><a href="/support" className="text-gray-600 hover:text-blue-600">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} HealthNetAi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 