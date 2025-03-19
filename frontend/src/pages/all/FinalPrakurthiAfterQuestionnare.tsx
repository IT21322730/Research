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
import { useLocation } from "react-router-dom";
// Import Image
import finalImage from "../images/img_final.jpg"; // Adjust the path if needed
import "../css/FinalPrakurthi.css"; // Import CSS
import { useHistory } from "react-router-dom";

interface LocationState {
    prakrutiResult?: {
        final_prakriti: string;
        individual_predictions: {
            Eye: string;
            Face: string;
            Hair: string;
            Nails: string;
            Questionnaire: string;
        };
        message: string;
    };
}

const FinalPrakurthiAfterQuestionnaire: React.FC = () => {
    const history = useHistory();
    const location = useLocation<LocationState>();
    const prakrutiData = location.state?.prakrutiResult || null;

    if (!prakrutiData) {
        return <h2>No data available. Please submit the questionnaire first.</h2>;
    }

    const handleNavigation = () => {
        let path = "";
        switch (prakrutiData.final_prakriti) {
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

                        {/* Prakurthi Result Display */}
                      
                        <h2><strong>Your Final Prakurthi is:</strong></h2>
                        <h3 style={{ color: "#48D1CC", fontWeight: "bold" }}>{prakrutiData.final_prakriti|| "Loading..."}</h3>
                        <div className="prakurthi-details">
                            <IonText>

                                <p><strong>Eye: </strong>{prakrutiData.individual_predictions.Eye || "Loading..."}</p>
                                <p><strong>Face: </strong>{prakrutiData.individual_predictions.Face || "Loading..."}</p>
                                <p><strong>Hair: </strong>{prakrutiData.individual_predictions.Hair || "Loading..."}</p>
                                <p><strong>Nails: </strong>{prakrutiData.individual_predictions.Nails || "Loading..."}</p>
                                <p><strong>Questionnaire: </strong>{prakrutiData.individual_predictions.Questionnaire || "Loading..."}</p>
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
                        onClick={() => history.push('/app/patient-info')} // Navigate on click
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

export default FinalPrakurthiAfterQuestionnaire;
