import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { IonPage,IonSelect,IonSelectOption,IonBadge, IonIcon,IonContent, IonAccordionGroup, IonAccordion, IonItem, IonTitle, IonBackButton, IonButtons, IonToolbar, IonHeader, IonButton } from "@ionic/react";
import '../css/Step.css';  // Importing the CSS file
import { auth } from "../firebase/firebase";  // Use auth instead of getAuth
import { db, doc, getDoc } from "../firebase/firebase"; // Use db instead of getFirestore, getDocs instead of getDoc


const Step: React.FC = () => {
    const history = useHistory();
    const [accordionValue, setAccordionValue] = useState<string[]>(['first']);  // Default open 'first' accordion
    const [userUid, setUserUid] = useState<string | null>(null);
    const [userDocId, setUserDocId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the authenticated user's UID
        const fetchUser = () => {
            const user = auth.currentUser;
            if (user) {
                setUserUid(user.uid);
                getUserDocId(user.uid);
            } else {
                console.error("User not authenticated.");
            }
        };

        fetchUser();
    }, []);

    // Function to get user document ID from Firestore
    const getUserDocId = async (uid: string) => {
        try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                setUserDocId(userDoc.id);
            } else {
                console.error("User not found in Firestore.");
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
        }
    };

    const handleTakeFacePicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/face-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeEyePicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/eye-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeHairPicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/hair-pic'); // Navigate to the desired page
        window.location.reload();
    };
    const handleTakeNailPicture = () => {
        console.log('Open camera to take a picture');
        history.push('/app/nail-pic'); // Navigate to the desired page
        window.location.reload();
    };
    
    const handleTakePicture = async () => {
        if (!userUid) {
            alert("Error: User UID is missing.");
            return;
        }
    
        try {
            // Fetch Final Prakriti
            const response = await fetch(`http://127.0.0.1:5000/get-final-prakriti?user_uid=${userUid}`);
    
            if (!response.ok) {
                throw new Error("Failed to fetch final Prakriti.");
            }
    
            const data = await response.json();
            console.log("API Response:", data); // ✅ Check the API response
    
            // ✅ Ensure the correct condition for handling a tie
            if (data.final_prakriti === "Tie - Need Questionnaire Analysis") {
                alert("A tie was detected. Redirecting to the questionnaire...");
                history.replace("/app/question"); // 🔹 Ensures immediate navigation
                window.location.reload(); // 🔹 Force refresh
                return;
            }
    
            // ✅ If no tie, navigate to /app/final
            if (data.final_prakriti) {
                alert(`Final Prakriti: ${data.final_prakriti}`);
                history.push("/app/final");
                

            }
    
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        }
    };       
    

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/app/home" />
                </IonButtons>
                <IonTitle>PRAKURTHI ANALYSIS</IonTitle>
                <IonButtons slot="end">
                
          </IonButtons>
    
            </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonAccordionGroup value={accordionValue} onIonChange={(e) => setAccordionValue(e.detail.value)}>
                    {/* First Accordion: Face Prakurthi Analysis */}
                    <IonAccordion value="first">
                        <IonItem slot="header" color="light">
                            Step 01
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <h2 className='headline-name'>Face Prakurthi Analysis</h2>
                            <p className="justified-text">
                                This analysis helps to determine the Ayurvedic dosha types based on face characteristics. Please follow the instructions for capturing your face images for accurate analysis.
                            </p>
                            <h3 className="instructions-heading">Instructions:</h3>
                            <ul>
                                <li>Ensure good lighting and clean the camera lens.</li>
                                <li>Sit or stand comfortably, facing the camera.</li>
                                <li>Front View: Look straight into the camera and keep your face neutral and relaxed.</li>
                                <li>Left Side View: Turn your head slightly to the left, ensuring your profile is fully visible. Keep your eyes straight and relaxed.</li>
                                <li>Right Side View: Turn your head slightly to the right, ensuring your profile is fully visible. Keep your posture consistent.</li>
                                <li>Review the images for clarity before uploading.</li>
                            </ul>
                            <p style={{ color: "red", fontWeight: "bold", marginLeft: "20px", marginRight : "20px"}}>
                                Remember:To get the optimal result, maintain the optimal lux value
                            </p>
                            <button
                                style={{ 
                                    backgroundColor: '#48D1CC', 
                                    color: 'black',
                                    padding: "15px 20px", 
                                    borderRadius: "5px", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    width: "100%", 
                                    fontSize: "18px", /* Added font size */
                                    fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
                                onClick={handleTakeFacePicture}
                            >
                                Take Your Picture
                            </button>
                        </div>
                    </IonAccordion>

                    {/* Second Accordion */}
                    <IonAccordion value="second">
                        <IonItem slot="header" color="light">
                            Step 02
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <h2 className='headline-name'>Eye Prakurthi Analysis</h2>
                            <p className="justified-text">
                                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                                Please follow the instructions for capturing your eye images for accurate analysis.
                            </p>
                            <h3 className="instructions-heading">Instructions:</h3>
                            <ul>
                                <li>Ensure good lighting and clean the camera lens.</li>
                                <li>Sit or stand comfortably, facing the camera.</li>
                                <li>Focus on each eye separately, avoiding reflections and glare.</li>
                                <li>Take close-up photos of the right eye and left eye.</li>
                                <li>Review the images for clarity before uploading.</li>
                            </ul>                            
                            <p style={{ color: "red", fontWeight: "bold", marginLeft: "20px", marginRight : "20px"}}>
                                Remember:To get the optimal result, maintain the optimal lux value
                            </p>
                            <button
                                style={{ 
                                    backgroundColor: '#48D1CC', 
                                    color: 'black',
                                    padding: "15px 20px", 
                                    borderRadius: "5px", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    width: "100%", 
                                    fontSize: "18px", /* Added font size */
                                    fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
                                onClick={handleTakeEyePicture}
                            >
                                Take Your Picture
                            </button>
                        </div>
                    </IonAccordion>

                    <IonAccordion value="third">
                        <IonItem slot="header" color="light">
                            Step 03
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <h2 className='headline-name'>Hair Prakurthi Analysis</h2>
                            <p className="justified-text">
                                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                                Please follow the instructions for capturing your hair images for accurate analysis.
                            </p>
                            <h3 className="instructions-heading">Instructions:</h3>
                            <ul>
                                <li>Ensure good lighting and clean the camera lens.</li>
                                <li>Sit or stand comfortably, facing the camera.</li>
                                <li>Front Weave: Face the camera directly, showing your hairline clearly.</li>
                                <li>Back Weave: Turn around, ensuring the back of your head is visible.</li>
                                <li>Scalp: Part your hair to expose the scalp and take close-ups.</li>
                                <li>Review the images for clarity before uploading.</li>
                            </ul>
                            <p style={{ color: "red", fontWeight: "bold", marginLeft: "20px", marginRight : "20px"}}>
                                Remember:To get the optimal result, maintain the optimal lux value
                            </p>
                            <button
                                
                                style={{ 
                                    backgroundColor: '#48D1CC', 
                                    color: 'black',
                                    padding: "15px 20px", 
                                    borderRadius: "5px", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    width: "100%", 
                                    fontSize: "18px", /* Added font size */
                                    fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
                                onClick={handleTakeHairPicture}
                            >
                                Take Your Picture
                            </button>
                        </div>
                    </IonAccordion>

                    <IonAccordion value="fourth">
                        <IonItem slot="header" color="light">
                            Step 04
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <h2 className='headline-name'>Nail Prakurthi Analysis</h2>
                            <p className="justified-text">
                                This analysis helps to determine the Ayurvedic dosha types based on eye characteristics. 
                                Please follow the instructions for capturing your eye images for accurate analysis.
                            </p>
                            <h3 className="instructions-heading">Instructions:</h3>
                            <ul>
                                <li>Ensure good lighting and clean the camera lens.</li>
                                <li>Place your hand flat on a neutral background, keep your fingers relaxed, and take a photo from directly above, ensuring your whole hand is visible.</li>
                                <li>Hold your hand slightly clenched on a plain background with good lighting, and capture the top of your hand clearly showing the nails and fingertips.</li>
                            </ul>
                            <p style={{ color: "red", fontWeight: "bold", marginLeft: "20px", marginRight : "20px"}}>
                                Remember:To get the optimal result, maintain the optimal lux value
                            </p>
                            <button
                                style={{ 
                                    backgroundColor: '#48D1CC', 
                                    color: 'black',
                                    padding: "15px 20px", 
                                    borderRadius: "5px", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    width: "100%", 
                                    fontSize: "18px", /* Added font size */
                                    fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
                                onClick={handleTakeNailPicture}
                            >
                                Take Your Picture
                            </button>
                        </div>
                    </IonAccordion>

                    <IonAccordion value="fifth">
                    <IonItem slot="header" color="light">
                        Step 05
                    </IonItem>
                    <div className="ion-padding" slot="content">
                        <p className="justified-text">To complete the Prakriti Analysis, you must follow all five steps. First, capture images for Face, Eye, Hair, and Nail Analysis, ensuring proper lighting and clarity. Each step focuses on specific features that help determine your Ayurvedic body type. Finally, the system will analyze your data to identify your dominant dosha. If a tie is detected, you'll need to complete a questionnaire. Otherwise, your Final Prakriti Result will be displayed.</p>
                        <button
                                style={{ 
                                    backgroundColor: '#48D1CC', 
                                    color: 'black',
                                    padding: "15px 20px", 
                                    borderRadius: "5px", 
                                    border: "none", 
                                    cursor: "pointer", 
                                    fontWeight: "bold", 
                                    width: "100%", 
                                    fontSize: "18px", /* Added font size */
                                    fontFamily: "'Open Sans', sans-serif" /* Added Font Style */ }}
                                onClick={handleTakePicture}
                            >
                                Find the Final Prakurthi
                            </button>
                    </div>
                    </IonAccordion>

                </IonAccordionGroup>
            </IonContent>
        </IonPage>
    );
};

export default Step;
