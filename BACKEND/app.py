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
import mediapipe as mp
import time

#IT21324024
import uuid

# Initialize Flask app
app = Flask(__name__)

#IT21319488
UPLOAD_FOLDER = 'uploads'
#os.makedirs(UPLOAD_FOLDER, exist_ok=True)
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


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


#### Analyse Prakurthi ###

### MOdels ###
# Load the DL model for face images - IT21322730
facePrakrurthi_model = tf.keras.models.load_model('./model/FacePrakurthiFinal_CNN_Model.h5')
# Load the DL model for eye images - IT21319488
image_model = tf.keras.models.load_model('./model/Hybrid_CNN_Transformer_Model.h5')
# Load the DL model for hair images
hair_model = tf.keras.models.load_model('./model/Dataset4_CNN_Model.h5')
# Load the DL model for hair images - IT21324024
import tensorflow as tf
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




# Face Novelty
# Facial micro expression analysis
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
        final_emotion = analyze_video(video_path)  # Ensure the video_path is passed correctly here
        return jsonify({"dominant_emotion": final_emotion[0], "count": final_emotion[1]})
    
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

 




### Eye Novelty
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
def analyze_video():
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
        

    #IT21319938-- Hair Novelty



    #IT21324024 -- Nail Novelty
    
    
    
if __name__ == '__main__':
    app.run(debug=True)
