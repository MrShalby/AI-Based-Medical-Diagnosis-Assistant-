import { DiagnosisResult } from '../types';
import { ChatResponse, ImageAnalysisResult } from '../types';

// Mock API service - In production, this would connect to your Flask backend
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000';

// Mock data for demonstration
const mockDiseases = [
  {
    name: 'Common Cold',
    symptoms: ['runny nose', 'sneezing', 'cough', 'sore throat', 'mild fever'],
    description: 'A viral infection of the upper respiratory tract that is usually harmless and resolves on its own.',
  },
  {
    name: 'Influenza (Flu)',
    symptoms: ['fever', 'chills', 'muscle aches', 'fatigue', 'headache', 'cough'],
    description: 'A viral infection that attacks the respiratory system, more severe than a common cold.',
  },
  {
    name: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'vomiting', 'sensitivity to light', 'visual disturbances'],
    description: 'A neurological condition characterized by recurrent, severe headaches.',
  },
  {
    name: 'Gastroenteritis',
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'fever', 'dehydration'],
    description: 'Inflammation of the stomach and intestines, often caused by viral or bacterial infection.',
  },
  {
    name: 'Allergic Rhinitis',
    symptoms: ['sneezing', 'runny nose', 'itchy eyes', 'nasal congestion', 'postnasal drip'],
    description: 'An allergic reaction to airborne substances like pollen, dust, or pet dander.',
  },
  {
    name: 'Pneumonia',
    symptoms: ['cough', 'fever', 'chills', 'shortness of breath', 'chest pain', 'fatigue'],
    description: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid.',
  },
  {
    name: 'Bronchitis',
    symptoms: ['persistent cough', 'mucus production', 'fatigue', 'shortness of breath', 'chest discomfort'],
    description: 'Inflammation of the bronchial tubes that carry air to the lungs.',
  },
  {
    name: 'Sinusitis',
    symptoms: ['facial pain', 'nasal congestion', 'thick nasal discharge', 'headache', 'reduced sense of smell'],
    description: 'Inflammation of the sinuses, often following a cold or allergic reaction.',
  },
];

const mockRecommendations = [
  {
    type: 'Rest & Recovery',
    advice: 'Get adequate sleep (7-9 hours) and avoid strenuous activities to help your body recover.',
  },
  {
    type: 'Hydration',
    advice: 'Drink plenty of fluids, especially water, herbal teas, and clear broths to stay hydrated.',
  },
  {
    type: 'Nutrition',
    advice: 'Eat light, nutritious foods rich in vitamins and minerals to support your immune system.',
  },
  {
    type: 'Medical Care',
    advice: 'Monitor your symptoms and consult a healthcare provider if they worsen or persist.',
  },
];

// Simulate ML prediction logic
const calculateDiseaseMatch = (userSymptoms: string[], disease: any) => {
  const matchingSymptoms = disease.symptoms.filter((symptom: string) =>
    userSymptoms.some(userSymptom => 
      userSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
      symptom.toLowerCase().includes(userSymptom.toLowerCase())
    )
  );
  
  const confidence = Math.min(95, (matchingSymptoms.length / disease.symptoms.length) * 100 + Math.random() * 20);
  
  return {
    disease: disease.name,
    confidence: Math.round(confidence),
    description: disease.description,
    matchingSymptoms,
  };
};

export const getPrediction = async (symptoms: string[]): Promise<DiagnosisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  // In production, this would be:
  // const response = await fetch(`${API_BASE_URL}/predict`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ symptoms }),
  // });
  // return response.json();

  // Mock prediction logic
  const predictions = mockDiseases
    .map(disease => calculateDiseaseMatch(symptoms, disease))
    .filter(prediction => prediction.confidence > 30)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // Ensure we have at least 3 predictions
  while (predictions.length < 3) {
    const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    const randomPrediction = {
      disease: randomDisease.name,
      confidence: Math.round(Math.random() * 30 + 10),
      description: randomDisease.description,
      matchingSymptoms: [],
    };
    predictions.push(randomPrediction);
  }

  return {
    predictions: predictions.slice(0, 3),
    recommendations: mockRecommendations,
  };
};

// Mock medical knowledge base for chatbot
const medicalKnowledge = {
  'fever': 'Fever is a temporary increase in body temperature, often due to an illness. Common causes include infections, heat exhaustion, certain medications, or inflammatory conditions. Normal body temperature is around 98.6°F (37°C). Seek medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.',
  'flu': 'Influenza (flu) is a viral respiratory infection. Prevention includes annual vaccination, frequent handwashing, avoiding close contact with sick people, and maintaining good health habits like adequate sleep and nutrition.',
  'diabetes': 'Common symptoms of diabetes include increased thirst, frequent urination, extreme fatigue, blurred vision, slow-healing cuts, and unexplained weight loss. Type 1 and Type 2 diabetes have different causes but similar symptoms.',
  'heart health': 'Maintain good heart health through regular exercise (150 minutes moderate activity weekly), a balanced diet rich in fruits and vegetables, limiting sodium and saturated fats, not smoking, managing stress, and regular check-ups.',
  'immunity': 'Foods that boost immunity include citrus fruits (vitamin C), garlic, ginger, spinach, yogurt with probiotics, almonds, turmeric, green tea, and foods rich in zinc like shellfish and legumes.',
  'water': 'The general recommendation is about 8 glasses (64 ounces) of water daily, but individual needs vary based on activity level, climate, and overall health. Listen to your body and drink when thirsty.'
};

