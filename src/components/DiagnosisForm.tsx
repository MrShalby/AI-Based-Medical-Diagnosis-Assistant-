import React, { useState } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import SymptomSelector from './SymptomSelector';
import DiagnosisResults from './DiagnosisResults';
import { getPrediction } from '../services/api';
import { DiagnosisResult } from '../types';

const severityOptions = ['Mild', 'Moderate', 'Severe'];
const durationOptions = ['1 day', '3 days', '1 week', '2 weeks', '1 month', 'More than 1 month'];

type SymptomDetails = {
  severity: string;
  duration: string;
};

const DiagnosisForm: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomDetails, setSymptomDetails] = useState<Record<string, SymptomDetails>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');


  // Suggestion logic based on symptom, severity, and duration
  const getSuggestion = (symptom: string, severity: string, duration: string) => {
    // Example rules, you can expand as needed
    if (severity === 'Severe' || duration === 'More than 1 month') {
      return 'We recommend you see a doctor as soon as possible.';
    }
    if (severity === 'Moderate' && (duration === '1 week' || duration === '2 weeks' || duration === 'More than 1 month')) {
      return 'Consider consulting a healthcare professional.';
    }
    if (severity === 'Mild' && (duration === '1 day' || duration === '3 days')) {
      return 'Monitor your symptoms and rest. If symptoms persist, seek medical advice.';
    }
    return 'Monitor your symptoms. If they worsen, consult a doctor.';
  };

  const handleDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    // Check if all details are filled
    for (const symptom of selectedSymptoms) {
      const details = symptomDetails[symptom];
      if (!details || !details.severity || !details.duration) {
        setError('Please select severity and duration for all symptoms.');
        return;
      }
    }

    setLoading(true);
    setError('');
    setResults(null);
    setSuggestion('');

    try {
      // You can modify the API to accept details if needed
      const response = await getPrediction(selectedSymptoms);
      setResults(response);
      setSuggestion(getSuggestion(selectedSymptoms[0], symptomDetails[selectedSymptoms[0]]?.severity || 'Mild', symptomDetails[selectedSymptoms[0]]?.duration || '1 day'));
      // Generate suggestion based on the most severe/duration symptom
      let finalSuggestion = '';
      for (const symptom of selectedSymptoms) {
        const { severity, duration } = symptomDetails[symptom];
        const s = getSuggestion(symptom, severity, duration);
        if (s.includes('see a doctor')) {
          finalSuggestion = s;
          break;
        } else if (s.includes('consulting a healthcare')) {
          finalSuggestion = s;
        } else if (!finalSuggestion) {
          finalSuggestion = s;
        }
      }
      setSuggestion(finalSuggestion);
    } catch (err) {
      setError('Failed to get diagnosis. Please try again.');
      console.error('Diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setSymptomDetails({});
    setResults(null);
    setError('');
    setSuggestion('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Symptom Analysis & Diagnosis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select your symptoms below and our AI will analyze them to provide the most probable diagnoses 
          along with health recommendations. This tool is for informational purposes only and should not 
          replace professional medical advice.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 transition-colors duration-300">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Search className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Select Your Symptoms</h3>
        </div>

        <SymptomSelector
          selectedSymptoms={selectedSymptoms}
          onSymptomsChange={setSelectedSymptoms}
        />

        {/* Selected Symptoms Display with Severity and Duration */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Symptoms ({selectedSymptoms.length}):
            </p>
            <div className="flex flex-col gap-4">
              {selectedSymptoms.map((symptom) => (
                <div key={symptom} className="flex flex-wrap items-center gap-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {symptom}
                  </span>
                  <select
                    className="ml-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                    value={symptomDetails[symptom]?.severity || ''}
                    onChange={e => setSymptomDetails(prev => ({
                      ...prev,
                      [symptom]: {
                        ...prev[symptom],
                        severity: e.target.value
                      }
                    }))}
                  >
                    <option value="">Severity</option>
                    {severityOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <select
                    className="ml-2 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm"
                    value={symptomDetails[symptom]?.duration || ''}
                    onChange={e => setSymptomDetails(prev => ({
                      ...prev,
                      [symptom]: {
                        ...prev[symptom],
                        duration: e.target.value
                      }
                    }))}
                  >
                    <option value="">Duration</option>
                    {durationOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleDiagnosis}
            disabled={loading || selectedSymptoms.length === 0}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Get Diagnosis</span>
              </>
            )}
          </button>

          {(selectedSymptoms.length > 0 || results) && (
            <button
              onClick={resetForm}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Suggestion Section */}
      {suggestion && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mt-4">
          <p className="text-green-800 dark:text-green-200 font-semibold">Suggestion: {suggestion}</p>
        </div>
      )}

      {/* Results Section */}
      {results && <DiagnosisResults results={results} symptoms={selectedSymptoms} />}
    </div>
  );
};

export default DiagnosisForm;