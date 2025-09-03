import os
import requests
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask import Flask, request, jsonify, render_template_string, g
from flask_cors import CORS
import pickle
import numpy as np
from PIL import Image

from auth_simple import (
    init_simple_auth, register_user, authenticate_user, generate_token, 
    get_user_by_id, require_auth, hash_password, verify_password, SessionLocal
)
from reports_routes import init_reports_routes

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True) # Enable CORS for all routes

# Initialize simple authentication and reports routes
init_simple_auth()
app = init_reports_routes(app)

@app.route('/api/user/profile', methods=['PUT'])
@require_auth
def update_profile():
    try:
        data = request.json
        user = get_user_by_id(request.user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        # Update name if provided
        if 'name' in data:
            user.username = data['name']
            
        # Update password if provided
        if 'oldPassword' in data and 'newPassword' in data:
            if not verify_password(data['oldPassword'], user.password_hash):
                return jsonify({"error": "Current password is incorrect"}), 400
            user.password_hash = hash_password(data['newPassword'])
            
        # Save changes
        db = SessionLocal()
        try:
            db.merge(user)
            db.commit()
            return jsonify({
                "name": user.username,
                "email": user.email
            })
        except Exception as e:
            db.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            db.close()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Load the trained model and related data files

@app.route('/')
def home_with_sidebar():
    routes = []
    for rule in app.url_map.iter_rules():
        if rule.endpoint == 'static':
            continue
        methods = sorted(rule.methods - {'OPTIONS', 'HEAD'})
        routes.append({
            "endpoint": rule.rule,
            "methods": ", ".join(methods)
        })
    
    page_html = '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Medical AI Diagnosis API</title>
      <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          display: flex;
          height: 100vh;
        }
        .sidebar {
          width: 280px;
          background-color: #2c3e50;
          color: white;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .sidebar h2 {
          margin-top: 0;
          font-weight: normal;
          font-size: 1.5em;
          border-bottom: 1px solid #34495e;
          padding-bottom: 10px;
        }
        .endpoint {
          margin: 15px 0;
          padding: 10px;
          background-color: #34495e;
          border-radius: 4px;
          cursor: default;
          transition: background-color 0.3s ease;
        }
        .endpoint:hover {
          background-color: #3d566e;
        }
        .endpoint .url {
          font-weight: bold;
          font-size: 1.1em;
          color: #1abc9c;
        }
        .endpoint .methods {
          font-size: 0.9em;
          margin-top: 4px;
          color: #bdc3c7;
        }
        .main-content {
          flex-grow: 1;
          background: #ecf0f1;
          padding: 40px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        h1 {
          color: #2c3e50;
          margin-top: 0;
        }
        p {
          font-size: 1.1em;
          color: #34495e;
        }
      </style>
    </head>
    <body>
      <div class="sidebar">
        <h2>API Endpoints</h2>
        {% for route in routes %}
          <div class="endpoint">
            <div class="url">{{ route.endpoint }}</div>
            <div class="methods">Methods: {{ route.methods }}</div>
          </div>
        {% endfor %}
      </div>
      <div class="main-content">
        <h1>Welcome to Medical AI Diagnosis API</h1>
        <p>Use the sidebar to explore available API endpoints. You can send requests to these endpoints to get disease predictions, interact with the chatbot, analyze medical images, and check server health.</p>
        <p>For API usage details, refer to the project README or the endpoint documentation.</p>
      </div>
    </body>
    </html>
    '''
    return render_template_string(page_html, routes=routes)
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('label_encoder.pkl', 'rb') as f:
        label_encoder = pickle.load(f)
    with open('symptom_columns.pkl', 'rb') as f:
        symptom_columns = pickle.load(f)
    print("Model and related files loaded successfully!")
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
    'Allergic Rhinitis': 'An allergic reaction to airborne substances like pollen, dust, or pet dander.'
}

# Health recommendations list (fixed structure)
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

# Image analysis mock conditions
IMAGE_CONDITIONS = {
    'pneumonia': {'name': 'Pneumonia', 'description': 'Inflammation of the lungs, typically caused by bacterial or viral infection.'},
    'normal': {'name': 'Normal', 'description': 'No significant abnormalities detected in the medical image.'},
    'fracture': {'name': 'Fracture', 'description': 'A break or crack in bone structure visible on radiographic imaging.'},
    'tumor': {'name': 'Tumor', 'description': 'Abnormal growth of tissue that may be benign or malignant.'},
    'inflammation': {'name': 'Inflammation', 'description': 'Signs of inflammatory response in tissue or organs.'}
}

def preprocess_symptoms(user_symptoms):
    """Convert user symptoms list to a binary vector for the model input."""
    symptom_vector = np.zeros(len(symptom_columns))
    normalized_user_symptoms = [s.lower().replace(' ', '_') for s in user_symptoms]

    for i, symptom_col in enumerate(symptom_columns):
        if symptom_col.lower() in normalized_user_symptoms:
            symptom_vector[i] = 1
    return symptom_vector.reshape(1, -1)

@app.route('/')
def home():
    return "Medical AI Diagnosis API is running."

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Please train the model first.'}), 500

    data = request.get_json()
    user_symptoms = data.get('symptoms', [])

    if not user_symptoms or not isinstance(user_symptoms, list):
        return jsonify({'error': 'No symptoms provided or incorrect format.'}), 400

    try:
        symptom_vector = preprocess_symptoms(user_symptoms)
        probabilities = model.predict_proba(symptom_vector)[0]
        top_indices = np.argsort(probabilities)[-3:][::-1]

        predictions = []
        for idx in top_indices:
            disease = label_encoder.inverse_transform([idx])[0]
            confidence = float(probabilities[idx] * 100)

            # Find matching symptoms in the disease symptom list - simplified as symptom matches in user input
            matching_symptoms = [s for s in user_symptoms if s.lower().replace(' ', '_') in symptom_columns]

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
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get('question', '').strip().lower()

    if not question:
        return jsonify({'error': 'No question provided.'}), 400

    answer = None
    confidence = 85
    sources = ['Medical Knowledge Base']

    # Lookup simple keyword answers
    for keyword, response in MEDICAL_KNOWLEDGE.items():
        if keyword in question:
            answer = response
            break

    # If no direct answer, fallback to generic advice
    if answer is None:
        if any(x in question for x in ['pain', 'hurt']):
            answer = "Pain can have many causes. For persistent or severe pain, consult with a healthcare provider for proper evaluation and treatment."
        elif any(x in question for x in ['diet', 'nutrition']):
            answer = "A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods and excessive sugar."
        elif any(x in question for x in ['exercise', 'workout']):
            answer = "Regular physical activity is crucial for health. Aim for at least 150 minutes of moderate-intensity exercise weekly."

    # If still no answer, and Gemini API key active, call Gemini API (optional)
    if answer is None:
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        gemini_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        if gemini_api_key:
            try:
                headers = {'Content-Type': 'application/json'}
                params = {'key': gemini_api_key}
                payload = {
                    'contents': [{'parts': [{'text': question}]}]
                }
                response = requests.post(gemini_url, headers=headers, params=params, json=payload, timeout=10)
                if response.status_code == 200:
                    gemini_data = response.json()
                    gemini_answer = gemini_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    if gemini_answer:
                        answer = gemini_answer
                        confidence = 70
                        sources = ['Gemini API']
                    else:
                        answer = "Sorry, I couldn't find an answer to your question."
                        confidence = 0
                else:
                    answer = "Sorry, there was a problem contacting the Gemini API."
                    confidence = 0
            except Exception as e:
                answer = f"Gemini API error: {str(e)}"
                confidence = 0
                sources = ['Gemini API']
        else:
            answer = "Sorry, I don't have an answer for that at the moment."

    # Add medical disclaimer if question is health related
    health_keywords = ['health', 'doctor', 'medicine', 'medical', 'symptom', 'treatment', 'disease', 'pain', 'diet',
                       'nutrition', 'exercise', 'workout', 'fever', 'flu', 'diabetes', 'heart', 'immunity', 'water']

    if any(hw in question for hw in health_keywords):
        answer += "\n\nRemember: Always consult healthcare professionals for personalized medical advice."

    return jsonify({
        'answer': answer,
        'confidence': confidence,
        'sources': sources
    })

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided.'}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'No image file selected.'}), 400

        # Validate image file can be opened
        try:
            image = Image.open(image_file.stream)
            image.verify()
        except Exception:
            return jsonify({'error': 'Invalid image file.'}), 400

        filename = image_file.filename.lower()

        # Filename-based mock predictions for demo
        if 'pneumonia' in filename or 'lung' in filename:
            primary_condition = IMAGE_CONDITIONS['pneumonia']
            confidence = 87.0
        elif 'fracture' in filename or 'break' in filename:
            primary_condition = IMAGE_CONDITIONS['fracture']
            confidence = 92.0
        elif 'tumor' in filename or 'mass' in filename:
            primary_condition = IMAGE_CONDITIONS['tumor']
            confidence = 78.0
        else:
            primary_condition = IMAGE_CONDITIONS['normal']
            confidence = 85.0

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

        # Sort predictions by confidence descending
        predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)

        recommendations = [
            'Consult with a qualified radiologist for professional interpretation',
            'Consider additional imaging or tests if symptoms persist',
            'Follow up with your healthcare provider to discuss results'
        ]

        return jsonify({
            'predictions': predictions[:3],
            'recommendations': recommendations,
            'processingTime': 3500  # in milliseconds (mock)
        })

    except Exception as e:
        return jsonify({'error': f'Image analysis failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

# Authentication endpoints
@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    user, error = register_user(username, email, password)
    if error:
        return jsonify({"error": error}), 400

    token = generate_token(user.id, user.email)
    return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "email": user.email}})
    
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
        
    user = authenticate_user(data['email'], data['password'])
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
        
    token = generate_token(user.id, user.email)

    
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })

@app.route('/auth/me', methods=['GET'])
@require_auth
def get_current_user():
    user = get_user_by_id(g.user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })
if __name__ == "__main__":
    app.run(debug=True)
