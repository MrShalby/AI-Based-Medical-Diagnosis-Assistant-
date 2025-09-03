import React, { useState, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { symptoms } from '../data/symptoms';

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSymptoms, setFilteredSymptoms] = useState(symptoms);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const filtered = symptoms.filter(
      (symptom) =>
        symptom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSymptoms.includes(symptom)
    );
    setFilteredSymptoms(filtered);
  }, [searchTerm, selectedSymptoms]);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      onSymptomsChange(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      onSymptomsChange([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom: string) => {
    onSymptomsChange(selectedSymptoms.filter((s) => s !== symptom));
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search symptoms (e.g., fever, headache, cough)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredSymptoms.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredSymptoms.slice(0, 10).map((symptom) => (
              <button
                key={symptom}
                onClick={() => {
                  toggleSymptom(symptom);
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
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Common Symptoms (click to select):
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {symptoms.slice(0, 12).map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span>{symptom}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Symptoms Tags */}
      {selectedSymptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected Symptoms:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom}
                className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span>{symptom}</span>
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-1 transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SymptomSelector;