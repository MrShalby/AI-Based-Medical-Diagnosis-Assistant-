xxxxx# AI Medical Diagnosis Assistant - Backend

This is the Flask backend for the AI Medical Diagnosis Assistant capstone project with three main AI components.

## Features

### Core API Endpoints
- `/predict` - Symptom-based disease prediction using Random Forest
- `/chat` - Medical chatbot with NLP-based responses  
- `/analyze-image` - Medical image analysis using CNN models
- Random Forest Classifier for disease prediction
- CORS enabled for frontend integration
- Health check endpoint
- Comprehensive error handling

### AI Components
1. **Symptom Analysis**: Machine learning classification for disease prediction
2. **Medical Chatbot**: NLP-powered responses to health questions
3. **Image Analysis**: CNN-based medical image classification

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Create a virtual environment:**
   ```bash
   python -m venv medical_ai_env
   ```

2. **Activate the virtual environment:**
   
   On Windows:
   ```bash
   medical_ai_env\Scripts\activate
   ```
   
   On macOS/Linux:
   ```bash
   source medical_ai_env/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model:**
   ```bash
   python train_model.py
   ```
   
   This will create the following files:
   - `model.pkl` - Trained Random Forest model
   - `label_encoder.pkl` - Disease label encoder
   - `symptom_columns.pkl` - Symptom feature columns
   - `confusion_matrix.png` - Model evaluation visualization

5. **Run the Flask server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /predict

Accepts symptoms and returns disease predictions.

**Request Body:**
```json
{
  "symptoms": ["fever", "cough", "headache"]
}
```

**Response:**
```json
{
  "predictions": [
    {
      "disease": "Influenza",
      "confidence": 85.2,
      "description": "A viral infection that attacks the respiratory system...",
      "matchingSymptoms": ["fever", "cough"]
    }
  ],
  "recommendations": [
    {
      "type": "Rest & Recovery",
      "advice": "Get adequate sleep and avoid strenuous activities..."
    }
  ]
}
```

### POST /chat

Medical chatbot endpoint for health questions.

**Request Body:**
```json
{
  "question": "What causes fever?"
}
```

**Response:**
```json
{
  "answer": "Fever is a temporary increase in body temperature...",
  "confidence": 85,
  "sources": ["Medical Knowledge Base"]
}
```

### POST /analyze-image

Medical image analysis endpoint.

**Request:** Multipart form data with image file

**Response:**
```json
{
  "predictions": [
    {
      "condition": "Pneumonia",
      "confidence": 87.5,
      "description": "Inflammation of the lungs..."
    }
  ],
  "recommendations": [
    "Consult with a qualified radiologist..."
  ],
  "processingTime": 3500
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## Model Information

### Symptom Prediction Model
- **Algorithm:** Random Forest Classifier  
- **Features:** Binary encoding of symptoms
- **Training Data:** Disease-symptom dataset with 8 diseases and 15+ symptoms
- **Evaluation Metrics:** Accuracy, Precision, Recall, F1-Score

### Chatbot NLP
- **Approach:** Rule-based keyword matching with medical knowledge base
- **Enhancement:** Can be upgraded to use transformers (DistilBERT, T5)
- **Knowledge Base:** Curated medical information for common health topics

### Image Analysis
- **Architecture:** CNN-based classification (ResNet/VGG/MobileNet)
- **Input:** Medical images (X-rays, MRIs, CT scans)
- **Output:** Condition predictions with confidence scores
- **Demo Mode:** Filename-based mock predictions for development

## Dataset

The model is trained on a medical dataset containing:
- Multiple diseases (Common Cold, Influenza, Migraine, etc.)
- Binary symptom indicators
- Disease descriptions and recommendations

For production use, replace with a comprehensive medical dataset from sources like:
- Kaggle Disease-Symptom Dataset
- ChestX-ray Pneumonia Dataset
- Medical imaging databases
- Medical literature databases
- Clinical symptom databases

### Additional Datasets for Enhancement
- **Chatbot**: Medical QA datasets, PubMed abstracts
- **Image Analysis**: MIMIC-CXR, NIH Chest X-ray Dataset, Brain MRI datasets

## Deployment

### Local Development
```bash
python app.py
```

### Production (e.g., Heroku)
1. Add `Procfile`:
   ```
   web: python app.py
   ```

2. Set environment variables:
   ```
   PORT=5000
   FLASK_ENV=production
   ```

3. Deploy using Heroku CLI or similar platform

## Security Considerations

- Input validation for symptom data
- Rate limiting for API endpoints
- HTTPS in production
- Medical disclaimer for all predictions
- No storage of personal health information

## Contributing

This is a comprehensive capstone project demonstrating:
- **Machine Learning**: Classification algorithms and model deployment
- **Natural Language Processing**: Medical chatbot with knowledge base
- **Computer Vision**: Medical image analysis with CNN
- **Full-Stack Integration**: React frontend with Flask backend
- **API Design**: RESTful services with proper error handling

Enhancement areas:
- Model accuracy improvements
- Advanced NLP with transformer models
- Real CNN training for image analysis
- Additional medical datasets
- Enhanced feature engineering
- Better evaluation metrics

## Disclaimer

This AI diagnosis tool is for informational and educational purposes only. It should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.