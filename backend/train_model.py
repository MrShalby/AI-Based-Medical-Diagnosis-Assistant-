import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import seaborn as sns
import matplotlib.pyplot as plt

def load_and_preprocess_data():
    """
    Load and preprocess the disease-symptom dataset
    Expected CSV format: Disease, Symptom_1, Symptom_2, ..., Symptom_n
    """
    print("Loading dataset...")
    
    # Sample dataset creation (replace with actual dataset loading)
    # In production, load from: https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset
    
    # Create sample data for demonstration
    diseases = ['Common Cold', 'Influenza', 'Migraine', 'Gastroenteritis', 'Pneumonia', 'Bronchitis', 'Sinusitis', 'Allergic Rhinitis']
    symptoms = ['fever', 'cough', 'headache', 'nausea', 'fatigue', 'runny_nose', 'sore_throat', 'muscle_aches', 
                'chills', 'vomiting', 'diarrhea', 'shortness_of_breath', 'chest_pain', 'sneezing', 'nasal_congestion']
    
    # Generate sample dataset
    np.random.seed(42)
    data = []
    
    disease_symptom_map = {
        'Common Cold': ['runny_nose', 'sneezing', 'cough', 'sore_throat', 'fatigue'],
        'Influenza': ['fever', 'chills', 'muscle_aches', 'fatigue', 'headache', 'cough'],
        'Migraine': ['headache', 'nausea', 'fatigue'],
        'Gastroenteritis': ['nausea', 'vomiting', 'diarrhea', 'fever'],
        'Pneumonia': ['cough', 'fever', 'chills', 'shortness_of_breath', 'chest_pain'],
        'Bronchitis': ['cough', 'fatigue', 'shortness_of_breath', 'chest_pain'],
        'Sinusitis': ['headache', 'nasal_congestion', 'runny_nose', 'fatigue'],
        'Allergic Rhinitis': ['sneezing', 'runny_nose', 'nasal_congestion']
    }
    
    for disease in diseases:
        for _ in range(100):  # 100 samples per disease
            row = {'Disease': disease}
            for symptom in symptoms:
                if symptom in disease_symptom_map.get(disease, []):
                    row[symptom] = np.random.choice([0, 1], p=[0.2, 0.8])  # 80% chance of having the symptom
                else:
                    row[symptom] = np.random.choice([0, 1], p=[0.9, 0.1])  # 10% chance of having other symptoms
            data.append(row)
    
    df = pd.DataFrame(data)
    print(f"Dataset shape: {df.shape}")
    print(f"Diseases: {df['Disease'].unique()}")
    
    return df

def train_model():
    """Train the Random Forest model"""
    print("Starting model training...")
    
    # Load and preprocess data
    df = load_and_preprocess_data()
    
    # Separate features and target
    X = df.drop('Disease', axis=1)
    y = df['Disease']
    
    # Encode disease labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train Random Forest model
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=10,
        min_samples_split=5
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))
    
    # Save the model and encoders
    print("Saving model and encoders...")
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('label_encoder.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)
    
    with open('symptom_columns.pkl', 'wb') as f:
        pickle.dump(list(X.columns), f)
    
    print("Model training completed successfully!")
    
    # Plot confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=label_encoder.classes_, 
                yticklabels=label_encoder.classes_)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.xticks(rotation=45)
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    print("Confusion matrix saved as 'confusion_matrix.png'")
    
    return model, label_encoder, X.columns

if __name__ == "__main__":
    train_model()