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

#IT21319488
import sys
import dlib
import time

# Initialize Flask app
app = Flask(__name__)

#IT21319488
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

# Load the ML model for images - IT21322730
facePrakrurthi_model = tf.keras.models.load_model('D:\\Backend\\model\\FacePrakurthiFinal_CNN_Model.h5')
# Load the ML model for images - IT21319488
image_model = tf.keras.models.load_model('D:\\Backend\\model\\Hybrid_CNN_Transformer_Model.h5')


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

#IT21322730
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

#IT21319488
@app.route('/process-firebase-image', methods=['POST'])
def process_firebase_image():
    try:
        # Get the image data (Base64 string) from the request body
        data = request.json
        image_data = data.get('image_data')
        user_uid = data.get('user_uid')  # Firebase Auth UID

        if not image_data or not user_uid:
            return jsonify({"error": "Missing image data or user UID"}), 400

        print(f"Received image data for user UID: {user_uid}")  # Log image data receipt

        # Ensure proper padding for Base64 decoding
        padding_needed = len(image_data) % 4
        if padding_needed != 0:
            image_data += '=' * (4 - padding_needed)

        # Decode the Base64 string into bytes
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        
        # Open and process the image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert image to RGB if it's in RGBA format
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image = image.resize((224, 224))  # Resize if needed
        image_array = np.array(image) / 255.0  # Normalize
        image_array = np.expand_dims(image_array, axis=0)

        # Predict using the model
        predictions = image_model.predict(image_array)
        predicted_class = np.argmax(predictions, axis=1)[0]

        print(f"Prediction made: {prediction_mapping[predicted_class]}")  # Log prediction

        # Map the numerical prediction to the Ayurvedic Prakriti
        prakriti_prediction = prediction_mapping[predicted_class]

        # Query Firestore to get the user document based on the UID
        user_ref = db.collection('users').document(user_uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Get the user document ID from the Firestore document
        user_doc_id = user_doc.id

        #Create a reference to the 'eye' collection and create a new document
        doc_ref = db.collection('eye').document()  # Automatically creates a new document
        timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        doc_ref.set({
            "uuid": user_uid,  # User's Firebase Authentication UID
            "user_id": user_doc_id,  # User's document ID from the 'users' collection
            "image_data": image_data,
            "prediction": prakriti_prediction,
            "timestamp": timestamp
        })

        # Return success message with document ID, prediction, and timestamp
        return jsonify({
            "message": "Image processed and stored successfully!",
            "document_id": doc_ref.id,
            "prediction": prakriti_prediction,
            "timestamp": timestamp
        })

    except Exception as e:
        # Log detailed error and traceback for debugging
        print(f"Error occurred: {str(e)}")  
        print(traceback.format_exc())  # Log the detailed traceback of the error
        return jsonify({"message": "An error occurred during processing. Please try again."}), 500


@app.route('/process-firebase-image/<doc_id>', methods=['GET'])
def get_prediction_by_id(doc_id):
    try:
        # Access the Firestore document using the provided ID
        doc_ref = db.collection('eye').document(doc_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Document not found"}), 404

        # Retrieve data from the document
        data = doc.to_dict()
        prediction = data.get('prediction')  # Prediction stored in Firestore

        # Construct the response object
        response = {
            "id": doc.id,
            "prediction": prediction,
            "timestamp": data.get('timestamp')
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
        

# Eye Aspect Ratio (EAR) Calculation
def calculate_ear(eye):
    A = np.linalg.norm(eye[1] - eye[5])  # Vertical distance
    B = np.linalg.norm(eye[2] - eye[4])  # Vertical distance
    C = np.linalg.norm(eye[0] - eye[3])  # Horizontal distance
    return (A + B) / (2.0 * C)

# Pupil Size Calculation
def calculate_pupil_size(eye_region, gray_frame):
    x_min, y_min, x_max, y_max = eye_region
    eye_frame = gray_frame[y_min:y_max, x_min:x_max]

    if eye_frame.size == 0:
        return 0  # Prevent errors if eye region is empty

    _, threshold_eye = cv2.threshold(eye_frame, 50, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(threshold_eye, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        max_contour = max(contours, key=cv2.contourArea)
        return cv2.contourArea(max_contour)
    return 0

# Track Pupil Movement
def track_pupil_movement(previous_center, current_center):
    if previous_center is None:
        return 0
    return np.linalg.norm(np.array(previous_center) - np.array(current_center))

# Analyze Stress and Fatigue Levels
def analyze_stress_fatigue_pupil(video_source):
    try:
        print(f"Starting analysis for video: {video_source}")
        face_detector = dlib.get_frontal_face_detector()
        landmark_predictor = dlib.shape_predictor("D:\\Backend\\model\\shape_predictor_68_face_landmarks.dat")

        cap = cv2.VideoCapture(video_source)

        if not cap.isOpened():
            print("Error: Cannot open video file")
            return {"error": "Cannot open video"}

        print("Video loaded successfully")

        fps = cap.get(cv2.CAP_PROP_FPS) or 30  
        frame_time = 1 / fps  

        blink_count = 0
        blink_active = False
        total_frames = 0
        last_blink_time = 0  # Helps in preventing false blinks

        pupil_sizes = []
        previous_left_pupil_center = None
        previous_right_pupil_center = None
        pupil_movement_distances = []

        while True:
            ret, frame = cap.read()
            if not ret or frame is None:
                break

            # Resize frame to ensure consistent detection
            frame = cv2.resize(frame, (640, 480))

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)  # Improve contrast for better eye detection

            faces = face_detector(gray)

            for face in faces:
                landmarks = landmark_predictor(gray, face)

                left_eye = np.array([[landmarks.part(i).x, landmarks.part(i).y] for i in range(36, 42)])
                right_eye = np.array([[landmarks.part(i).x, landmarks.part(i).y] for i in range(42, 48)])

                ear_left = calculate_ear(left_eye)
                ear_right = calculate_ear(right_eye)
                ear_avg = (ear_left + ear_right) / 2.0

                # Debugging EAR values
                print(f"EAR Left: {ear_left}, EAR Right: {ear_right}, EAR Avg: {ear_avg}")

                current_time = time.time()

                # Improved Blink Detection with adjusted threshold
                if ear_avg < 0.20:  # Adjust EAR threshold if needed
                    if not blink_active and (current_time - last_blink_time > 0.15):  # Avoid multiple blinks for one closure
                        blink_active = True
                        last_blink_time = current_time
                else:
                    if blink_active:
                        blink_count += 1
                        blink_active = False

                left_eye_region = (left_eye[:, 0].min(), left_eye[:, 1].min(), left_eye[:, 0].max(), left_eye[:, 1].max())
                right_eye_region = (right_eye[:, 0].min(), right_eye[:, 1].min(), right_eye[:, 0].max(), right_eye[:, 1].max())

                left_pupil_size = calculate_pupil_size(left_eye_region, gray)
                right_pupil_size = calculate_pupil_size(right_eye_region, gray)

                avg_pupil_size = (left_pupil_size + right_pupil_size) / 2.0
                pupil_sizes.append(avg_pupil_size)

                left_center = (np.mean(left_eye[:, 0]), np.mean(left_eye[:, 1]))
                right_center = (np.mean(right_eye[:, 0]), np.mean(right_eye[:, 1]))

                if previous_left_pupil_center is not None:
                    pupil_movement_distances.append(track_pupil_movement(previous_left_pupil_center, left_center))

                if previous_right_pupil_center is not None:
                    pupil_movement_distances.append(track_pupil_movement(previous_right_pupil_center, right_center))

                previous_left_pupil_center = left_center
                previous_right_pupil_center = right_center

            total_frames += 1

        cap.release()

        if total_frames > 0:
            blinking_rate = (blink_count / (total_frames / fps)) * 60
        else:
            blinking_rate = 0

        avg_pupil_movement = np.mean(pupil_movement_distances) if pupil_movement_distances else 0
        fatigue_level = "Low Fatigue" if avg_pupil_movement < 2 else "Medium Fatigue" if 2 <= avg_pupil_movement <= 10 else "High Fatigue"

        stress_level = "Low Stress" if blinking_rate < 15 else "Medium Stress" if 15 <= blinking_rate <= 25 else "High Stress"

        avg_pupil_size = np.mean(pupil_sizes) if pupil_sizes else 0
        pupil_behavior = "High Pupil Dilation (Stress/Fatigue)" if avg_pupil_size > 1000 else "Normal Pupil Response" if 500 <= avg_pupil_size <= 1000 else "Low Pupil Response (Possible Fatigue)"

        return {
            'blink_count': blink_count,
            'blinking_rate': blinking_rate,
            'fatigue_level': fatigue_level,
            'stress_level': stress_level,
            'pupil_behavior': pupil_behavior
        }

    except Exception as e:
        print(f"Error during analysis: {e}")
        return {"error": str(e)}

# Flask route for video analysis
@app.route('/analyze', methods=['POST'])
def analyze_video():
    print("Request received at /analyze")  # Debug log
    print("Request content-type:", request.content_type)  # Debug log

    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    print("Video file received:", video.filename)  # Debug log

    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)
    print(f"Video file saved to: {video_path}")  # Debug log

    try:
        result = analyze_stress_fatigue_pupil(video_path)

        if 'error' in result:
            return jsonify({'error': result['error']}), 500

        # Prepare the data to save in Firestore
        data = {
            'result': result,  # Contains the analysis result
            'video_url': video_path,  # Save the local path or a URL if hosted
            'timestamp': firestore.SERVER_TIMESTAMP
        }

        # Save the data to Firestore under the 'eyevideo' collection
        doc_ref = db.collection('eyevideo').add(data)
        doc_id = doc_ref[1].id  # Extract the document ID

        # Return the result along with the video path and document ID
        return jsonify({'result': result, 'video_url': video_path, 'document_id': doc_id})

    except Exception as e:
        print(f"Error during processing: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)
            print("Video file deleted after processing")  # Debug log



@app.route('/analyze/<document_id>', methods=['GET'])
def get_results(document_id):
    try:
        # Fetch the results from Firestore based on the document_id
        results_ref = db.collection('eyevideo').document(document_id)
        results = results_ref.get()

        if results.exists:
            print(f"Document found with ID: {document_id}")  # Log the document ID
            return jsonify(results.to_dict()), 200
        else:
            print(f"Document with ID {document_id} not found.")  # Log missing document
            return jsonify({"error": "Document not found"}), 404
    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500
        

    #IT21319938
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
            "timestamp": timestamp
        })

        print(f"Prediction saved successfully for user {user_uid} at {timestamp}")

        # Return response
        return jsonify({
            "message": "Hair images processed and stored successfully!",
            "document_id": doc_ref.id,
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })

    except Exception as e:
        print(f"Error occurred: {str(e)}")  
        print(traceback.format_exc())  # Log detailed traceback
        return jsonify({"error": "An error occurred during processing. Please try again.", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
