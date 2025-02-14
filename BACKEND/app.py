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
import os
import cv2
from deepface import DeepFace
from collections import Counter
from datetime import datetime
import pytz

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
cred = credentials.Certificate('D:\\Backend\\serviceAccountKey.json')
initialize_app(cred)
db = firestore.client()

# Load the ML model for images
facePrakrurthi_model = tf.keras.models.load_model('D:\\Backend\\model\\FacePrakurthiFinal_CNN_Model.h5')

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

@app.route('/process-face-images', methods=['POST'])
def process_face_images():
    try:
        # Get request data
        data = request.json
        image_list = data.get("image_data")  # Expecting a list of 3 Base64 strings
        user_uid = data.get("user_uid")  # Firebase Auth UID (same for doctor and patient)

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
            prediction = facePrakrurthi_model.predict(image_array)
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
        
        doc_ref = db.collection("face_predictions").document()  # Auto-generate document ID

        doc_ref.set({
            "uuid": user_uid,  # Firebase UID
            "user_id": user_doc_id,  # Firestore user document ID
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })

        print(f"Prediction saved successfully for user {user_uid} at {timestamp}")

        # Return response
        return jsonify({
            "message": "Face images processed and stored successfully!",
            "document_id": doc_ref.id,
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })

    except Exception as e:
        print(f"Error occurred: {str(e)}")  
        print(traceback.format_exc())  # Log detailed traceback
        return jsonify({"error": "An error occurred during processing. Please try again.", "details": str(e)}), 500
    


# Ensure the uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Function to analyze the video and detect dominant emotion
def analyze_video(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    emotions = []  # List to store detected emotions

    if not cap.isOpened():
        print("Error: Cannot open the video file.")
        return "Error: Cannot open the video file."

    while True:
        ret, frame = cap.read()

        if not ret:
            break

        frame_count += 1

        if frame is None:  # Ensure frame is valid
            print(f"Skipping frame {frame_count} (Invalid frame)")
            continue

        frame_path = os.path.join("uploads", f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_path, frame)

        try:
            result = DeepFace.analyze(img_path=frame_path, actions=['emotion'], enforce_detection=False)

            if isinstance(result, list):
                dominant_emotion = result[0]['dominant_emotion']
            else:
                dominant_emotion = result['dominant_emotion']

            emotions.append(dominant_emotion)

        except Exception as e:
            print(f"Error analyzing frame {frame_count}: {str(e)}")

        # Clean up the frame image
        if os.path.exists(frame_path):
            os.remove(frame_path)

    cap.release()
    cv2.destroyAllWindows()

    emotion_counts = Counter(emotions)
    final_emotion = emotion_counts.most_common(1)[0] if emotions else ("No emotion detected", 0)

    return final_emotion

@app.route('/analyze-micro-expressions', methods=['POST'])
def analyze_micro_expressions():
    if 'video' not in request.files:
        return jsonify({"error": "No video file found"}), 400

    video_file = request.files['video']
    video_path = os.path.join("uploads", video_file.filename)
    video_file.save(video_path)

    try:
        final_emotion = analyze_video(video_path)
        return jsonify({"dominant_emotion": final_emotion[0], "count": final_emotion[1]})
    
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)




# Map of questions and their corresponding Prakriti options
questions = [
    {"id": 1, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 2, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 3, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 4, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 5, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 6, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 7, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 8, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 9, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 10, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 11, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
    {"id": 12, "options": {1: "Vata", 2: "Pitta", 3: "Kapha"}},
]

# Rule-based logic for Prakriti analysis
def determine_prakriti(scores):
    # If all three scores are equal, return Tri-doshic
    if scores["Vata"] == scores["Pitta"] == scores["Kapha"]:
        return "Tri-doshic (Vata-Pitta-Kapha)"
    
    # Sort scores by value in descending order
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    # If the top two scores are equal, return them as a tie
    if sorted_scores[0][1] == sorted_scores[1][1]:
        return f"{sorted_scores[0][0]}-{sorted_scores[1][0]}"
    
    # Return the single dominant Prakriti
    return sorted_scores[0][0]

@app.route("/analyze-prakriti/", methods=["POST"])
def analyze_prakriti():
    # Get JSON data from the request
    data = request.get_json()
    if not data or "answers" not in data:
        return jsonify({"error": "Invalid data. 'answers' key is required."}), 400

    answers = data["answers"]
    
    # Ensure the length of answers matches the number of questions
    if len(answers) != len(questions):
        return jsonify({"error": f"Expected {len(questions)} answers but received {len(answers)}."}), 400
    
    # Initialize scores
    scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}

    # Map answers to Prakriti and update scores
    for index, answer in enumerate(answers):
        prakriti = questions[index]["options"].get(answer)
        if prakriti:
            scores[prakriti] += 1
        else:
            return jsonify({"error": f"Invalid answer {answer} for question {index + 1}"}), 400

    # Determine Prakriti using rule-based logic
    result = determine_prakriti(scores)
    return jsonify({"prakriti": result})


if __name__ == '__main__':
    app.run(debug=True)
