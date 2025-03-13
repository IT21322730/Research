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
from flask_cors import cross_origin
import sys
import time
import uuid
from skimage import feature


# Initialize Flask app
app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8100"]}})

#IT21319488
UPLOAD_FOLDER = 'uploads'
#os.makedirs(UPLOAD_FOLDER, exist_ok=True)
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Firebase setup
cred = credentials.Certificate('D:\\Backend\\serviceAccountKey.json')
initialize_app(cred)
db = firestore.client()

# Ensure the uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Load the ML model for face images
facePrakrurthi_model = tf.keras.models.load_model('./model/FacePrakurthiFinal_CNN_Model.h5')
# Load the DL model for eye images - IT21319488
image_model = tf.keras.models.load_model('./model/Hybrid_CNN_Transformer_Model.h5')
# Load the DL model for hair images
hair_model = tf.keras.models.load_model('./model/Dataset4_CNN_Model.h5')
# Load the DL model for nail images - IT21324024
nail_model = tf.keras.models.load_model('./model/Nails.h5')

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

#IT21322730 - Face Prakurthi
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


#IT21319488 -  Eye prakurthi
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
    

#IT21319938 - Hair Prakurthi
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
        

#IT21324024 - Nail Prakurthi
def preprocess_image(image_data, target_size=(150, 150)):
    try:
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize(target_size)
        image_array = np.array(image) / 255.0
        return np.expand_dims(image_array, axis=0)
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None

def get_overall_prediction(prediction1, prediction2):
    return prediction1  # Example logic

@app.route('/nailpredict', methods=['POST'])
def process_nail_images():
    try:
        data = request.json
        image_list = [data.get('image_data1'), data.get('image_data2')]
        user_uid = data.get("user_uid")  # Firebase Auth UID (same for patient/doctor)
        
        if not all(image_list) or not user_uid:
            return jsonify({"error": "Both images and user UID are required"}), 400

        print(f"Received {len(image_list)} images for user UID: {user_uid}")

        predictions = []
        for image_base64 in image_list:
            padding_needed = len(image_base64) % 4
            if padding_needed != 0:
                image_base64 += "=" * (4 - padding_needed)

            image_data = base64.b64decode(image_base64.split(",")[1] if "," in image_base64 else image_base64)
            image = Image.open(io.BytesIO(image_data)).convert("RGB")
            image = image.resize((150, 150))

            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)

            prediction = nail_model.predict(image_array)
            predicted_class = np.argmax(prediction, axis=1)[0]
            predictions.append(prediction_mapping.get(predicted_class, "Unknown"))

        overall_result = get_overall_prediction(predictions[0], predictions[1])

        user_ref = db.collection("users").document(user_uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_doc_id = user_doc.id

        local_tz = pytz.timezone('Asia/Colombo')
        utc_now = datetime.utcnow()
        local_time = utc_now.replace(tzinfo=pytz.utc).astimezone(local_tz)
        timestamp = local_time.strftime('%Y-%m-%d %H:%M:%S')

        doc_ref = db.collection("nails").document()
        doc_ref.set({
            "uuid": user_uid,
            "user_id": user_doc_id,
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })

        print(f"Prediction saved successfully for user {user_uid} at {timestamp}")

        return jsonify({
            "message": "Nail images processed and stored successfully!",
            "document_id": doc_ref.id,
            "individual_predictions": predictions,
            "final_prakriti": overall_result,
            "timestamp": timestamp
        })
    
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "An error occurred during processing. Please try again.", "details": str(e)}), 500  
    


#Final Prakurthi Identification
def determine_final_prakriti(individual_predictions):
    # Count occurrences of each full combination
    combination_counts = Counter(individual_predictions.values())

    # Get the most common combination(s)
    most_common = combination_counts.most_common()
    
    # If there's a single most frequent combination, return it
    if len(most_common) == 1 or most_common[0][1] > most_common[1][1]:
        return most_common[0][0]  # Return the most frequent Prakriti combination
    
    # If there is a tie, apply the tie-breaking logic
    scores = {"Vata": 0, "Pitta": 0, "Kapha": 0}
    
    # Count occurrences of each dosha within tied components
    for prakriti in combination_counts.keys():
        for dosha in prakriti.split("-"):  # Split if it's a combination like "Vata-Pitta"
            scores[dosha] += combination_counts[prakriti]

    # Now use the logic from determine_prakriti to resolve the tie
    return determine_prakriti(scores)

# Logic to break the tie properly
def determine_prakriti(scores):
    # If all three scores are equal, return Tri-doshic
    if scores["Vata"] == scores["Pitta"] == scores["Kapha"]:
        return "Tri-doshic (Vata-Pitta-Kapha)"
    
    # Sort scores by value in descending order
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    # If the top two scores are equal, return them as a tie (sorted order)
    if sorted_scores[0][1] == sorted_scores[1][1]:
        return "-".join(sorted([sorted_scores[0][0], sorted_scores[1][0]]))
    
    # Return the single dominant Prakriti
    return sorted_scores[0][0]


