from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import os
import base64
from PIL import Image
import io
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('label_encoder.pkl', 'rb') as f:
        label_encoder = pickle.load(f)
    with open('symptom_columns.pkl', 'rb') as f:
        symptom_columns = pickle.load(f)
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Model files not found. Please run train_model.py first.")
    model = None
    label_encoder = None
    symptom_columns = None

# Disease descriptions
DISEASE_DESCRIPTIONS = {
    'Common Cold': 'A viral infection of the upper respiratory tract that is usually harmless and resolves on its own.',
    'Influenza': 'A viral infection that attacks the respiratory system, more severe than a common cold.',
    'Migraine': 'A neurological condition characterized by recurrent, severe headaches.',
    'Gastroenteritis': 'Inflammation of the stomach and intestines, often caused by viral or bacterial infection.',
    'Pneumonia': 'An infection that inflames air sacs in one or both lungs, which may fill with fluid.',
    'Bronchitis': 'Inflammation of the bronchial tubes that carry air to the lungs.',
    'Sinusitis': 'Inflammation of the sinuses, often following a cold or allergic reaction.',
    'Allergic Rhinitis': 'An allergic reaction to airborne substances like pollen, dust, or pet dander.',
}

# Health recommendations
HEALTH_RECOMMENDATIONS = [
    {
        'type': 'Rest & Recovery',
        'advice': 'Get adequate sleep (7-9 hours) and avoid strenuous activities to help your body recover.'
    },
    {
        'type': 'Hydration',
        'advice': 'Drink plenty of fluids, especially water, herbal teas, and clear broths to stay hydrated.'
    },
    {
        'type': 'Nutrition',
        'advice': 'Eat light, nutritious foods rich in vitamins and minerals to support your immune system.'
    },
    {
        'type': 'Medical Care',
        'advice': 'Monitor your symptoms and consult a healthcare provider if they worsen or persist.'
    }
]

# Medical knowledge base for chatbot
MEDICAL_KNOWLEDGE = {
    'fever': 'Fever is a temporary increase in body temperature, often due to an illness. Common causes include infections, heat exhaustion, certain medications, or inflammatory conditions.',
    'flu': 'Influenza prevention includes annual vaccination, frequent handwashing, avoiding close contact with sick people, and maintaining good health habits.',
    'diabetes': 'Common diabetes symptoms include increased thirst, frequent urination, extreme fatigue, blurred vision, and unexplained weight loss.',
    'heart': 'Maintain heart health through regular exercise, balanced diet, limiting sodium, not smoking, managing stress, and regular check-ups.',
    'immunity': 'Immunity-boosting foods include citrus fruits, garlic, ginger, spinach, yogurt, almonds, turmeric, and green tea.',
    'water': 'General recommendation is about 8 glasses (64 ounces) of water daily, but needs vary based on activity and climate.'
}

# Image analysis conditions
IMAGE_CONDITIONS = {
    'pneumonia': {'name': 'Pneumonia', 'description': 'Inflammation of the lungs, typically caused by bacterial or viral infection.'},
    'normal': {'name': 'Normal', 'description': 'No significant abnormalities detected in the medical image.'},
    'fracture': {'name': 'Fracture', 'description': 'A break or crack in bone structure visible on radiographic imaging.'},
    'tumor': {'name': 'Tumor', 'description': 'Abnormal growth of tissue that may be benign or malignant.'},
    'inflammation': {'name': 'Inflammation', 'description': 'Signs of inflammatory response in tissue or organs.'}
}

