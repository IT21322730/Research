import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Reloader from '../all/Reloader'; // Your existing component
import '../css/BlinkPrediction.css'; // Import the CSS file

Chart.register(...registerables); // Register Chart.js modules

interface PredictionParams {
  docId: string;
}

const BlinkPrediction: React.FC = () => {
  const { docId } = useParams<PredictionParams>();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!docId) {
      setError('No document ID provided.');
      setLoading(false);
      return;
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/analyze/${docId}`);
        const data = await response.json();

        if (response.ok) {
          setResult(data.result);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch result.');
        }
      } catch (error) {
        setError('An error occurred while fetching the result.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
    
  }, [docId]);

  // Define Chart Data
  const chartData = {
    labels: ['Fatigue Level', 'Stress Level'],
    datasets: [
      {
        label: 'Analysis Score',
        data: result
          ? [
              result.fatigue_level === 'Low Fatigue' ? 20 : result.fatigue_level === 'Medium Fatigue' ? 50 : 80,
              result.stress_level === 'Low Stress' ? 20 : result.stress_level === 'Medium Stress' ? 50 : 80,
            ]
          : [0, 0], // Default values before data loads
        backgroundColor: [
          '#4CAF50', // Green for Low Fatigue
          result?.stress_level === 'Medium Stress' ? '#FF5733' : '#FF5733', // Handle Medium Stress case
        ],
        borderColor: ['#388E3C', '#C70039'],
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/eye-video" />
          </IonButtons>
          <IonTitle>YOUR BLINK PREDICTION</IonTitle>
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
            margin: '15px auto',
            maxHeight: '3500px'
          }}
        >
          {loading ? (
            <Reloader />
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '0px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Stress Analysis</h2>
              <div style={{ maxWidth: '400px', margin: 'auto' }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                  height={210}
                />
              </div>

              <div className="color-coding">
                {/* Fatigue Level Section */}
                <div className="fatigue-level">
                  <p className="level-label" style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Fatigue Level
                  </p>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ color: '#4CAF50' }}>🟩</td>
                        <td>Low Fatigue</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#FFEB3B' }}>🟧</td>
                        <td>Medium Fatigue</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#F44336' }}>🟥</td>
                        <td>High Fatigue</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Stress Level Section */}
                <div className="stress-level">
                  <p className="level-label">Stress Level</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ color: '#4CAF50' }}>🟩</td>
                        <td>Low Stress</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#FF9800' }}>🟧</td>
                        <td>Medium Stress</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#F44336' }}>🟥</td>
                        <td>High Stress</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BlinkPrediction;
