import React, { useState } from 'react';
import { Stethoscope, MessageCircle, Camera } from 'lucide-react';
import DiagnosisForm from './DiagnosisForm';
import ChatBot from './ChatBot';
import ImageAnalysis from './ImageAnalysis';

type TabType = 'symptoms' | 'chat' | 'image';

const MainTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('symptoms');

  const tabs = [
    {
      id: 'symptoms' as TabType,
      label: 'Symptom Checker',
      icon: Stethoscope,
      description: 'Analyze symptoms for disease prediction'
    },
    {
      id: 'chat' as TabType,
      label: 'AI Chatbot',
      icon: MessageCircle,
      description: 'Ask medical questions to our AI assistant'
    },
    {
      id: 'image' as TabType,
      label: 'Image Analysis',
      icon: Camera,
      description: 'Upload X-rays or medical images for analysis'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'symptoms':
        return <DiagnosisForm />;
      case 'chat':
        return <ChatBot />;
      case 'image':
        return <ImageAnalysis />;
      default:
        return <DiagnosisForm />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          AI Medical Diagnosis Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Comprehensive AI-powered healthcare analysis with symptom checking, medical chatbot, 
          and image analysis capabilities. For educational purposes only.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tab.label}</h3>
                    <p className={`text-sm ${
                      isActive 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {tab.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MainTabs;