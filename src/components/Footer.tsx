import React from 'react';
import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 dark:text-white">
              AI Medical Diagnosis Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              An intelligent capstone project combining machine learning with modern web development 
              to provide preliminary medical diagnosis assistance.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for healthcare innovation</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-white">Technology Stack</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>• React.js + TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Flask + Python</li>
              <li>• Machine Learning (Random Forest)</li>
              <li>• scikit-learn</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  <Github className="h-4 w-4" />
                  <span>Source Code</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  <span>Dataset Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
              <li>
                <button className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  <span>API Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © 2025 AI Medical Diagnosis Assistant. This is a capstone project for educational purposes.
            Always consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;