export const getChatResponse = async (question: string): Promise<ChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // In production, this would be:
  // const response = await fetch(`${API_BASE_URL}/chat`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ question }),
  // });
  // return response.json();

  // Simple keyword matching for demo
  const lowerQuestion = question.toLowerCase();
  let answer = "I understand you're asking about a health-related topic. While I can provide general information, please remember that this is for educational purposes only and should not replace professional medical advice.";

  // Find matching keywords
  for (const [keyword, response] of Object.entries(medicalKnowledge)) {
    if (lowerQuestion.includes(keyword)) {
      answer = response;
      break;
    }
  }

  // Add general health advice for unmatched queries
  if (answer === "I understand you're asking about a health-related topic. While I can provide general information, please remember that this is for educational purposes only and should not replace professional medical advice.") {
    if (lowerQuestion.includes('pain') || lowerQuestion.includes('hurt')) {
      answer = "Pain can have many causes. For persistent or severe pain, it's important to consult with a healthcare provider for proper evaluation and treatment. In the meantime, rest, ice/heat therapy, and over-the-counter pain relievers may provide temporary relief.";
    } else if (lowerQuestion.includes('diet') || lowerQuestion.includes('nutrition')) {
      answer = "A balanced diet includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, excessive sugar, and sodium. Consider consulting with a registered dietitian for personalized nutrition advice.";
    } else if (lowerQuestion.includes('exercise') || lowerQuestion.includes('workout')) {
      answer = "Regular physical activity is crucial for health. Aim for at least 150 minutes of moderate-intensity exercise weekly, including both cardio and strength training. Start slowly and gradually increase intensity. Consult your doctor before beginning any new exercise program.";
    }
  }

  return {
    answer: answer + "\n\nRemember: Always consult healthcare professionals for personalized medical advice and diagnosis.",
    confidence: 85,
    sources: ['Medical Knowledge Base', 'Health Guidelines']
  };
};

// Mock image analysis
const mockImageConditions = [
  {
    name: 'Pneumonia',
    description: 'Inflammation of the lungs, typically caused by bacterial or viral infection.',
    symptoms: ['chest x-ray', 'lung', 'respiratory']
  },
  {
    name: 'Normal',
    description: 'No significant abnormalities detected in the medical image.',
    symptoms: ['normal', 'healthy', 'clear']
  },
  {
    name: 'Fracture',
    description: 'A break or crack in bone structure visible on radiographic imaging.',
    symptoms: ['bone', 'break', 'fracture']
  },
  {
    name: 'Tumor',
    description: 'Abnormal growth of tissue that may be benign or malignant.',
    symptoms: ['mass', 'growth', 'tumor']
  },
  {
    name: 'Inflammation',
    description: 'Signs of inflammatory response in tissue or organs.',
    symptoms: ['swelling', 'inflammation', 'irritation']
  }
];

export const analyzeImage = async (imageFile: File): Promise<ImageAnalysisResult> => {
  // Simulate API delay for image processing
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

  // In production, this would be:
  // const formData = new FormData();
  // formData.append('image', imageFile);
  // const response = await fetch(`${API_BASE_URL}/analyze-image`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.json();

  // Mock analysis based on filename or random selection
  const fileName = imageFile.name.toLowerCase();
  let primaryCondition = mockImageConditions[1]; // Default to normal

  // Simple filename-based prediction
  if (fileName.includes('pneumonia') || fileName.includes('lung')) {
    primaryCondition = mockImageConditions[0];
  } else if (fileName.includes('fracture') || fileName.includes('break')) {
    primaryCondition = mockImageConditions[2];
  } else if (fileName.includes('tumor') || fileName.includes('mass')) {
    primaryCondition = mockImageConditions[3];
  } else {
    // Random selection for demo
    primaryCondition = mockImageConditions[Math.floor(Math.random() * mockImageConditions.length)];
  }

  // Generate predictions with confidence scores
  const predictions = [
    {
      condition: primaryCondition.name,
      confidence: Math.round(75 + Math.random() * 20), // 75-95%
      description: primaryCondition.description
    },
    {
      condition: mockImageConditions[Math.floor(Math.random() * mockImageConditions.length)].name,
      confidence: Math.round(40 + Math.random() * 30), // 40-70%
      description: mockImageConditions[Math.floor(Math.random() * mockImageConditions.length)].description
    },
    {
      condition: mockImageConditions[Math.floor(Math.random() * mockImageConditions.length)].name,
      confidence: Math.round(20 + Math.random() * 25), // 20-45%
      description: mockImageConditions[Math.floor(Math.random() * mockImageConditions.length)].description
    }
  ];

  // Remove duplicates and sort by confidence
  const uniquePredictions = predictions
    .filter((pred, index, self) => 
      index === self.findIndex(p => p.condition === pred.condition)
    )
    .sort((a, b) => b.confidence - a.confidence);

  const recommendations = [
    'Consult with a qualified radiologist for professional interpretation',
    'Consider additional imaging or tests if symptoms persist',
    'Follow up with your healthcare provider to discuss results',
    'Maintain regular health check-ups for early detection'
  ];

  return {
    predictions: uniquePredictions.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    processingTime: Math.round(2000 + Math.random() * 3000) // 2-5 seconds
  };
};