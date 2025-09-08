import torch
from torchvision import transforms
from PIL import Image
import json
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cxr_model.pt")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "models", "cxr_class_names.json")

# Load class names
with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# Preprocessing (must match training!)
transform = transforms.Compose([
    transforms.Resize((320, 320)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.load(MODEL_PATH, map_location=device)
model.eval()

def analyze_chest_xray(image_path, threshold=0.5):
    """Run inference on a chest X-ray image."""
    img = Image.open(image_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.sigmoid(outputs).cpu().numpy()[0]

    results = []
    for idx, prob in enumerate(probs):
        if prob >= threshold:
            results.append({
                "condition": CLASS_NAMES[idx],
                "probability": float(prob)
            })
    return results
