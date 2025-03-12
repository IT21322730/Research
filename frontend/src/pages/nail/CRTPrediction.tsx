import React, { useEffect, useState } from "react";
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
} from "@ionic/react"; // Correct import
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Reloader from "../all/Reloader";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// Define expected data structure
interface CRTData {
  circulatory_health?: string | number;
  vascular_efficiency?: string | number;
  crt_duration?: string | number;
  recommendation?: string[];
  message?: string;
}

const CRTPrediction: React.FC = () => {
  const location = useLocation<CRTData | undefined>();
  const history = useHistory();
  const [chartData, setChartData] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<string[]>([]);
  const [crtDuration, setCrtDuration] = useState<string | number>('N/A');
  const [message, setMessage] = useState<string>('No message available');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🛠 Location State:", location.state);

    if (!location.state) {
      console.error("🚨 No CRT data! Redirecting...");
      setError("No CRT data available.");
      setLoading(false);
      setTimeout(() => history.replace("/app/home"), 2000);
      return;
    }

    // Extract CRT data
    const data: CRTData = location.state;

    // Convert percentage strings to numbers
    const circulatoryHealth = data.circulatory_health ? parseInt(data.circulatory_health.toString().replace('%', '')) : 50;
    const vascularEfficiency = data.vascular_efficiency ? parseInt(data.vascular_efficiency.toString().replace('%', '')) : 50;

    // Set state values for the chart and recommendations
    setChartData({
      labels: ['Circulatory Health', 'Vascular Efficiency'], // Multi-line labels
      datasets: [
        {
          data: [circulatoryHealth, vascularEfficiency],
          backgroundColor: ['rgba(86, 66, 135, 0.8)', 'rgba(255, 99, 132, 0.8)'],
          borderColor: ['rgb(110, 75, 192)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    });

    setRecommendation(data.recommendation ?? ['No recommendation available', 'No recommendation available', 'No recommendation available']);
    setCrtDuration(data.crt_duration ?? 'N/A');
    setMessage(data.message ?? 'No message available');

    setLoading(false);
  }, [location.state, history]);

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows full control over height
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Vascular Efficiency & Circulatory Health',
        padding: { bottom: 30 },
        font: { size: 18, weight: 'bold' },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value: number) => `${value}%`,
        font: { weight: 'bold', size: 14 },
        color: '#000',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Keeps scale at 100
        ticks: {
          stepSize: 25, // Shows 0, 25, 50, 75, 100
          callback: (value: number) => `${value}%`,
        },
        grid: { drawBorder: false, color: "rgba(0, 0, 0, 0.1)" }, // Light grid lines
      },
      x: {
        ticks: { font: { size: 14, weight: 'bold' }, },
        grid: { display: false },
      },
    },
    elements: {
      bar: {
        barThickness: 40, // Increase the bar width here (default is 60)
        categoryPercentage: 0.9, // Adjusts the spacing between bars
        barPercentage: 0.8, // Adjusts how bars fill the category widthh
      },
    },
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>CRT PREDICTION RESULTS</IonTitle>
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
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          ) : (
            <>
              {/* Success Message at the Top */}
              <IonText style={{ color: "turquoise", fontWeight: "bold", fontSize: "22px", display: "block", marginBottom: "10px", textAlign: "center", }}>
                {message}
              </IonText>

              {/* CRT Duration Above the Chart */}
              <IonText style={{ color: "blue", fontWeight: "bold", fontSize: "16px", display: "block", textAlign: "left", marginBottom: "5px" }}>
                CRT Duration: {crtDuration} minutes
              </IonText>

              {/* Bar Chart Card */}
              <div
                style={{
                  width: "100%",
                  height: "350px",
                  background: "#fff",
                  padding: "20px 30px 20px 10px",
                  borderRadius: "10px",
                  marginTop: "20px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {chartData && <Bar data={chartData} options={chartOptions} height={200} width={400} />}
              </div>

              {/* Recommendation Section */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#BFEFFF",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                <h3>Recommendations</h3>
                <ul>
                  {recommendation.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </IonContent>

    </IonPage>
  );
};

export default CRTPrediction;