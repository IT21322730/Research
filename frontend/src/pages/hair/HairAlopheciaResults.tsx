import React from "react";
import { useLocation } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonItem,
  IonList,
} from "@ionic/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define the expected type of state data
interface LocationState {
  final_diagnosis?: string;
  hair_texture?: string;
  solution?: string;
  illness_percentages?: { [key: string]: number }; // Mapping illness names to percentages
}

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

const HairAlopeciaResults: React.FC = () => {
  const location = useLocation<LocationState>();

  // Extract data from location state
  const finalDiagnosis = location.state?.final_diagnosis ?? "No diagnosis found.";
  const hairTexture = location.state?.hair_texture ?? "No texture found.";
  const solution = location.state?.solution ?? "Solution not available.";
  const illnessPercentages = location.state?.illness_percentages ?? {};

  // Prepare chart data
  const chartData = Object.entries(illnessPercentages).map(([name, value]) => ({
    name: name.trim(),
    value: Number(value) || 0,
  }));

  console.log("Chart Data for Pie Chart:", chartData);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ backgroundColor: "#48D1CC" }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/step" />
          </IonButtons>
          <IonTitle>HAIR DIAGNOSIS RESULTS</IonTitle>
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
            margin: "20px auto",
            textAlign: "center",
          }}
        >
          {/* <IonCard>
            <IonCardContent> */}
          <IonList>
            <IonItem lines="none">
              <IonLabel>
                <h3 style={{ fontSize: '1.3rem' }}>
                  Final Diagnosis: <strong>{finalDiagnosis}</strong>
                </h3>
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <h3 style={{ fontSize: '1.0rem' }}>
                  Hair Texture: {hairTexture}</h3>
              </IonLabel>
            </IonItem>
          </IonList>
          {/* </IonCardContent>
          </IonCard> */}

          {/* Pie Chart for Illness Percentages */}
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px", color: "#555" }}>
              No data available for illness percentages.
            </p>
          )}


          {/* <IonCard style={{ backgroundColor: "#e3ed1a" }}>  
            <IonCardHeader>
              <IonCardTitle><strong>Solution</strong></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel>
                <p>{solution}</p>
              </IonLabel>
            </IonCardContent>
          </IonCard> */}

          <IonCard style={{ backgroundColor: "#48D1CC" }}>
            <IonCardHeader>
              <IonCardTitle><strong>Recommendations</strong></IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonLabel>
                <ul style={{ paddingLeft: '20px' }}>
                  {solution.split('.').map((item, index) => (
                    item.trim() && (
                      <li key={index} style={{ textAlign: 'justify' }}>
                        {item.trim()}.
                      </li>
                    )
                  ))}
                </ul>
              </IonLabel>
            </IonCardContent>
          </IonCard>



        </div>
      </IonContent>
    </IonPage>
  );
};

export default HairAlopeciaResults;