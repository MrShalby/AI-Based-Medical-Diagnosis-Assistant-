import React, { useState } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import SymptomSelector from './SymptomSelector';
import DiagnosisResults from './DiagnosisResults';
import { getPrediction } from '../services/api';
import { DiagnosisResult } from '../types';

const DiagnosisForm: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const prediction = await getPrediction(selectedSymptoms);
      setResults(prediction);
    } catch (err) {
      setError('Failed to get diagnosis. Please try again.');
      console.error('Diagnosis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setResults(null);
    setError('');
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

        {/* Selected Symptoms Display */}
        {selectedSymptoms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selected Symptoms ({selectedSymptoms.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {symptom}
                </span>
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

      {/* Results Section */}
      {results && <DiagnosisResults results={results} />}
    </div>
  );
};

export default DiagnosisForm;