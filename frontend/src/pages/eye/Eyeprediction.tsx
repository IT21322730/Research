import React, { useEffect, useState } from 'react';
import { useParams , useHistory} from 'react-router-dom';
import { IonPage, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import Reloader from '../all/Reloader'; // Import Reloader component
import img from '../images/img_05.png'; // Adjust the path as needed

interface PredictionParams {
  docId: string;
}

const PredictionPage: React.FC = () => {
  const history = useHistory();
  const { docId } = useParams<PredictionParams>(); // Retrieve docId from route params
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state for prediction

  useEffect(() => {
    if (!docId) {
      console.error("docId is undefined or missing in URL");
      setError('No document ID provided.');
      setLoading(false); // End loading as there's no docId
      return;
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true); // Start loading before making the API request
        const response = await fetch(`https://192.168.1.100:5000/process-firebase-image/${docId}`);
        const data = await response.json();

        if (response.ok) {
          setPrediction(data.prediction); // Set prediction data
          setError(null); // Clear previous errors if request is successful
        } else {
          setError(data.error || 'Failed to fetch prediction.');
        }
      } catch (error) {
        setError('An error occurred while fetching the prediction.');
      } finally {
        setLoading(false); // Set loading to false when the fetch is complete
      }
    };

    fetchPrediction();
  }, [docId]);

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
          <IonTitle>EYE PRAKURTHI PREDICTION</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '380px',
            margin: '20px auto',

          }}
        >
          {loading ? (
            <Reloader />
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <img
                src={img}
                alt="Eye Image"
                style={{
                  width: '100%',
                  maxWidth: '230px',
                  height: 'auto',
                  margin: '20px auto',
                  display: 'block',
                }}
              /><br/>
              <h2
                style={{
                  margin: '0',
                  padding: '5px',
                  fontSize: '28px',
                  fontFamily: '"Open Sans", sans-serif',
                  marginBottom: '15px',
                }}
              >
                <b>Successful!!!</b><br />Eye prakurthi analysis is done!
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '10px' }}>{prediction}</p><br/>
              <button
                className="take-picture-button"
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
                onClick={handleRedirect} // Trigger redirect on button click
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

export default PredictionPage;