@app.route('/get-final-prakriti', methods=['GET'])
def get_final_prakriti():
    try:
        user_uid = request.args.get("user_uid")
        if not user_uid:
            return jsonify({"error": "Missing required parameter: user_uid"}), 400

        try:
            face_doc = db.collection("face_predictions").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
            eye_doc = db.collection("eye").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
            hair_doc = db.collection("hair_predictions").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
            nail_doc = db.collection("nails").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        except Exception as e:
            return jsonify({"error": "Firestore query error", "details": str(e)}), 500

        predictions = {}

        if face_doc and len(face_doc) > 0:
            face_result = face_doc[0].to_dict().get("final_prakriti")
            if face_result:
                predictions["Face"] = face_result

        if eye_doc and len(eye_doc) > 0:
            eye_result = eye_doc[0].to_dict().get("prediction")
            if eye_result:
                predictions["Eye"] = eye_result

        if hair_doc and len(hair_doc) > 0:
            hair_result = hair_doc[0].to_dict().get("final_prakriti")
            if hair_result:
                predictions["Hair"] = hair_result

        if nail_doc and len(nail_doc) > 0:
            nail_result = nail_doc[0].to_dict().get("final_prakriti")
            if nail_result:
                predictions["Nails"] = nail_result

        if not predictions:
            return jsonify({"error": "No predictions found for the given user UID"}), 404

        print(f"Predictions: {predictions}")

        final_prakriti = determine_final_prakriti(predictions)

        if final_prakriti == "Tie":
            # Fetch questionnaire result before returning tie response
            questionnaire_doc = db.collection("questionnaire").document(user_uid).get()
            
            if questionnaire_doc.exists:
                questionnaire_data = questionnaire_doc.to_dict()
                questionnaire_prakriti = questionnaire_data.get("final_prakriti")

                if questionnaire_prakriti:
                    predictions["Questionnaire"] = questionnaire_prakriti
                    final_prakriti = determine_final_prakriti(predictions)

                    # Save Final Prakriti to Firestore only after resolving tie
                    save_final_prakriti_to_firestore(user_uid, final_prakriti, predictions, "Component + Questionnaire")

                    return jsonify({
                        "message": "Final Prakriti determined after questionnaire.",
                        "user_uid": user_uid,
                        "individual_predictions": predictions,
                        "final_prakriti": final_prakriti,
                        "source": "Component + Questionnaire"
                    }), 200

            return jsonify({
                "message": "Tie detected. Please fill the questionnaire.",
                "user_uid": user_uid,
                "individual_predictions": predictions,
                "next_step": "Fill the questionnaire",
                "questions": questions
            }), 200

        # Save Final Prakriti to Firestore only if no tie
        save_final_prakriti_to_firestore(user_uid, final_prakriti, predictions, "Component Analysis")

        return jsonify({
            "message": "Final Prakriti determined successfully!",
            "user_uid": user_uid,
            "individual_predictions": predictions,
            "final_prakriti": final_prakriti,
            "source": "Component Analysis"
        }), 200

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "An error occurred while retrieving final Prakriti.", "details": str(e)}), 500


