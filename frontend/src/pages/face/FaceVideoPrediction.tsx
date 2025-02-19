import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const FaceVideoPrediction: React.FC = () => {
  const location = useLocation();

  const data = location.state as {
    emotion_percentages?: Record<string, number>;
    message?: string;
    psychological_insights?: string[];
    recommendations?: string[];
  };

  console.log("Received Data:", data);

  const emotionPercentages = data?.emotion_percentages || {};
  const insights = data?.psychological_insights || [];
  const recommendations = data?.recommendations || [];
  const message = data?.message || "Emotion Analysis Completed!";
  const hasEmotions = Object.keys(emotionPercentages).length > 0;

  const chartData = {
    labels: Object.keys(emotionPercentages),
    datasets: [
      {
        label: "Emotion Intensity (%)",
        data: Object.values(emotionPercentages),
        backgroundColor: [
          "rgba(255, 87, 51, 0.7)", // Red (Anger)
          "rgba(51, 255, 87, 0.7)", // Green (Happiness)
          "rgba(51, 123, 255, 0.7)", // Blue (Fear)
          "rgba(240, 219, 79, 0.7)", // Yellow (Surprise)
          "rgba(155, 89, 182, 0.7)", // Purple (Sadness)
          "rgba(230, 126, 34, 0.7)", // Orange (Disgust)
          "rgba(26, 188, 156, 0.7)", // Cyan (Neutral)
        ],
        borderColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: [
          "#FF5733", "#33FF57", "#337BFF", "#F0DB4F", "#9B59B6", "#E67E22", "#1ABC9C"
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(200, 200, 200, 0.3)" },
        ticks: { color: "#333", font: { size: 14, weight: "bold" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#333", font: { size: 14, weight: "bold" } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, backgroundColor: "#333", titleColor: "#fff", bodyColor: "#fff" },
    },
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" />
          </IonButtons>
          <IonTitle>Micro Expression Results</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div
          style={{
            width: "95%",
            margin: "15px auto",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "25px",
            textAlign: "center",
            border: "2px solid #ddd",
          }}
        >
          {/* ✅ Message*/}
          <h2
            style={{
              fontSize: "25px",
              color: "rgb(72, 209, 204)",  // Turquoise color
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            {message}
          </h2>

          {/* ✅ Graph with Better Styling */}
          {hasEmotions ? (
            <div
              style={{
                width: "100%",
                height: "300px",
                margin: "auto",
                backgroundColor: "white",
                border: "2px solid #ddd", // Light gray border
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p style={{ fontSize: "16px", color: "gray" }}>No emotion data available.</p>
          )}

          {/* ✅ Psychological Insights Card with Light Purple Background */}
          {insights.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                backgroundColor: "#F5F5FF", // Light Purple (Lavender)
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <h3 style={{ fontSize: "18px", color: "#007bff" }}>Psychological Insights</h3>
              <ul style={{ paddingLeft: "15px" }}>
                {insights.map((insight, index) => (
                  <li key={index} style={{ fontSize: "16px", marginBottom: "5px" }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ✅ Recommendations */}
          {recommendations.length > 0 && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "left",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#e9f7ef",
              }}
            >
              <h3 style={{ fontSize: "18px", color: "#28a745" }}>Recommendations</h3>
              <ul style={{ paddingLeft: "20px" }}>
                {recommendations.map((rec, index) => (
                  <li key={index} style={{ fontSize: "16px", marginBottom: "5px" }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FaceVideoPrediction;
