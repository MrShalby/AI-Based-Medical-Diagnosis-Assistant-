import React, { useEffect } from 'react';
import { Heart, AlertTriangle, Info, ExternalLink, Download } from 'lucide-react';
import { DiagnosisResult } from '../types';
import { saveDiagnosisReport } from '../services/reports';
import { useAuth } from '../context/AuthContext';

interface DiagnosisResultsProps {
  results: DiagnosisResult;
  symptoms: string[];
}

const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({ results, symptoms }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Save the diagnosis report when the component mounts
    const saveReport = async () => {
      try {
        await saveDiagnosisReport(results, symptoms);
      } catch (error) {
        console.error('Failed to save diagnosis report:', error);
      }
    };
    saveReport();
  }, [results, symptoms]);

  const handleDownloadReport = () => {
    // Create the report content
    const reportContent = `
Medical Diagnosis Report
Date: ${new Date().toLocaleDateString()}
Patient: ${user?.name}

Symptoms:
${symptoms.join('\n')}

Primary Diagnosis:
${results.predictions[0].disease}
Confidence: ${(results.predictions[0].confidence).toFixed(2)}%
Description: ${results.predictions[0].description}

Additional Predictions:
${results.predictions.slice(1).map(pred => 
  `- ${pred.disease} (${pred.confidence.toFixed(2)}% confidence)\n  ${pred.description}`
).join('\n\n')}

Health Recommendations:
${results.recommendations.map(rec => 
  `${rec.type}:\n${rec.advice}`
).join('\n\n')}

Disclaimer:
This AI diagnosis is for informational purposes only. Always consult with a qualified healthcare professional for proper medical advice, diagnosis, and treatment.
    `;

    // Create blob and download
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-diagnosis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 dark:bg-green-900';
    if (confidence >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Medical Disclaimer
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              This AI diagnosis is for informational purposes only. Always consult with a qualified 
              healthcare professional for proper medical advice, diagnosis, and treatment.
            </p>
          </div>
        </div>
      </div>

      {/* Diagnosis Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Diagnosis Results
            </h3>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
        </div>

        <div className="space-y-4">
          {results.predictions.map((prediction, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {prediction.disease}
                  </h4>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceBg(prediction.confidence)}`}>
                  <span className={getConfidenceColor(prediction.confidence)}>
                    {prediction.confidence}% confidence
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {prediction.description}
              </p>

              {/* Confidence Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    prediction.confidence >= 80
                      ? 'bg-green-500'
                      : prediction.confidence >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>

              {/* Symptoms Match */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Matching symptoms: {prediction.matchingSymptoms?.join(', ') || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="flex items-center space-x-2 mb-6">
          <Info className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Health Recommendations
          </h3>
        </div>

        <div className="space-y-4">
          {results.recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {recommendation.type}
                </h5>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {recommendation.advice}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h5 className="font-semibold text-red-800 dark:text-red-200">
                When to Seek Immediate Medical Attention
              </h5>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                If you experience severe symptoms, persistent high fever, difficulty breathing, 
                chest pain, or any life-threatening symptoms, seek emergency medical care immediately.
              </p>
              <button className="mt-2 flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-sm font-medium">
                <span>Find nearby hospitals</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResults;