import React, { useState, useEffect } from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { symptoms } from '../data/symptoms';

interface SymptomData {
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | '';
  duration: '1-day' | '1-week' | '1-month' | '3-months' | '6-months' | '1-year' | 'more-than-year' | '';
}

interface SymptomSelectorProps {
  selectedSymptoms: SymptomData[];
  onSymptomsChange: (symptoms: SymptomData[]) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState(symptoms);
  const [showDropdown, setShowDropdown] = useState(false);

  const severityOptions = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' }
  ];

  const durationOptions = [
    { value: '1-day', label: '1 Day' },
    { value: '1-week', label: '1 Week' },
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: 'more-than-year', label: 'More than 1 Year' }
  ];

  useEffect(() => {
    const filtered = symptoms.filter(
      (symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSymptoms.some(s => s.name === symptom)
    );
    setFilteredSymptoms(filtered);
  }, [searchTerm, selectedSymptoms]);

  const addSymptom = (symptomName: string) => {
    const newSymptom: SymptomData = {
      name: symptomName,
      severity: '',
      duration: ''
    };
    onSymptomsChange([...selectedSymptoms, newSymptom]);
  };

  const removeSymptom = (symptomName: string) => {
    onSymptomsChange(selectedSymptoms.filter((s) => s.name !== symptomName));
  };

  const updateSymptomProperty = (
    symptomName: string, 
    property: 'severity' | 'duration', 
    value: string
  ) => {
    const updatedSymptoms = selectedSymptoms.map(symptom => 
      symptom.name === symptomName 
        ? { ...symptom, [property]: value }
        : symptom
    );
    onSymptomsChange(updatedSymptoms);
  };

  const isSymptomSelected = (symptomName: string) => {
    return selectedSymptoms.some(s => s.name === symptomName);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
        />

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredSymptoms.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredSymptoms.slice(0, 10).map((symptom) => (
              <button
                key={symptom}
                onClick={() => {
                  addSymptom(symptom);
                  setSearchTerm('');
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 dark:text-white border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                {symptom}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Common Symptoms Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Common Symptoms (click to select):
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {symptoms.slice(0, 12).map((symptom) => {
            const isSelected = isSymptomSelected(symptom);
            return (
              <button
                key={symptom}
                onClick={() => isSelected ? removeSymptom(symptom) : addSymptom(symptom)}
                className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span>{symptom}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Symptoms with Severity and Duration */}
      {selectedSymptoms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Selected Symptoms Details:
          </h3>
          <div className="space-y-4">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom.name}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
              >
                {/* Symptom Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {symptom.name}
                  </h4>
                  <button
                    onClick={() => removeSymptom(symptom.name)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Severity and Duration Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Severity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Severity
                    </label>
                    <div className="relative">
                      <select
                        value={symptom.severity}
                        onChange={(e) => updateSymptomProperty(symptom.name, 'severity', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 appearance-none ${getSeverityColor(symptom.severity)}`}
                      >
                        <option value="">Select severity...</option>
                        {severityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Duration Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration
                    </label>
                    <div className="relative">
                      <select
                        value={symptom.duration}
                        onChange={(e) => updateSymptomProperty(symptom.name, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200 appearance-none"
                      >
                        <option value="">Select duration...</option>
                        {durationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Visual Indicators */}
                <div className="flex items-center space-x-4 text-sm">
                  {symptom.severity && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                      {severityOptions.find(opt => opt.value === symptom.severity)?.label}
                    </span>
                  )}
                  {symptom.duration && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                      {durationOptions.find(opt => opt.value === symptom.duration)?.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              Symptoms Summary
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
              {selectedSymptoms.filter(s => s.severity && s.duration).length > 0 && (
                <span>
                  , {selectedSymptoms.filter(s => s.severity && s.duration).length} fully detailed
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SymptomSelector;