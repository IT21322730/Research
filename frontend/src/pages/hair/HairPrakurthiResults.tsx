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
import Reloader from "../all/Reloader"; // Import Reloader component
import img from '../images/img_05.png'; // Updated image path

interface LocationState {
  prakrutiResult?: {
    final_prakriti: string;
    timestamp: string;
    individual_predictions: string[];
  };
}

const HairPrakruthiResults: React.FC = () => {
  const location = useLocation<LocationState>();
  const history = useHistory();
  const prakrutiData = location.state?.prakrutiResult || null;
  const [loading, setLoading] = useState<boolean>(false); // Add loading state for prediction
  const [error, setError] = useState<string | null>(null); // Handle errors

  useEffect(() => {
    // Simulate loading behavior
    setLoading(true);
    if (!prakrutiData) {
      setError("No prediction data available.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [prakrutiData]);

  const handleRedirect = () => {
    history.push("/app/step"); // Redirect to another page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>HAIR PRAKURTHI PREDICTION</IonTitle>
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
          }}
        >
          {loading ? (
            <Reloader />
          ) : error ? (
            <div style={{ color: "red", textAlign: "center" }}>
              <p>{error}</p>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <img
                src={img}
                alt="Hair Image"
                style={{
                  width: "100%",
                  maxWidth: "230px",
                  height: "auto",
                  margin: "20px auto",
                  display: "block",
                }}
              />
              {/* <h2
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

                Hair prakurthi analysis is done!
              </h2>

              {prakrutiData ? (
                <div>
                  <h3>Overall Result:</h3>
                  <p style={{ fontWeight: 'bold', fontSize: '25px' }}>{prakrutiData.final_prakriti}</p>

                  <h3>Individual Image Predictions:</h3>

                  {prakrutiData?.individual_predictions?.length ? (
                    prakrutiData.individual_predictions.map((prediction: string, index: number) => (
                      <p style={{ fontSize: '16px' }} key={index}>Image {index + 1}: {prediction}</p>
                    ))
                  ) : (
                    <p style={{ fontSize: '16px', color: 'gray' }}>No individual predictions available.</p>
                  )}

                </div>
              ) : (
                <IonText>No prediction data available.</IonText>
              )} */}

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
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HairPrakruthiResults;