def save_final_prakriti_to_firestore(user_uid, final_prakriti, individual_predictions, source):
    """
    Saves the final Prakriti result along with individual predictions, timestamp, and source in Firestore.
    """
    try:
        doc_ref = db.collection("final_prakriti_results").document()  # Auto-generate document ID
        doc_ref.set({
            "final_prakriti": final_prakriti,
            "individual_predictions": individual_predictions,
            "message": "Final Prakriti determined successfully!",
            "source": source,
            "user_uid": user_uid,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        print(f"Final Prakriti saved successfully for user {user_uid} with document ID {doc_ref.id}")
    except Exception as e:
        print(f"Error saving final Prakriti: {str(e)}")


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

@app.route("/submit-questionnaire", methods=["POST"])
def submit_questionnaire():
    try:
        data = request.get_json()
        if not data or "answers" not in data or "user_uid" not in data:
            return jsonify({"error": "Invalid data. 'user_uid' and 'answers' are required."}), 400

        user_uid = data["user_uid"]
        answers = data["answers"]

        if len(answers) != len(questions):
            return jsonify({"error": f"Expected {len(questions)} answers but received {len(answers)}."}), 400

        scores = Counter()

        for index, answer in enumerate(answers):
            prakriti = questions[index]["options"].get(answer)
            if prakriti:
                scores[prakriti] += 1
            else:
                return jsonify({"error": f"Invalid answer {answer} for question {index + 1}"}), 400

        questionnaire_prakriti = determine_prakriti(scores)

        db.collection("questionnaire").document(user_uid).set({
            "final_prakriti": questionnaire_prakriti,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return get_final_prakriti_after_questionnaire(user_uid)

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while processing the questionnaire.", "details": str(e)}), 500

def get_final_prakriti_after_questionnaire(user_uid):
    try:
        face_doc = db.collection("face_predictions").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        eye_doc = db.collection("eye").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        hair_doc = db.collection("hair_predictions").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        nail_doc = db.collection("nails").where("uuid", "==", user_uid).order_by("timestamp", direction=firestore.Query.DESCENDING).limit(1).get()
        questionnaire_doc = db.collection("questionnaire").document(user_uid).get()

        predictions = {}

        if face_doc and len(face_doc) > 0:
            predictions["Face"] = face_doc[0].to_dict().get("final_prakriti")

        if eye_doc and len(eye_doc) > 0:
            predictions["Eye"] = eye_doc[0].to_dict().get("prediction")

        if hair_doc and len(hair_doc) > 0:
            predictions["Hair"] = hair_doc[0].to_dict().get("final_prakriti")

        if nail_doc and len(nail_doc) > 0:
            predictions["Nails"] = nail_doc[0].to_dict().get("final_prakriti")

        if questionnaire_doc.exists:
            predictions["Questionnaire"] = questionnaire_doc.to_dict().get("final_prakriti")

        if not predictions:
            return jsonify({"error": "No predictions found for the given user UID"}), 404

        print(f"Updated Predictions After Questionnaire: {predictions}")

        final_prakriti = determine_final_prakriti(predictions)

        return jsonify({
            "message": "Final Prakriti determined successfully after questionnaire submission!",
            "user_uid": user_uid,
            "individual_predictions": predictions,
            "final_prakriti": final_prakriti,
            "source": "Component + Questionnaire"
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "An error occurred while analyzing final Prakriti.", "details": str(e)}), 500


### Patient creation and update
@app.route('/patients/<patient_id>', methods=['GET', 'PUT'])
def handle_patient(patient_id):
    if request.method == 'GET':
        doc_ref = db.collection('patients').document(patient_id)
        doc = doc_ref.get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({'error': 'Patient not found'}), 404

    elif request.method == 'PUT':
        data = request.json
        doc_ref = db.collection('patients').document(patient_id)
        doc_ref.update(data)
        return jsonify({'success': True}), 200
        

@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """Update an existing patient."""
    data = request.json
    patient_ref = db.collection('patients').document(patient_id)

    if not patient_ref.get().exists:
        return jsonify({'error': 'Patient not found'}), 404

    patient_ref.update(data)
    return jsonify({'message': 'Patient updated'}), 200    



#### Novelties ####

### IT21322730 - Face Novelties ###

### Face mapping analysis

# Initialize MediaPipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True)

# 🔹 **Define TCM Facial Regions (Landmark Indexes)**
TCM_ZONES = {
    "Kidney Health": [33, 133, 168, 158],  
    "Liver Health": [10, 109, 67, 103],  
    "Heart Health": [1, 2, 97, 164],  
    "Lung Health": [50, 280, 206, 425],  
    "Digestive Health": [2, 97, 164, 18, 17],  
    "Hormonal Health": [17, 57, 185, 201],  
    "Spleen Health": [120, 121, 234, 454],  
    "Bladder Health": [9, 107, 66, 105],  
    "Gallbladder Health": [127, 234, 454, 356]  
}

# 🔹 **Symptom Weights**
SYMPTOM_WEIGHTS = {
    "redness": 20,
    "brightness": 15,
    "acne": 25,
    "oiliness": 15,
    "dark_circles": 15,
    "wrinkles": 10,
    "pores": 10,
    "lip_color": 10
}

# 🔹 **Function to Analyze the Face for TCM Mapping**
def analyze_face(image_path, user_uid):
    image = cv2.imread(image_path)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_image)

    if not results.multi_face_landmarks:
        return {"error": "No face detected."}

    detected_issues = {}
    diagnosis_percentages = {region: 0 for region in TCM_ZONES}

    for face_landmarks in results.multi_face_landmarks:
        for region, landmarks in TCM_ZONES.items():
            # Get landmark positions for this region
            region_pixels = [(int(face_landmarks.landmark[idx].x * image.shape[1]), 
                              int(face_landmarks.landmark[idx].y * image.shape[0])) for idx in landmarks]

            # Extract ROI (Region of Interest)
            mask = np.zeros(image.shape[:2], dtype=np.uint8)
            cv2.fillPoly(mask, [np.array(region_pixels)], 255)
            roi = cv2.bitwise_and(image, image, mask=mask)

            # Convert to HSV and Grayscale
            hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
            grayscale = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

            # 🔹 **Feature Analysis**
            redness_score = np.count_nonzero(cv2.inRange(hsv, np.array([0, 120, 70]), np.array([10, 255, 255])))
            brightness_score = np.mean(grayscale)
            acne_score = np.count_nonzero(cv2.Canny(cv2.GaussianBlur(grayscale, (5, 5), 0), 50, 150))
            oiliness_score = np.count_nonzero(cv2.inRange(hsv, np.array([0, 50, 200]), np.array([180, 255, 255])))
            dark_circle_score = np.mean(grayscale[:10])
            wrinkle_score = np.count_nonzero(cv2.Canny(grayscale, 30, 100))
            pores_score = np.var(grayscale)
            lip_color_score = np.count_nonzero(cv2.inRange(hsv, np.array([160, 100, 50]), np.array([180, 255, 255])))

            # Normalize scores (convert to 0-100%)
            max_score = 10000
            redness_percentage = (redness_score / max_score) * 100
            brightness_percentage = (brightness_score / 255) * 100
            acne_percentage = (acne_score / max_score) * 100
            oiliness_percentage = (oiliness_score / max_score) * 100
            dark_circles_percentage = (dark_circle_score / 255) * 100
            wrinkles_percentage = (wrinkle_score / max_score) * 100
            pores_percentage = (pores_score / 500) * 100  # Adjusted for variance
            lip_color_percentage = (lip_color_score / max_score) * 100

            # 🔹 **Determine Health Issues**
            symptoms = []
            if redness_percentage > 70:
                symptoms.append("Redness detected (Possible inflammation or circulation issue).")
            if brightness_percentage > 75:
                symptoms.append("High brightness detected (Possible dryness or dull skin).")
            if acne_percentage > 80:
                symptoms.append("Acne/blemishes detected (Possible hormonal or digestive issue).")
            if oiliness_percentage > 70:
                symptoms.append("Oily skin detected (Possible liver or hormonal imbalance).")
            if dark_circles_percentage < 20:
                symptoms.append("Dark circles detected (Possible kidney issues or stress).")
            if wrinkles_percentage > 50:
                symptoms.append("Wrinkles detected (Possible aging, stress, or dehydration).")
            if pores_percentage > 60:
                symptoms.append("Large pores detected (Possible toxin buildup or poor skin health).")
            if lip_color_percentage < 30:
                symptoms.append("Pale lips detected (Possible digestive or spleen-related issues).")

            # Calculate overall issue percentage
            issue_percentage = (
                redness_percentage * SYMPTOM_WEIGHTS["redness"] +
                brightness_percentage * SYMPTOM_WEIGHTS["brightness"] +
                acne_percentage * SYMPTOM_WEIGHTS["acne"] +
                oiliness_percentage * SYMPTOM_WEIGHTS["oiliness"] +
                dark_circles_percentage * SYMPTOM_WEIGHTS["dark_circles"] +
                wrinkles_percentage * SYMPTOM_WEIGHTS["wrinkles"] +
                pores_percentage * SYMPTOM_WEIGHTS["pores"] +
                lip_color_percentage * SYMPTOM_WEIGHTS["lip_color"]
            ) / sum(SYMPTOM_WEIGHTS.values())

            diagnosis_percentages[region] = round(issue_percentage, 2)

            if symptoms:
                detected_issues[region] = symptoms

    if not detected_issues:
        detected_issues["Healthy"] = ["No significant facial abnormalities detected."]

    # ✅ Generate Recommendations
    recommendations = generate_face_mapping_recommendations(diagnosis_percentages)

    # ✅ Save to Firestore
    doc_id, timestamp = save_to_face_mapping_firestore(user_uid, diagnosis_percentages, recommendations)

    return {
        "message": "Face mapping analysis is completed!!!",
        "doc_id": doc_id,
        "diagnosis_percentages": diagnosis_percentages,
        "recommendations": recommendations,
        "timestamp": timestamp
    }



 # 🔹 **Generate Recommendations Based on Diagnosis**
def generate_face_mapping_recommendations(diagnosis_percentages):
    recs = {}

    for region, percentage in diagnosis_percentages.items():
        if percentage > 70:
            recs[region] = {
                "general": f"Consider medical consultation for {region}."
            }
            continue  
        elif percentage > 50:
            recs[region] = {
                "general": f"Monitor your {region} health and maintain a balanced diet.",
                "methods": []
            }
        elif percentage > 30:
            recs[region] = {
                "general": f"Maintain a healthy lifestyle to prevent {region} issues.",
                "methods": []
            }
        else:
            continue  

        # **Add specific methods separately for each range**
        if "Kidney" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Increase water intake to flush out toxins.",
                    "Consume potassium-rich foods like bananas and sweet potatoes.",
                    "Avoid high sodium and processed foods."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Stay hydrated and drink enough water.",
                    "Limit caffeine and alcohol intake.",
                    "Include antioxidant-rich foods like berries."
                ])

        if "Liver" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Reduce alcohol and fatty food consumption.",
                    "Increase intake of detoxifying foods like garlic and turmeric.",
                    "Exercise regularly to support liver function."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Eat leafy greens and fiber-rich foods.",
                    "Avoid excessive sugar and processed food.",
                    "Drink lemon water to aid digestion."
                ])

        if "Heart" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Engage in cardiovascular exercises like walking or jogging.",
                    "Reduce saturated fat intake and consume heart-friendly foods.",
                    "Monitor blood pressure and cholesterol levels."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Maintain a balanced diet with omega-3-rich foods.",
                    "Stay active and manage stress through meditation.",
                    "Limit processed and salty foods."
                ])

        if "Lung" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Avoid polluted environments and smoke exposure.",
                    "Practice deep breathing exercises for lung capacity.",
                    "Consume vitamin C and antioxidant-rich foods."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Engage in breathing exercises daily.",
                    "Keep indoor air quality clean with ventilation.",
                    "Drink herbal teas to soothe the lungs."
                ])

        if "Digestive" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Eat probiotic-rich foods like yogurt and kimchi.",
                    "Reduce processed foods and increase fiber intake.",
                    "Avoid eating late at night for better digestion."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Drink plenty of water to aid digestion.",
                    "Consume fiber-rich foods such as oats and beans.",
                    "Include ginger or peppermint tea for digestion support."
                ])

        if "Hormonal" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Avoid endocrine-disrupting chemicals found in plastics.",
                    "Include omega-3 fatty acids for hormonal balance.",
                    "Reduce stress through yoga or meditation."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Maintain a well-balanced diet with healthy fats.",
                    "Get sufficient sleep to regulate hormone levels.",
                    "Avoid excessive caffeine and sugar."
                ])

        if "Spleen" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Consume spleen-friendly foods like pumpkin and squash.",
                    "Avoid excessive sugar and alcohol.",
                    "Engage in mild physical activity like walking."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Eat warm, easily digestible foods.",
                    "Avoid raw and cold foods to support spleen function.",
                    "Reduce dairy and processed foods."
                ])

        if "Bladder" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Drink more water to prevent infections.",
                    "Avoid carbonated and caffeinated drinks.",
                    "Maintain proper hygiene to avoid irritation."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Stay hydrated and drink cranberry juice.",
                    "Limit spicy foods that can irritate the bladder.",
                    "Practice bladder-friendly habits like regular urination."
                ])

        if "Gallbladder" in region:
            if percentage > 50:
                recs[region]["methods"].extend([
                    "Increase intake of bile-supportive foods like beets and apples.",
                    "Reduce cholesterol-heavy foods to prevent gallstones.",
                    "Consult a doctor if experiencing persistent digestive issues."
                ])
            elif percentage > 30:
                recs[region]["methods"].extend([
                    "Eat fiber-rich foods to support gallbladder function.",
                    "Avoid processed and high-fat foods.",
                    "Maintain a healthy weight through diet and exercise."
                ])

    # ✅ If no recommendations were generated, add a default healthy message
    if not recs:
        recs["general"] = {
            "general": "Your facial mapping analysis looks good. Keep up a healthy routine."
        }

    return recs  



