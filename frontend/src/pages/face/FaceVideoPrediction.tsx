import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import img from "../images/img_05.png"; // Adjust the image path if needed

interface EmotionData {
  emotion: string;
  count: number;
}

const FaceVideoPrediction: React.FC = () => {
  const location = useLocation<{ emotion: string; count: number }>();
  const emotionData = location.state || { emotion: "No emotion", count: 0 };

  return (
    <IonPage>
      {/* Header with Back Button */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app" />
          </IonButtons>
          <IonTitle>Micro Expression Results</IonTitle>
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
            maxWidth: "400px",
            height: "95vh", // Adjusted height to cover the full page
            margin: "auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Image Display */}
          <img
            src={img}
            alt="Emotion Detection"
            style={{
              width: "100%",
              maxWidth: "270px",
              height: "auto",
              margin: "15px auto 10px",
              display: "block",
            }}
          />

          {/* Success Message */}
          <h2
            style={{
              fontSize: "20px",
              fontFamily: '"Open Sans", sans-serif',
              color: "green",
              marginBottom: "15px",
            }}
          >
            <b>Successful!</b>
            <br />
            Emotion Analysis Completed!
          </h2>

          {/* Emotion Detection Result */}
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Dominant Emotion:{" "}
            <span style={{ color: "rgb(72, 209, 204)" }}>{emotionData.emotion}</span>
          </p>

          <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
            Emotion Count: <span style={{ fontWeight: "normal" }}>{emotionData.count}</span>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FaceVideoPrediction;