def preprocess_symptoms(user_symptoms):
    """Convert user symptoms to model input format"""
    # Create a binary vector for all possible symptoms
    symptom_vector = np.zeros(len(symptom_columns))
    
    for i, symptom_col in enumerate(symptom_columns):
        # Check if any user symptom matches this column
        for user_symptom in user_symptoms:
            if user_symptom.lower().replace(' ', '_') in symptom_col.lower():
                symptom_vector[i] = 1
                break
    
    return symptom_vector.reshape(1, -1)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.'
            }), 500

        # Get symptoms from request
        data = request.get_json()
        user_symptoms = data.get('symptoms', [])
        
        if not user_symptoms:
            return jsonify({
                'error': 'No symptoms provided'
            }), 400
        
        # Preprocess symptoms
        symptom_vector = preprocess_symptoms(user_symptoms)
        
        # Get prediction probabilities
        probabilities = model.predict_proba(symptom_vector)[0]
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]
        
        predictions = []
        for idx in top_indices:
            disease = label_encoder.inverse_transform([idx])[0]
            confidence = float(probabilities[idx] * 100)
            
            # Find matching symptoms (simplified)
            matching_symptoms = [s for s in user_symptoms if s.lower() in disease.lower()]
            
            predictions.append({
                'disease': disease,
                'confidence': round(confidence, 1),
                'description': DISEASE_DESCRIPTIONS.get(disease, 'No description available.'),
                'matchingSymptoms': matching_symptoms
            })
        
        return jsonify({
            'predictions': predictions,
            'recommendations': HEALTH_RECOMMENDATIONS
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}'
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        question = data.get('question', '').lower()
        
        if not question:
            return jsonify({
                'error': 'No question provided'
            }), 400
        
        # Simple keyword matching
        answer = "I understand you're asking about a health-related topic. While I can provide general information, please remember that this is for educational purposes only."
        
        for keyword, response in MEDICAL_KNOWLEDGE.items():
            if keyword in question:
                answer = response
                break
        
        # Add general advice for common topics
        if 'pain' in question or 'hurt' in question:
            answer = "Pain can have many causes. For persistent or severe pain, consult with a healthcare provider for proper evaluation and treatment."
        elif 'diet' in question or 'nutrition' in question:
            answer = "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods and excessive sugar."
        elif 'exercise' in question or 'workout' in question:
            answer = "Regular physical activity is crucial for health. Aim for at least 150 minutes of moderate-intensity exercise weekly."
        
        return jsonify({
            'answer': answer + "\n\nRemember: Always consult healthcare professionals for personalized medical advice.",
            'confidence': 85,
            'sources': ['Medical Knowledge Base']
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Chat failed: {str(e)}'
        }), 500

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        if 'image' not in request.files:
            return jsonify({
                'error': 'No image file provided'
            }), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({
                'error': 'No image file selected'
            }), 400
        
        # Validate image file
        try:
            image = Image.open(image_file.stream)
            image.verify()  # Verify it's a valid image
        except Exception:
            return jsonify({
                'error': 'Invalid image file'
            }), 400
        
        # Mock image analysis (in production, use CNN model)
        filename = image_file.filename.lower()
        
        # Simple filename-based prediction for demo
        if 'pneumonia' in filename or 'lung' in filename:
            primary_condition = IMAGE_CONDITIONS['pneumonia']
            confidence = 87
        elif 'fracture' in filename or 'break' in filename:
            primary_condition = IMAGE_CONDITIONS['fracture']
            confidence = 92
        elif 'tumor' in filename or 'mass' in filename:
            primary_condition = IMAGE_CONDITIONS['tumor']
            confidence = 78
        else:
            primary_condition = IMAGE_CONDITIONS['normal']
            confidence = 85
        
        # Generate mock predictions
        predictions = [
            {
                'condition': primary_condition['name'],
                'confidence': confidence,
                'description': primary_condition['description']
            },
            {
                'condition': 'Normal',
                'confidence': max(20, 100 - confidence - 10),
                'description': 'No significant abnormalities detected.'
            },
            {
                'condition': 'Inflammation',
                'confidence': max(15, 100 - confidence - 25),
                'description': 'Signs of inflammatory response in tissue.'
            }
        ]
        
        # Sort by confidence
        predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        recommendations = [
            'Consult with a qualified radiologist for professional interpretation',
            'Consider additional imaging or tests if symptoms persist',
            'Follow up with your healthcare provider to discuss results'
        ]
        
        return jsonify({
            'predictions': predictions[:3],
            'recommendations': recommendations,
            'processingTime': 3500
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Image analysis failed: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)