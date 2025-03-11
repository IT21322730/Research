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
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const FaceMappingPrediction: React.FC = () => {
    const location = useLocation();

    const data = location.state as {
        diagnosis_percentages?: Record<string, number>;
        message?: string;
        recommendations?: {
            general?: string;
        };
    };

    console.log("Received Data:", data);
    console.log("Debugging Recommendations Data:", data.recommendations);

    const diagnosisPercentages = data?.diagnosis_percentages || {};
    const recommendations =
        typeof data?.recommendations?.general === "object"
            ? data.recommendations.general.general
            : data?.recommendations?.general || "";
    const message = data?.message || "Face Mapping Analysis Completed!";
    const hasDiagnosisData = Object.keys(diagnosisPercentages).length > 0;

    // ✅ Prepare Pie Chart Data
    const chartData = {
        labels: Object.keys(diagnosisPercentages),
        datasets: [
            {
                data: Object.values(diagnosisPercentages).map((val) => val.toFixed(2)), // ✅ Convert to percentage format
                backgroundColor: [
                    "#FF5733", "#33FF57", "#337BFF", "#FFD700", "#9B59B6",
                    "#E67E22", "#1ABC9C", "#FF69B4", "#8A2BE2"
                ],
                borderColor: "rgba(255, 255, 255, 0.9)",
                borderWidth: 2,
                hoverBackgroundColor: [
                    "#FF3300", "#28FF28", "#0033FF", "#FFC300", "#8E44AD",
                    "#D35400", "#16A085", "#FF1493", "#6A0DAD"
                ],
            },
        ],
    };

    // ✅ Adjust Chart Options for Better Label Readability
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 5,
                bottom: 5,
            },
        },
        plugins: {
            legend: {
                display: false, // ✅ Custom labels below
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => {
                        const value = tooltipItem.raw;
                        return `${value}%`; // ✅ Show percentage in tooltip
                    },
                },
            },
        },
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/app/face-mapping-pic" />
                    </IonButtons>
                    <IonTitle>FACE MAPPING RESULTS</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <div
                    style={{
                        width: "95%",
                        maxWidth: "850px",
                        margin: "15px auto",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                        padding: "30px",
                        textAlign: "center",
                        border: "2px solid #ddd",
                    }}
                >
                    {/* ✅ Message */}
                    <h2
                        style={{
                            fontSize: "25px",
                            color: "rgb(72, 209, 204)", // Turquoise color
                            marginTop: "2px",
                            marginBottom: "15px",
                            fontWeight: "bold",
                        }}
                    >
                        {message}
                    </h2>

                    {/* ✅ Insights Message */}
                    {hasDiagnosisData && (
                        <p
                            style={{
                                fontSize: "16px",
                                color: "#555",
                                marginBottom: "15px",
                            }}
                        >
                            Get a glance of your internal health issues...
                        </p>
                    )}

                    {/* ✅ Pie Chart & Labels Inside One Card */}
                    {hasDiagnosisData ? (
                        <div
                            style={{
                                width: "100%",
                                height: "500px",
                                margin: "auto",
                                backgroundColor: "white",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                padding: "5px",
                                boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* ✅ Add Margin to Chart */}
                            <div style={{ marginTop: "0px", width: "80%", height: "300px" }}>
                                <Pie data={chartData} options={chartOptions} />
                            </div>

                            {/* ✅ Custom Two-Column Labels (Inside Chart Card) */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)", // ✅ Two columns inside card
                                    gap: "10px",
                                    justifyContent: "center",
                                    marginTop: "10px", // ✅ Spaced properly under the chart
                                }}
                            >
                                {Object.keys(diagnosisPercentages).map((label, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "10px", // ✅ Increased label size
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                backgroundColor: chartData.datasets[0].backgroundColor[index],
                                                marginRight: "10px",
                                            }}
                                        ></div>
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p style={{ fontSize: "16px", color: "gray" }}>
                            No diagnosis data available.
                        </p>
                    )}

                    {/* ✅ Spacing Before Recommendations */}
                    <div style={{ height: "20px" }} />

                    {/* ✅ Recommendations */}
                    {recommendations && (
                        <div
                            style={{
                                marginTop: "25px",
                                textAlign: "left",
                                padding: "20px",
                                borderRadius: "8px",
                                backgroundColor: "#e9f7ef",
                                width: "275px",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        >
                            <h3 style={{ fontSize: "20px", color: "#28a745" }}>
                                Recommendations
                            </h3>

                            {/* ✅ Convert recommendations into bullet points */}
                            {typeof recommendations === "string" ? (
                                <ul style={{ fontSize: "17px", lineHeight: "1.6", paddingLeft: "20px" }}>
                                    {recommendations.split(". ").map((rec, index) => (
                                        rec && <li key={index}>{rec.trim()}.</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ fontSize: "17px", lineHeight: "1.6" }}>{recommendations}</p>
                            )}
                        </div>
                    )}

                </div>
            </IonContent>
        </IonPage>
    );
};

export default FaceMappingPrediction;
