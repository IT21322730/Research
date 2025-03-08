import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonText
} from "@ionic/react";
import { useLocation, useHistory } from "react-router-dom";
import img from "../images/img_05.png"; // Adjust the path as needed

interface LocationState {
  prakrutiResult?: {
    final_prakriti: string;
    individual_predictions: string[];
  };
}

const FacePrakurthiPrediction: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const prakrutiData = location.state?.prakrutiResult || null;

  // Function to navigate to the next step
  const handleRedirect = () => {
    history.push("/app/step");
  };

  return (
    <IonPage>
      {/* Header with Back Button */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>FACE PRAKURTHI PREDICTION</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "white",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "380px",
            margin: "15px auto",
            textAlign: "center",
          }}
        >
          {prakrutiData ? (
            <>
              <img
                src={img}
                alt="Face Image"
                style={{
                  width: "100%",
                  maxWidth: "230px",
                  height: "auto",
                  margin: "20px auto",
                  display: "block",
                }}
              />
              <h2
                style={{
                  margin: "0",
                  padding: "5px",
                  fontSize: "20px",
                  fontFamily: '"Open Sans", sans-serif',
                  marginBottom: "15px",
                }}
              >
                <b>Successful!!!</b>
                <br />
                Face Prakurthi Analysis is Done!
              </h2>

              {/* Overall Result in One Line */}
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                Overall Result: <span style={{ color: "rgb(72, 209, 204)" }}>{prakrutiData.final_prakriti}</span>
              </p>

              {/* Individual Predictions */}
              <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
                Individual Image Predictions:
              </p>
              {prakrutiData.individual_predictions.map((prediction: string, index: number) => (
                <p key={index} style={{ fontSize: "16px", marginBottom: "5px" }}>
                  <b>Image {index + 1}:</b> {prediction}
                </p>
              ))}

              {/* Button to Proceed */}
              <button
                className="take-picture-button"
                style={{
                  fontWeight: "600",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "18px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  fontFamily: '"Open Sans", sans-serif',
                  width: "350px",
                  height: "45px",
                  textAlign: "center",
                  backgroundColor: "rgb(72, 209, 204)",
                  color: "black",
                  marginTop: "20px",
                  marginBottom: "5px",
                }}
                onClick={handleRedirect}
              >
                Take the next step
              </button>
            </>
          ) : (
            <IonText>
              <p>No prediction data available.</p>
            </IonText>
          )}


        </div>
      </IonContent>
    </IonPage>
  );
};

export default FacePrakurthiPrediction;