# 🔹 **Save Data to Firestore**
def save_to_face_mapping_firestore(user_uid, diagnosis_percentages, recommendations):
    try:
        local_tz = pytz.timezone('Asia/Colombo')
        utc_now = datetime.utcnow()
        local_time = utc_now.replace(tzinfo=pytz.utc).astimezone(local_tz)
        timestamp = local_time.strftime('%Y-%m-%d %H:%M:%S')

        doc_ref = db.collection("face_analysis").document()
        doc_ref.set({
            "uuid": user_uid,
            "diagnosis_percentages": diagnosis_percentages,
            "recommendations": recommendations,
            "timestamp": timestamp
        })

        return doc_ref.id, timestamp

    except Exception as e:
        print(f"Error saving to Firestore: {str(e)}")
        return None, None


# 🔹 **Flask API Endpoint**
@app.route('/analyze-face-mapping', methods=['POST'])
def analyze_face_endpoint():
    if 'image' not in request.files or 'user_uid' not in request.form:
        return jsonify({"error": "Missing image file or user UID"}), 400

    image = request.files['image']
    user_uid = request.form['user_uid']

    image_path = os.path.join("uploads", image.filename)
    image.save(image_path)

    # Process the face mapping
    result = analyze_face(image_path, user_uid)

    # Clean up the uploaded image
    if os.path.exists(image_path):
        os.remove(image_path)

    return jsonify(result)


