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
    # Further increased sensitivity
    if gender == "male" and max_contour_area > 50 and 2 <= contour_count <= 200:
        return "Androgenetic Alopecia (Male)"

    if gender == "female" and max_contour_area > 150 and 2 <= contour_count <= 150:
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

        # Fetch solution for the texture
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
        elif 100 <= lux < 300:
            message = "✅ Good, but slightly dim."
        elif 300 <= lux <= 600:
            message = "✅✅ Optimal Lighting! Best for your analysis."
        elif 600 < lux <= 1000:
            message = "✅ Acceptable, but may cause glare."
        else:  # lux > 1000
            message = "❌ Overexposed! Reduce brightness."

        return jsonify({"lux": lux, "message": message})

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(debug=True)