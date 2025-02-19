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
import mediapipe as mp
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

# Ensure the uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

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
            "message": "Face images processed and stored successfully!!!",
            "document_id": doc_ref.id,
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })

    except Exception as e:
        print(f"Error occurred: {str(e)}")  
        print(traceback.format_exc())  # Log detailed traceback
        return jsonify({"error": "An error occurred during processing. Please try again.", "details": str(e)}), 500




### Micro expression analysis
# **Function to analyze the video and return psychological insights**
def analyze_video(video_path, user_uid):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    all_emotions = []

    if not cap.isOpened():
        print("Error: Cannot open the video file.")
        return {"error": "Cannot open the video file."}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1
        if frame is None:
            print(f"Skipping frame {frame_count} (Invalid frame)")
            continue

        frame_path = os.path.join("uploads", f"frame_{frame_count}.jpg")
        cv2.imwrite(frame_path, frame)

        try:
            result = DeepFace.analyze(img_path=frame_path, actions=['emotion'], enforce_detection=False)
            
            if isinstance(result, list):
                detected_emotions = result[0]['emotion']  # Store all detected emotions
            else:
                detected_emotions = result['emotion']

            all_emotions.append(detected_emotions)  # Store all emotions from the frame

        except Exception as e:
            print(f"Error analyzing frame {frame_count}: {str(e)}")

        if os.path.exists(frame_path):
            os.remove(frame_path)

    cap.release()
    cv2.destroyAllWindows()

    if not all_emotions:
        return {"message": "No emotions detected."}

    # Aggregate all detected emotions across frames
    aggregated_emotions = Counter()
    total_frames = len(all_emotions)

    for emotion_set in all_emotions:
        for emotion, score in emotion_set.items():
            aggregated_emotions[emotion] += score

    # Calculate average emotion percentages
    emotion_percentages = {
        emotion.capitalize(): round((score / total_frames), 2) for emotion, score in aggregated_emotions.items()
    }

    # Generate psychological insights
    psychological_insights = generate_psychological_insights(emotion_percentages)

    # **Generate recommendations**
    recommendations = get_recommendations(psychological_insights)

    # If no concerning insights, add a positive message
    if not psychological_insights:
        psychological_insights.append("No concerning emotional patterns detected. You seem mentally stable and balanced.")

    # **Save to Firestore & get doc ID + timestamp**
    doc_id, timestamp = save_to_firestore(user_uid, emotion_percentages, psychological_insights, recommendations)

    response_data = {
        "message": "Your micro-expression analysis is done!!!",
        "emotion_percentages": emotion_percentages,
        "psychological_insights": psychological_insights,
        "recommendations": recommendations,
        "timestamp": timestamp,  # ⬅️ Include Timestamp
        "doc_id": doc_id  # ⬅️ Include Firestore Document ID
    }

    return response_data


# **Function to Generate Dynamic Psychological Insights**
def generate_psychological_insights(emotion_percentages):
    insights = []

    if "Sad" in emotion_percentages and emotion_percentages["Sad"] > 60:
        insights.append("High sadness detected → Possible emotional distress or depression.")

    if "Fear" in emotion_percentages and emotion_percentages["Fear"] > 60:
        insights.append("High fear detected → Possible anxiety or heightened stress response.")

    if "Happy" in emotion_percentages and "Sad" in emotion_percentages:
        happiness = emotion_percentages["Happy"]
        sadness = emotion_percentages["Sad"]
        if abs(happiness - sadness) < 20:
            insights.append("Mood fluctuations detected → Possible emotional instability.")

    if "Neutral" in emotion_percentages and emotion_percentages["Neutral"] > 50:
        insights.append("High neutrality detected → Possible emotional detachment or suppression.")

    return insights


# **Function to Provide Recommendations Based on Psychological Insights**
def get_recommendations(psychological_insights):
    recommendations = []

    for insight in psychological_insights:
        if "sadness" in insight.lower():
            recommendations.append("Consider engaging in social activities or talking to a trusted friend.")
            recommendations.append("Daily exercise and mindfulness practices can help improve mood.")

        if "fear" in insight.lower():
            recommendations.append("Try relaxation techniques such as deep breathing or meditation.")
            recommendations.append("Consider gradual exposure therapy to overcome anxiety triggers.")

        if "mood fluctuations" in insight.lower():
            recommendations.append("Maintaining a daily routine can help stabilize emotions.")
            recommendations.append("Journaling your feelings might help you track emotional patterns.")

        if "neutrality" in insight.lower():
            recommendations.append("Engaging in hobbies or creative activities can boost emotional expression.")
            recommendations.append("Consider practicing gratitude exercises to enhance emotional engagement.")

    if not recommendations:
        recommendations.append("Maintain a balanced lifestyle with proper sleep, diet, and exercise.")
        recommendations.append("Stay socially connected and seek support when needed.")

    return recommendations


# **Function to Save Data to Firestore & Return Doc ID + Timestamp**
def save_to_firestore(user_uid, emotion_percentages, psychological_insights, recommendations):
    try:
        # Define timezone
        local_tz = pytz.timezone('Asia/Colombo')

        # Get the current UTC time and convert it to local time
        utc_now = datetime.utcnow()
        local_time = utc_now.replace(tzinfo=pytz.utc).astimezone(local_tz)

        # Format the timestamp
        timestamp = local_time.strftime('%Y-%m-%d %H:%M:%S')

        # Get user document reference
        user_ref = db.collection("users").document(user_uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            print(f"User {user_uid} not found in Firestore")
            return None, None

        # 🔹 **Store analysis result in Firestore & Get Doc ID**
        doc_ref = db.collection("expression_analysis").document()
        doc_ref.set({
            "uuid": user_uid,
            "user_id": user_doc.id,
            "emotion_percentages": emotion_percentages,
            "psychological_insights": psychological_insights,
            "recommendations": recommendations,
            "timestamp": timestamp
        })

        print(f"Expression analysis saved successfully for user {user_uid} at {timestamp}")

        return doc_ref.id, timestamp  # ⬅️ Return Firestore Document ID & Timestamp

    except Exception as e:
        print(f"Error saving to Firestore: {str(e)}")
        print(traceback.format_exc())
        return None, None


@app.route('/analyze-micro-expressions', methods=['POST'])
def analyze_emotions():
    print("Received request:", request.files, request.form)  # Debugging line
    
    if 'video' not in request.files or 'user_uid' not in request.form:
        return jsonify({"error": "Missing video file or user UID"}), 400

    video = request.files['video']
    user_uid = request.form['user_uid']

    video_path = os.path.join("uploads", video.filename)
    video.save(video_path)

    # Process the video
    result = analyze_video(video_path, user_uid)

    # Clean up the uploaded video file
    if os.path.exists(video_path):
        os.remove(video_path)

    return jsonify(result)



### Questionnaire
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