### Micro expression analysis

# **Function to analyze the video and return psychological insights**
def analyze_face_video(video_path, user_uid):
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
    doc_id, timestamp = save_to_micro_expressions_firestore(user_uid, emotion_percentages, psychological_insights, recommendations)

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
def save_to_micro_expressions_firestore(user_uid, emotion_percentages, psychological_insights, recommendations):
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
    print("Received request files:", request.files)
    print("Received request form:", request.form)
    
    if 'video' not in request.files:
        return jsonify({"error": "Missing video file"}), 400

    if 'user_uid' not in request.form:
        return jsonify({"error": "Missing user UID"}), 400

    video = request.files['video']
    user_uid = request.form['user_uid']

    if video.filename == '':
        return jsonify({"error": "No file selected"}), 400

    video_path = os.path.join("uploads", video.filename)
    video.save(video_path)

    try:
        # Process the video
        result = analyze_face_video(video_path, user_uid)

    except Exception as e:
        print(f"Error processing video: {str(e)}")
        result = {"error": "Internal server error"}

    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

    return jsonify(result)




### IT21319488 - Eye Novelty ###

### Blinking rate and eye movement analysis

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Eye landmarks for Mediapipe Face Mesh
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
LEFT_IRIS = [474, 475, 476, 477]
RIGHT_IRIS = [469, 470, 471, 472]

BLINK_THRESHOLD = 0.2  
BLINK_CONSEC_FRAMES = 3  

def eye_aspect_ratio(landmarks, eye_points):
    """Calculate Eye Aspect Ratio (EAR) to detect blinks."""
    A = np.linalg.norm(landmarks[eye_points[1]] - landmarks[eye_points[5]])
    B = np.linalg.norm(landmarks[eye_points[2]] - landmarks[eye_points[4]])
    C = np.linalg.norm(landmarks[eye_points[0]] - landmarks[eye_points[3]])
    return (A + B) / (2.0 * C)

def analyze_stress_fatigue_pupil(video_source):
    try:
        cap = cv2.VideoCapture(video_source)
        if not cap.isOpened():
            return {"error": "Cannot open video"}

        blink_count = 0
        blink_start_time = time.time()
        closed_eye_frames = 0
        total_movement = 0
        movement_count = 0
        previous_left_iris = None
        previous_right_iris = None

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)

            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    landmark_points = np.array([
                        (int(face_landmarks.landmark[i].x * w), int(face_landmarks.landmark[i].y * h)) 
                        for i in range(468)
                    ])

                    left_ear = eye_aspect_ratio(landmark_points, LEFT_EYE)
                    right_ear = eye_aspect_ratio(landmark_points, RIGHT_EYE)
                    avg_ear = (left_ear + right_ear) / 2.0

                    if avg_ear < BLINK_THRESHOLD:
                        closed_eye_frames += 1
                    else:
                        if closed_eye_frames >= BLINK_CONSEC_FRAMES:
                            blink_count += 1
                            closed_eye_frames = 0

                    left_iris = np.mean([(face_landmarks.landmark[i].x * w, face_landmarks.landmark[i].y * h) for i in LEFT_IRIS], axis=0)
                    right_iris = np.mean([(face_landmarks.landmark[i].x * w, face_landmarks.landmark[i].y * h) for i in RIGHT_IRIS], axis=0)

                    if previous_left_iris is not None and previous_right_iris is not None:
                        left_movement = np.linalg.norm(np.array(left_iris) - np.array(previous_left_iris))
                        right_movement = np.linalg.norm(np.array(right_iris) - np.array(previous_right_iris))

                        eye_movement = (left_movement + right_movement) / 2.0
                        total_movement += eye_movement
                        movement_count += 1

                    previous_left_iris = left_iris
                    previous_right_iris = right_iris

        cap.release()

        elapsed_time = time.time() - blink_start_time
        blink_rate = (blink_count / elapsed_time) * 60 if elapsed_time > 0 else 0
        avg_movement = total_movement / movement_count if movement_count > 0 else 0

        fatigue_level = "Low Fatigue" if avg_movement < 2 else "Medium Fatigue" if 2 <= avg_movement <= 10 else "High Fatigue"
        stress_level = "Low Stress" if blink_rate < 15 else "Medium Stress" if 15 <= blink_rate <= 25 else "High Stress"

        return {
            'blink_count': blink_count,
            'blinking_rate': blink_rate,
            'fatigue_level': fatigue_level,
            'stress_level': stress_level
        }

    except Exception as e:
        return {"error": str(e)}

