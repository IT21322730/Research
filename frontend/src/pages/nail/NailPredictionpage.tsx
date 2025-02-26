import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonText,
} from "@ionic/react";
import Reloader from "../all/Reloader";
import img from "../images/img_05.png";

interface PredictionState {
  predictionResult?: {
    final_prakriti: string;
    individual_predictions: string[];
  };
}

const NailPredictionPage: React.FC = () => {
  const location = useLocation<PredictionState | undefined>();
  const history = useHistory();
  const [predictionData, setPredictionData] = useState<PredictionState["predictionResult"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🛠 Location State:", location.state);
    console.log("🛠 Prediction Result:", location.state?.predictionResult);

    if (!location.state || !location.state.predictionResult) {
      console.error("No prediction data! Redirecting...");
      setError("No prediction data available.");
      setLoading(false);
      setTimeout(() => history.replace("/app/step"), 2000);
      return;
    }

    const { final_prakriti, individual_predictions } = location.state.predictionResult as any;

    setPredictionData({
      final_prakriti,
      individual_predictions,
    });

    setLoading(false);
  }, [location.state, history]);

  // Function to handle the redirect
  const handleRedirect = () => {
    history.push('/app/step');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>Nail Prakruti Prediction</IonTitle>
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
          {loading ? (
            <Reloader />
          ) : error ? (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : predictionData ? (
            <>
              <img
                src={img}
                alt="Nail Image"
                style={{
                  width: "100%",
                  maxWidth: "230px",
                  height: "auto",
                  margin: "20px auto",
                }}
              />
              <h2>
                <b>Successful!!!</b>
                <br />
                Nail Prakurthi analysis is done!
              </h2>
              <h3>Overall Result:</h3>
              <p style={{ fontWeight: "bold", fontSize: "25px" }}>
                {predictionData.final_prakriti}
              </p>
              <h3>Individual Image Predictions:</h3>
              {Array.isArray(predictionData.individual_predictions) &&
              predictionData.individual_predictions.length > 0 ? (
                <>
                  <p style={{ fontSize: "16px" }}>
                    Image 1: {predictionData.individual_predictions[0]}
                  </p>
                  <p style={{ fontSize: "16px" }}>
                    Image 2: {predictionData.individual_predictions[1]}
                  </p>
                </>
              ) : (
                <p>No individual predictions available.</p>
              )}
            </>
          ) : (
            <p>No prediction data found.</p>
          )}
          <button
                className="take-picture-button"
                style={{
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  fontFamily: '"Open Sans", sans-serif',
                  width: '350px',
                  height: '45px',
                  textAlign: 'center',
                  backgroundColor: 'rgb(72, 209, 204)',
                  color: 'black',
                  marginTop: '20px',
                  marginBottom: '5px',
                }}
                onClick={handleRedirect} // Trigger redirect on button click
              >
                Take the next step
              </button>
        </div>
        
      </IonContent>
    </IonPage>
  );
};

export default NailPredictionPage;