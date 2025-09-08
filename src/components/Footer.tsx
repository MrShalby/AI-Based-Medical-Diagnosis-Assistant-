import React from 'react';
import { Heart, Shield, Award, Clock, Phone, Mail, } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                MediScan AI
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Advanced AI-powered medical diagnosis assistance system. 
              Providing intelligent symptom analysis for better healthcare decisions.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Developed with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for healthcare innovation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Symptoms Checker
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Health Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Important Notice</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  This AI system provides preliminary assessments only. Always consult with qualified healthcare professionals for medical diagnosis and treatment.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>24/7 Analysis Available</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@mediscan.ai</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 9265339663</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 MediScan AI. All rights reserved. 
              <span className="hidden md:inline"> | </span>
              <span className="block md:inline mt-1 md:mt-0">A healthcare innovation project.</span>
            </p>
            <div className="flex items-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>SSL Secured</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;