@app.route('/analyze', methods=['POST'])
def analyze_eye_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video = request.files['video']
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video.filename)
    video.save(video_path)

    try:
        result = analyze_stress_fatigue_pupil(video_path)
        if 'error' in result:
            return jsonify({'error': result['error']}), 500

        data = {
            'result': result,
            'video_url': video_path,
            'timestamp': firestore.SERVER_TIMESTAMP
        }

        doc_ref = db.collection('eyevideo').add(data)
        doc_id = doc_ref[1].id

        return jsonify({'result': result, 'video_url': video_path, 'document_id': doc_id})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(video_path):
            os.remove(video_path)


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
        

### IT21319938-- Hair Novelty ###

### Paterend alopecia analysis and texture based diagnosis

# Alopecia mapping and solutions
alopecia_mapping = [
    "Androgenetic Alopecia (Male)", "Androgenetic Alopecia (Female)", "Telogen Effluvium",
    "Hypothyroidism", "PCOS", "Nutritional Deficiency (General)", "Nutritional Deficiencies (Iron Deficiency)",
    "Nutritional Deficiencies (Zinc Deficiency)", "Nutritional Deficiencies (Vitamin D Deficiency)",
    "Nutritional Deficiencies (Protein Deficiency)", "Nutritional Deficiencies (Biotin Deficiency)",
    "Anagen Effluvium", "Early Signs of Hair Loss"
]

