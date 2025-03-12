from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from datetime import datetime
import base64
from flask_cors import CORS
import traceback
from collections import Counter
import pytz
import cv2
from skimage import feature

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Welcome to the Prakruti Diagnosis API!"

@app.route('/favicon.ico')
def favicon():
    return '', 204

CORS(app, resources={r"/*": {"origins": ["http://localhost:8100"]}})

# Firebase setup
cred = credentials.Certificate('D:\Backend\serviceAccountKey.json')
initialize_app(cred)
db = firestore.client()

# Load the ML model for hair images
hair_model = tf.keras.models.load_model('D:\Backend\model\Dataset4_CNN_Model.h5')

# Mapping of model output to Ayurvedic Prakriti classifications for images
prediction_mapping = {
    0: 'Kapha',
    1: 'Kapha-Pitta',
    2: 'Kapha-Vata',
    3: 'Pitta',
    4: 'Pitta-Kapha',
    5: 'Pitta-Vata',
    6: 'Vata',
    7: 'Vata-Kapha',
    8: 'Vata-Pitta',
    9: 'Vata-Pitta-Kapha'
}

@app.route('/process-hair-images', methods=['POST'])
def process_hair_images():
    try:
        # Get request data
        data = request.json
        image_list = data.get("image_data")  # Expecting a list of 3 Base64 strings
        user_uid = data.get("user_uid")  # Firebase Auth UID (same for patient/doctor)
        
        if not image_list or len(image_list) != 3 or not user_uid:
            return jsonify({"error": "Missing required data (images or user UID)"}), 400

        print(f"Received {len(image_list)} images for user UID: {user_uid}")  # Log receipt

        predictions = []

        for image_base64 in image_list:
            # Ensure proper padding for Base64 decoding
            padding_needed = len(image_base64) % 4
            if padding_needed != 0:
                image_base64 += "=" * (4 - padding_needed)

            # Decode Base64 to bytes
            image_data = base64.b64decode(image_base64.split(",")[1] if "," in image_base64 else image_base64)
            
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))

            # Convert to RGB if needed
            if image.mode != "RGB":
                image = image.convert("RGB")

            # Resize image to the size expected by the model
            image = image.resize((128, 128))

            # Normalize image data
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension

            # Predict using the model
            prediction = hair_model.predict(image_array)
            predicted_class = np.argmax(prediction, axis=1)[0]
            predictions.append(prediction_mapping[predicted_class])

        # Determine the final prakruti using majority vote
        overall_result = Counter(predictions).most_common(1)[0][0]

        # Query Firestore for the user document
        user_ref = db.collection("users").document(user_uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Get user document ID
        user_doc_id = user_doc.id

        # Store prediction result in Firestore
        
        # Define your local timezone (e.g., 'Asia/Colombo' for Sri Lanka)
        local_tz = pytz.timezone('Asia/Colombo')

        # Get the current UTC time and convert it to local time
        utc_now = datetime.utcnow()
        local_time = utc_now.replace(tzinfo=pytz.utc).astimezone(local_tz)

        # Format the timestamp
        timestamp = local_time.strftime('%Y-%m-%d %H:%M:%S')
        
        doc_ref = db.collection("hair_predictions").document()  # Auto-generate document ID

        doc_ref.set({
            "uuid": user_uid,  # Firebase UID
            "user_id": user_doc_id,  # Firestore user document ID
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp,
        })

        return jsonify({
            "message": "Hair image analysis completed successfully!",
            "final_prakriti": overall_result,
            "individual_predictions": predictions,

        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)