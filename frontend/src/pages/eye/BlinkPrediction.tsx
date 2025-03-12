import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Reloader from '../all/Reloader'; // Your existing component
import '../css/BlinkPrediction.css'; // Import the CSS file
import imgCold from '../images/img_11.jpg'; // Adjust the path as needed
import imgCucumber from '../images/img_13.jpg'; // Adjust the path as needed
import imgTea from '../images/img_12.jpg';
import imgRose from '../images/img_17.png';
import imgAlo from '../images/img_14.jpg';
import imgOmega from '../images/img_15.jpg';
import imgHy from '../images/img_18.jpg';
import imgPro from '../images/img_16.jpg';
import imgVi from '../images/img_10.jpg';

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
          result?.fatigue_level === 'Low Fatigue' ? '#4CAF50' : result?.fatigue_level === 'Medium Fatigue' ? '#CC5500' : '#F44336', // 🟩 Green, 🟧 Orange, 🟥 Red
          result?.stress_level === 'Low Stress' ? '#4CAF50' : result?.stress_level === 'Medium Stress' ? '#CC5500' : '#F44336', // 🟩 Green, 🟧 Orange, 🟥 Red
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
            <IonBackButton defaultHref="/app/blink" />
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
            maxHeight: '7130px'
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
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Stress and Fatigue Level Analysis</h2>
              <div style={{ maxWidth: '400px', margin: 'auto' }}>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      enabled: false, // Disables tooltips on hover
                    },
                    datalabels: {
                      display: false, // Hides the numbers inside the bars
                    },
                  },
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
                      <tr style={{ fontWeight: result?.fatigue_level === 'Low Fatigue' ? 'bold' : 'normal', backgroundColor: result?.fatigue_level === 'Low Fatigue' ? '#DFF2BF' : 'transparent' }}>
                        <td style={{ color: '#4CAF50' }}>🟩</td>
                        <td>Low Fatigue</td>
                      </tr>
                      <tr style={{ fontWeight: result?.fatigue_level === 'Medium Fatigue' ? 'bold' : 'normal', backgroundColor: result?.fatigue_level === 'Medium Fatigue' ? '#FFE699' : 'transparent' }}>
                        <td style={{ color: '#CC5500' }}>🟧</td>
                        <td>Medium Fatigue</td>
                      </tr>
                      <tr style={{ fontWeight: result?.fatigue_level === 'High Fatigue' ? 'bold' : 'normal', backgroundColor: result?.fatigue_level === 'High Fatigue' ? '#FFCCCC' : 'transparent' }}>
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
                      <tr style={{ fontWeight: result?.stress_level === 'Low Stress' ? 'bold' : 'normal', backgroundColor: result?.stress_level === 'Low Stress' ? '#DFF2BF' : 'transparent' }}>
                        <td style={{ color: '#4CAF50' }}>🟩</td>
                        <td>Low Stress</td>
                      </tr>
                      <tr style={{ fontWeight: result?.stress_level === 'Medium Stress' ? 'bold' : 'normal', backgroundColor: result?.stress_level === 'Medium Stress' ? '#FFE699' : 'transparent' }}>
                        <td style={{ color: '#CC5500' }}>🟧</td>
                        <td>Medium Stress</td>
                      </tr>
                      <tr style={{ fontWeight: result?.stress_level === 'High Stress' ? 'bold' : 'normal', backgroundColor: result?.stress_level === 'High Stress' ? '#FFCCCC' : 'transparent' }}>
                        <td style={{ color: '#F44336' }}>🟥</td>
                        <td>High Stress</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div><br/>
              
              <h1 className="page-title">Eye Stress & Fatigue Are Real! Here’s What You Can Do About It</h1>
              <div className="yoga-section">
                <h2>Yoga</h2>
                <h3>1. Palming</h3>
                <img 
                src="https://www.lenstore.co.uk/research/eye-yoga/img/card1.gif" 
                alt="Palming Exercise" 
                style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                />
                <h3>2. Blinking</h3>
                <img 
                src="https://www.lenstore.co.uk/research/eye-yoga/img/card2.gif" 
                alt="Palming Exercise" 
                style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                />
                <h3>3. Zooming</h3>
                <img 
                src="https://www.lenstore.co.uk/research/eye-yoga/img/card3.gif" 
                alt="Palming Exercise" 
                style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                />
                <h3>4. Figure of Eight</h3>
                <img 
                src="https://www.lenstore.co.uk/research/eye-yoga/img/card4.gif" 
                alt="Palming Exercise" 
                style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                />
                <h3>5. Eye Rolling</h3>
                <img 
                src="https://www.lenstore.co.uk/research/eye-yoga/img/card5.gif" 
                alt="Palming Exercise" 
                style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                />
              </div>
              
              <div className="home-remedies-section">
                <h2>Remedies</h2>
                <ul>
                  <li><strong>Cold Compress:</strong> Soak a clean cloth in cold water or wrap ice cubes in a towel.Place it over closed eyes for 10–15 minutes.Repeat as needed to reduce puffiness.</li>
                  <img
                    src={imgCold}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Cucumber Slices:</strong> Slice a fresh cucumber and refrigerate for 10–15 minutes.Place a slice over each closed eye for about 10 minutes.Repeat twice daily for a cooling effect.</li>
                  <img
                    src={imgCucumber}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Tea Bags:</strong> Steep two tea bags (green or black) in hot water for a few minutes.Let them cool down or refrigerate for 10 minutes.Place over closed eyes for 10–15 minutes to reduce swelling.</li>
                  <img
                    src={imgTea}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Rose Water:</strong> Acts as a natural eye toner.Soak cotton pads in pure rose water.Place them over your closed eyes for 10 minutes.Repeat daily to refresh and tone the eyes.</li>
                  <img
                    src={imgRose}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Aloe Vera:</strong> Extract fresh aloe vera gel and apply a thin layer under your eyes.Leave it on for 10–15 minutes before rinsing with cool water.Use daily for its anti-inflammatory benefits.</li>
                  <img
                    src={imgAlo}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Omega-3 Fatty Acids:</strong> Include flaxseeds, walnuts, and fish in your diet.You can also take omega-3 supplements after consulting a doctor.</li>
                  <img
                    src={imgOmega}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Hydration:</strong> Drink at least 8 glasses of water daily to keep your eyes and skin hydrated.Eat water-rich foods like watermelon and cucumber.</li>
                  <img
                    src={imgHy}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Proper Lighting:</strong> Use soft lighting while reading or using screens.Adjust screen brightness and take regular breaks to reduce eye strain.</li>
                  <img
                    src={imgPro}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                  <li><strong>Vitamins:</strong> Eat vitamin-rich foods like carrots (Vitamin A), citrus fruits (Vitamin C), nuts (Vitamin E), and spinach (Zinc).Consider multivitamin supplements if needed, after consulting a healthcare provider.</li>
                  <img
                    src={imgVi}
                    alt="Palming Exercise"
                    style={{ maxWidth: "100%", height: "auto", display: "block", marginTop: "10px" }}
                  /><br/>
                </ul>
                <br/></div>

            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BlinkPrediction;
