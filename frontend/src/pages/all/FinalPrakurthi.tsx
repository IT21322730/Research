import React, { useEffect, useState } from "react";
import {
  IonHeader,
  IonPage,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/firebase"; // Firebase auth import
import "../css/FinalPrakurthi.css"; // Import CSS
import { useIonRouter } from "@ionic/react";

// Import Image
import finalImage from "../images/img_final.jpg"; // Adjust the path if needed

const FinalPrakurthi: React.FC = () => {
  const history = useHistory();
  const [finalPrakurthi, setFinalPrakurthi] = useState<string | null>(null);
  const [prakurthiDetails, setPrakurthiDetails] = useState<{ Face?: string; Eye?: string; Hair?: string; Nails?: string }>({});
  const [userUid, setUserUid] = useState<string | null>(null);
  const router = useIonRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        console.error("Error: User UID is missing.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userUid) return;

    const fetchFinalPrakurthi = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-final-prakriti?user_uid=${userUid}`);

        if (!response.ok) {
          throw new Error("Failed to fetch Final Prakurthi");
        }

        const data = await response.json();
        console.log("API Response:", data);

        setFinalPrakurthi(data.final_prakriti);
        setPrakurthiDetails(data.individual_predictions);
      } catch (error) {
        console.error("Error fetching Prakurthi:", error);
      }
    };

    fetchFinalPrakurthi();
  }, [userUid]);

  const handleNavigation = () => {
    let path = "";
    switch (finalPrakurthi) {
      case "Vata":
        path = "/app/vata-body";
        break;
      case "Pitta":
        path = "/app/pitta-body";
        break;
      case "Kapha":
        path = "/app/kapha-body";
        break;
      case "Vata-Pitta":
        path = "/app/vata-pitta-body";
        break;
      case "Pitta-Vata":
        path = "/app/vata-pitta-body";
        break;
      case "Pitta-Kapha":
          path = "/app/pitta-kapha-body";
          break;
      case "Kapha-Pitta":
          path = "/app/pitta-kapha-body";
          break;
      case "Vata-Kapha":
          path = "/app/vata-kapha-body";
          break;
      case "Kapha-Vata":
          path = "/app/vata-kapha-body";
          break;
      case "Vata-Pitta-Kapha":
          path = "/app/vata-pitta-kapha-body";
          break;
      case "Pitta-Vata-Kapha":
          path = "/app/vata-pitta-kapha-body";
          break;
      case "Kapha-Vata-Pitta":
          path = "/app/vata-pitta-kapha-body";
          break;
      default:
        alert("Unknown Prakurthi Type!");
        return;
    }
  
    console.log("Navigating to:", path);
    window.location.href = path; // Forces a full page reload
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>FINAL PRAKURTHI</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="final-prakurthi-page">
          <div className="final-prakurthi-container">
            {/* Image Display */}
            <div className="image-container">
              <img src={finalImage} alt="Final Prakurthi" className="prakurthi-image" />
            </div>

            <IonText>
              <h2><strong>Your Final Prakurthi is:</strong></h2>
              <h3 style={{ color: "#48D1CC", fontWeight: "bold" }}>{finalPrakurthi || "Loading..."}</h3>
            </IonText>

            <div className="prakurthi-details">
              <IonText>
                <p><strong>Face Prakurthi:</strong> {prakurthiDetails.Face || "Loading..."}</p>
                <p><strong>Eye Prakurthi:</strong> {prakurthiDetails.Eye || "Loading..."}</p>
                <p><strong>Hair Prakurthi:</strong> {prakurthiDetails.Hair || "Loading..."}</p>
                <p><strong>Nail Prakurthi:</strong> {prakurthiDetails.Nails || "Loading..."}</p>
              </IonText>
            </div>
          </div>
          <br />

          {/* Recommendation Link */}
          <p style={{ fontSize: "16px", fontFamily: "'Open Sans', sans-serif" }}>
            For recommendation?{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                handleNavigation(); // Call the function
              }} 
              style={{ 
                color: "#007bff", 
                textDecoration: "underline", 
                cursor: "pointer", 
                fontWeight: "bold" 
              }}
            >
              Click this
            </a>
          </p>


          {/* Button to navigate based on Final Prakurthi */}
          <button
            onClick={handleNavigation}
            style={{ 
              backgroundColor: "#48D1CC", 
              color: "black", 
              padding: "15px 20px", 
              borderRadius: "5px", 
              border: "none", 
              cursor: "pointer", 
              fontWeight: "bold", 
              width: "100%", 
              fontSize: "18px", /* Added font size */
              fontFamily: "'Open Sans', sans-serif" /* Added Font Style */
            }}
          >
            Update the Patient Details
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default FinalPrakurthi;
