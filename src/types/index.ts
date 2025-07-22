export interface DiagnosisPrediction {
  disease: string;
  confidence: number;
  description: string;
  matchingSymptoms?: string[];
}

export interface HealthRecommendation {
  type: string;
  advice: string;
}

export interface DiagnosisResult {
  predictions: DiagnosisPrediction[];
  recommendations: HealthRecommendation[];
}

export interface ChatResponse {
  answer: string;
  confidence?: number;
  sources?: string[];
}

export interface ImagePrediction {
  condition: string;
  confidence: number;
  description: string;
}

export interface ImageAnalysisResult {
  predictions: ImagePrediction[];
  recommendations?: string[];
  processingTime?: number;
}

export interface Symptom {
  id: string;
  name: string;
  category: string;
}