disease_solutions = {
    "Androgenetic Alopecia (Male)": {
        "message": "A diet rich in biotin, iron, omega-3s, and zinc can support hair health. Reducing stress through yoga, meditation, or deep breathing may help prevent further shedding. Additionally, avoid harsh treatments like excessive heat styling or chemical applications, as these can weaken hair further."
    },
    "Androgenetic Alopecia (Female)": {
        "message": "A diet rich in iron, zinc, and vitamin D supports hair follicle health. Stress reduction techniques like meditation and breathing exercises can help, as stress may worsen the condition. It’s also important to use gentle, sulfate-free shampoos and avoid tight hairstyles to prevent additional hair loss."
    },
    "Early Signs of Hair Loss": {
    "message": " A nutrient-rich diet with iron, zinc, biotin, and vitamin D supports healthy hair. Avoiding chemical treatments, excessive heat, and harsh styling methods. Managing stress through yoga, meditation, or breathing exercises may reduce further hair loss. Regular scalp massages and using gentle hair care products can also promote blood circulation and strengthen hair follicles."
    },

    "Telogen Effluvium": {
        "message": "Nutritional support with iron, zinc, and protein can help restore hair growth. Stress reduction techniques such as meditation, yoga, or deep breathing can prevent further shedding. Using gentle shampoos and avoiding tight hairstyles or harsh chemical treatments can also support scalp health."
    },
    "Hypothyroidism": {
        "message": " A balanced diet rich in selenium, iron, and iodine can support thyroid function and hair regrowth. Regular exercise can help improve metabolism and overall health. Stress management techniques like meditation or yoga are beneficial for hormonal balance. Regular monitoring and check-ups with an endocrinologist are essential for tracking thyroid levels"
    },
    "PCOS": {
        "message": "It can be managed with hormonal treatments, such as birth control pills or anti-androgens. A low-glycemic diet can help balance insulin levels and reduce excess androgens, which contribute to hair loss. Regular exercise supports hormone regulation and overall well-being. Reducing stress through meditation or yoga can help minimize hair loss. "
    },
    "Nutritional Deficiency (General)": {
        "message": "A well-balanced diet rich in iron, zinc, biotin, protein, and vitamin D is essential for preventing hair loss due to nutritional deficiencies. Hydration is also crucial for scalp health. Taking a multivitamin or specific supplements can help address deficiencies."
    },
    "Nutritional Deficiency (Iron Deficiency)": {
        "message": "can be treated with iron supplements, preferably taken with vitamin C for better absorption. Eating iron-rich foods like spinach, red meat, and lentils can help restore levels naturally. Avoiding tea and coffee with meals is important, as they can inhibit iron absorption. Regular blood tests can track iron levels and ensure proper supplementation. "
    },
    "Nutritional Deficiency (Zinc Deficiency)": {
        "message": "Reducing alcohol consumption is essential, as it can interfere with zinc absorption. Maintaining a balanced diet with various nutrients supports overall hair health. Regular blood tests help ensure adequate zinc levels. "
    },
    "Nutritional Deficiency (Vitamin D Deficiency)": {
        "message": "Regular sun exposure (15-30 minutes daily) can help the body naturally produce vitamin D. Including fatty fish, fortified dairy, and egg yolks in your diet supports optimal levels. Regular blood tests can track vitamin D levels, ensuring proper supplementation."
    },
    "Nutritional Deficiency (Protein Deficiency)": {
        "message": "Increasing intake of protein-rich foods like eggs, lean meats, tofu, and dairy can support hair regrowth. If dietary intake is insufficient, protein supplements like shakes or bars may help. Maintaining a balanced diet ensures overall health and hair vitality. Staying hydrated is essential for scalp health."
    },
    "Nutritional Deficiency (Biotin Deficiency)": {
        "message": "Taking biotin supplements or consuming biotin-rich foods like eggs, almonds, and sweet potatoes can support hair health. Avoiding smoking and excessive alcohol intake is essential, as they can interfere with biotin absorption. Drinking plenty of water helps maintain scalp hydration."
    },
    "Anagen Effluvium": {
        "message": "Use mild, sulfate-free shampoos and avoid harsh chemical treatments to protect the scalp and promote a healthy environment for hair regrowth.Wearing wigs, scarves, or hairpieces can provide confidence and coverage while waiting for natural hair regrowth."
    },
    "No significant hair loss detected": {
        "message": "No significant hair loss detected. Regular hair care and nutrition may improve overall hair health."
    },

    # Hair Texture Solutions
    "Fine Texture": {
        "message": "Use lightweight, volumizing shampoos and avoid heavy conditioners that can make hair flat. Use light oils like argan or grapeseed oil instead of thick butters. Eating protein, iron, and vitamin B12 can help strengthen fine hair. Avoid too much heat styling and use dry shampoo to control oil."
    },
    "Medium Texture": {
        "message": "Use a moisturizing shampoo that is not too heavy, and apply conditioner only to the middle and ends of your hair. Jojoba or almond oil can add shine without making hair greasy. Deep condition every 1-2 weeks and always use a heat protectant before styling. A diet with biotin, zinc, and omega-3s helps keep hair healthy."
    },
    "Coarse Texture": {
        "message": "Keep hair hydrated with sulfate-free shampoos and deep condition weekly to avoid dryness and frizz. Use heavier oils like coconut oil and shea butter to retain moisture. Reduce heat styling and sleep on a silk pillowcase to prevent friction. Eating foods rich in vitamin E, omega-6, and water (like cucumbers and watermelon) helps hair stay strong and flexible."
    }

}
def detect_alopecia(image, gender="unknown"):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, binary = cv2.threshold(gray, 80, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour_areas = [cv2.contourArea(cnt) for cnt in contours]

    if not contours:
        return "No significant hair loss detected"

    max_contour_area = max(contour_areas) if contour_areas else 0
    total_contour_area = sum(contour_areas)
    contour_count = len(contours)

    if contour_count > 5 and total_contour_area < 3000:
        return "Early Signs of Hair Loss"
    if gender == "male" and max_contour_area > 500 and 2 <= contour_count <= 70:
        return "Androgenetic Alopecia (Male)"
    if gender == "female" and max_contour_area > 1000 and 2 <= contour_count <= 50:
        return "Androgenetic Alopecia (Female)"
    if contour_count > 20 and total_contour_area < 8000:
        return "Telogen Effluvium"
    if 20 <= contour_count <= 50 and total_contour_area < 15000:
        return "Hypothyroidism"
    if contour_count > 20 and total_contour_area < 7000:
        return "PCOS"
    if 5 <= contour_count <= 30 and total_contour_area < 8000:
        return "Nutritional Deficiency (General)"
    if contour_count > 15 and max_contour_area < 1000:
        return "Nutritional Deficiency (Iron Deficiency)"
    if contour_count > 15 and max_contour_area < 1000:
        return "Nutritional Deficiency (Zinc Deficiency)"
    if contour_count > 15 and total_contour_area < 6000:
        return "Nutritional Deficiency (Vitamin D Deficiency)"
    if contour_count > 15 and total_contour_area < 5000:
        return "Nutritional Deficiency (Protein Deficiency)"
    if contour_count > 15 and total_contour_area < 4000:
        return "Nutritional Deficiency (Biotin Deficiency)"
    if contour_count > 15 and max_contour_area < 1000:
        return "Anagen Effluvium"
    
    return "No significant hair loss detected"



def analyze_hair_texture(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 100, 200)
    edge_density = np.sum(edges) / edges.size

    if edge_density < 0.2:
        return "Fine Texture"
    elif edge_density < 0.5:
        return "Medium Texture"
    else:
        return "Coarse Texture"

def calculate_illness_percentages(alopecia_diagnoses):
    illness_counts = Counter(alopecia_diagnoses)
    
    # Exclude "No significant hair loss detected" if other conditions exist
    if len(illness_counts) > 1 and "No significant hair loss detected" in illness_counts:
        del illness_counts["No significant hair loss detected"]

    total_valid_diagnoses = sum(illness_counts.values())
    illness_percentages = {illness: round((count / total_valid_diagnoses) * 100, 2) for illness, count in illness_counts.items()}
    
    return illness_percentages
@app.route('/novelty-function', methods=['POST'])
def novelty_function():
    try:
        data = request.json
        image_list = data.get("image_data")
        user_uid = data.get("user_uid")
        gender = data.get("gender", "unknown")
        
        if not image_list or len(image_list) != 4 or not user_uid:
            return jsonify({"error": "Missing required data (images or user UID)"}), 400

        alopecia_diagnoses = []
        texture_diagnoses = []
 
        for image_base64 in image_list:
            image_base64 = image_base64.split(",")[1] if "," in image_base64 else image_base64
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data)).convert("RGB").resize((128, 128))
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

            alopecia_diagnoses.append(detect_alopecia(opencv_image, gender))
            texture_diagnoses.append(analyze_hair_texture(opencv_image))

        illness_percentages = calculate_illness_percentages(alopecia_diagnoses)

        # Remove "No significant hair loss detected" if there are other conditions
        if len(illness_percentages) > 1 and "No significant hair loss detected" in illness_percentages:
            del illness_percentages["No significant hair loss detected"]

        # Choose the highest percentage illness
        if illness_percentages:
            final_alopecia = max(illness_percentages, key=illness_percentages.get)  
        else:
            final_alopecia = "No significant hair loss detected"

        final_texture = Counter(texture_diagnoses).most_common(1)[0][0]

        # Force AA Male if it's likely misclassified
        if "Nutritional Deficiency (General)" in final_alopecia and gender == "male":
            final_alopecia = "Androgenetic Alopecia (Male)"

        solution = disease_solutions.get(final_alopecia, {"message": "Solution not available"})
        texture_solution = disease_solutions.get(final_texture, {"message": "Solution not available"})

        user_ref = db.collection("users").document(user_uid)
        user_doc = user_ref.get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        local_tz = pytz.timezone('Asia/Kolkata')
        timestamp = datetime.now(local_tz).strftime('%Y-%m-%d %H:%M:%S')

        doc_ref = db.collection("hairalophecia").document()
        result_data = {
            "uuid": user_uid,
            "user_id": user_doc.id,
            "diagnosis": final_alopecia,
            "hair_texture": final_texture,
            "timestamp": timestamp,
            "solution": solution["message"],
            "texture_solution": texture_solution["message"],
            "illness_percentages": illness_percentages
        }
        doc_ref.set(result_data)

        return jsonify({
            "final_diagnosis": final_alopecia,
            "hair_texture": final_texture,
            "illness_percentages": illness_percentages,
            "solution": solution["message"],
            "texture_solution": texture_solution["message"],
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



### IT21324024 - Nail Novelty ###
### Capillary refil time analysis
# Function to calculate the average color intensity of the nail region
def get_color_intensity(frame, roi):
    nail_region = frame[roi[1]:roi[3], roi[0]:roi[2]]
    hsv = cv2.cvtColor(nail_region, cv2.COLOR_BGR2HSV)
    intensity = np.mean(hsv[:, :, 2])  # Use V channel for brightness
    return intensity

# Function to monitor CRT based on color intensity change
def track_crt(video_path, roi):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None

    intensities = []
    frame_timestamps = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        timestamp = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0  # Convert to seconds
        intensity = get_color_intensity(frame, roi)
        
        intensities.append(intensity)
        frame_timestamps.append(timestamp)
    
    cap.release()

    if len(intensities) < 2:
        return None  # Not enough data to analyze

    # Normalize intensity values
    intensities = np.array(intensities)
    intensities = (intensities - intensities.min()) / (intensities.max() - intensities.min())

    # Detect recovery time (CRT)
    initial_drop_index = np.argmax(np.diff(intensities) < -0.05)  # Find initial intensity drop
    recovery_index = np.argmax(intensities[initial_drop_index:] > 0.85) + initial_drop_index  # Find recovery time

    if recovery_index <= initial_drop_index:
        return None  # No valid recovery detected

    crt_time = frame_timestamps[recovery_index] - frame_timestamps[initial_drop_index]
    return round(crt_time, 2)

# Function to determine vascular efficiency and circulatory health in percentages
def get_health_insights(crt_duration):
    if crt_duration < 2:
        vascular_efficiency = "90%"  # 90% efficiency
        circulatory_health = "95%"  # 95% circulatory health
        recommendation = [
        "Maintain a balanced diet rich in iron and vitamin C.",
        "Stay hydrated to support optimal blood circulation.",
        "Engage in regular exercise to sustain excellent vascular efficiency."]
    elif 2 <= crt_duration < 3:
        vascular_efficiency = "70%"  # 70% efficiency
        circulatory_health = "75%"  # 75% circulatory health
        recommendation = [
            "Increase daily physical activity such as walking or jogging.",
            "Monitor blood pressure regularly and reduce sodium intake.",
            "Incorporate heart-healthy foods like nuts, fish, and leafy greens."
        ]
    else:
        vascular_efficiency = "50%"  # 50% efficiency
        circulatory_health = "55%"  # 55% circulatory health
        recommendation = [
             "Consult a healthcare provider for further cardiovascular assessment.",
            "Avoid smoking and limit alcohol consumption to improve circulation.",
            "Consider stress management techniques like meditation or yoga."
        ]
    
    return vascular_efficiency, circulatory_health, recommendation

@app.route('/crt-analysis', methods=['POST'])
def analyze_crt():
    if 'video' in request.files:
        video_file = request.files['video']
        video_path = os.path.join("uploads", video_file.filename)
        
        try:
            video_file.save(video_path)
        except Exception as e:
            return jsonify({"error": f"Error saving video: {str(e)}"}), 500
        
        roi = (100, 100, 300, 200)  # Adjust based on your video
        
        try:
            crt_time = track_crt(video_path, roi)
            if crt_time is None:
                return jsonify({"error": "CRT analysis failed, unable to determine CRT duration."}), 500

            vascular_efficiency, circulatory_health, recommendation = get_health_insights(crt_time)
            
            local_tz = pytz.timezone('Asia/Colombo')
            timestamp = datetime.now(local_tz).strftime('%Y-%m-%d %H:%M:%S')
            
            doc_ref = db.collection("crt_results").document()
            doc_ref.set({
                "crt_duration": crt_time,
                "vascular_efficiency": vascular_efficiency,
                "circulatory_health": circulatory_health,
                "recommendation": recommendation,
                "timestamp": timestamp
            })
            
            return jsonify({
                "message": "CRT Analysis Successfully Completed!!!",
                "crt_duration": crt_time,
                "vascular_efficiency": vascular_efficiency,
                "circulatory_health": circulatory_health,
                "recommendation": recommendation,
                "timestamp": timestamp
            })
        except Exception as e:
            return jsonify({"error": f"Error processing video: {str(e)}"}), 500
        
        finally:
            if os.path.exists(video_path):
                os.remove(video_path)
    else:
        return jsonify({"error": "No video file found"}), 400



# Lux Value Detector
@app.route('/analyze-light', methods=['POST'])
def analyze_light():
    try:
        data = request.get_json()
        lux = data.get("lux")

        if lux is None:
            return jsonify({"error": "Missing lux value"}), 400

        # Process Lux Values for Micro-Expression Analysis
        if lux < 100:
            message = "❌ Too Dark! Increase lighting."
        elif 100 <= lux < 400:
            message = "✅ Good, but slightly dim."
        elif 400 <= lux <= 600:
            message = "✅✅ Optimal Lighting! Best for your analysis."
        elif 600 < lux <= 1000:
            message = "✅ Acceptable, but may cause glare."
        else:  # lux > 1000
            message = "❌ Overexposed! Reduce brightness."

        return jsonify({"lux": lux, "message": message})

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500



    
    
if __name__ == '__main__':
    app.run(debug=True)
