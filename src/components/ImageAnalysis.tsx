import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Loader, AlertCircle, FileImage, Eye } from 'lucide-react';
import { analyzeImage } from '../services/api';
import { ImageAnalysisResult } from '../types';

const ImageAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setResults(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setResults(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const result = await analyzeImage(selectedFile);
      setResults(result);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Image analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const supportedFormats = ['JPEG', 'PNG', 'WEBP', 'BMP'];
  const sampleImages = [
    'Chest X-ray for pneumonia detection',
    'Brain MRI for tumor analysis',
    'Skin lesion for dermatological assessment',
    'Retinal scan for eye condition diagnosis'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Medical Image Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload medical images such as X-rays, MRIs, or CT scans for AI-powered analysis. 
          Our system can detect various conditions with high accuracy.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 transition-colors duration-300">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Camera className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Upload Medical Image</h3>
        </div>

        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Drop your medical image here, or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Supports: {supportedFormats.join(', ')} (Max 10MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Selected medical image"
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <FileImage className="inline h-4 w-4 mr-1" />
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          </div>
        )}

        {/* Sample Images Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Supported Medical Images:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {sampleImages.map((image, index) => (
              <li key={index} className="flex items-center">
                <Eye className="h-3 w-3 mr-2" />
                {image}
              </li>
            ))}
          </ul>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || loading}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Analyzing Image...</span>
            </>
          ) : (
            <>
              <Camera className="h-5 w-5" />
              <span>Analyze Image</span>
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="h-6 w-6 text-green-500" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Analysis Results
            </h3>
          </div>

          <div className="space-y-4">
            {results.predictions.map((prediction, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {prediction.condition}
                    </h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prediction.confidence >= 80
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : prediction.confidence >= 60
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {prediction.confidence}% confidence
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {prediction.description}
                </p>

                {/* Confidence Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
              </div>
            ))}
          </div>

          {/* Recommendations */}
          {results.recommendations && results.recommendations.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Recommendations:
              </h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Image Analysis Disclaimer
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
              This AI image analysis is for educational and research purposes only. Results should 
              not be used for actual medical diagnosis or treatment decisions. Always consult with 
              qualified radiologists and healthcare professionals for proper medical image interpretation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;