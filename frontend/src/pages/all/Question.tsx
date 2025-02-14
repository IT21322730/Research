import React, { useState } from "react";
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/react";
import "../css/Question.css";
import img_02 from "../images/img_02.png";

const questions = [
  { question: "How do you usually respond to stress or pressure?", answers: ["Feel anxious", "Become irritable", "Remain calm"] },
  { question: "How would you describe your sleep patterns?", answers: ["Light and easily disturbed", "Moderate and sound", "Deep and long"] },
  { question: "How do you typically make decisions?", answers: ["Quickly and intuitively", "Carefully and logically", "Slowly but confidently"] },
  { question: "What is your usual reaction to a change in routine?", answers: ["Easily adapt", "Become frustrated", "Prefer stability and consistency"] },
  { question: "How do you generally feel in social situations?", answers: ["Energetic and talkative", "Assertive and direct", "Calm and reserved"] },
  { question: "How would you describe your digestion?", answers: ["Variable and sensitive", "Strong and consistent", "Slow and steady"] },
  { question: "What is your approach to completing tasks?", answers: ["Multi-tasking", "Focused and goal-oriented", "Methodical and steady"] },
  { question: "How do you handle conflicts or disagreements?", answers: ["Avoid confrontation", "Assert your point", "Seek compromise and peace"] },
  { question: "How would you describe your energy levels throughout the day?", answers: ["Fluctuating with highs and lows", "High and intense", "Stable and moderate"] },
  { question: "How do you typically respond to cold weather?", answers: ["Dislike it and feel cold", "Tolerate it well", "Prefer warmth"] },
  { question: "How do you usually express your emotions?", answers: ["Easily and frequently", "Strongly and passionately", "Calmly and with restraint"] },
  { question: "What is your general approach to learning new things?", answers: ["Quickly but may forget", "Deeply with strong focus", "Slowly but with long-lasting retention"] },
];

const Question: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(null)); // Store selected answers
  const [response, setResponse] = useState<string | null>(null); // State to store response

  // Function to handle answer selection
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex + 1; // Convert answer index (0,1,2) to (1,2,3)
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Ensure all questions are answered
    if (selectedAnswers.some(answer => answer === null || answer === undefined)) {
      console.log("Please answer all questions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/analyze-prakriti/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      const result = await response.json();
      setResponse(result.prakriti); // Store the response under the 'Done' button
    } catch (error) {
      console.error("Error sending answers:", error);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/nailhome" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>SELF ASSIGNMENT</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className="question-container">
        {questions.map((item, index) => (
          <div className="question-box" key={index}>
            <div className="question-header">
              <img src={img_02} alt="Icon" className="question-img" />
              <div className="question-text">{item.question}</div>
            </div>
            <div className="answers">
              {item.answers.map((answer, i) => (
                <label key={i} className="answer-option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={i + 1} // Convert to 1,2,3
                    onChange={() => handleAnswerSelect(index, i)}
                  />
                  {answer}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="button-container" style={{ marginTop: "10px" }}> {/* Reduce margin */}
          <button
            className="question-button"
            style={{
              backgroundColor: "#48D1CC",
              color: "#fff",
              width: "500px",
              height: "50px",
              fontSize: "16px",
              borderRadius: "10px",
            }}
            onClick={handleSubmit} // Call function on click
          >
            Done
          </button>
        </div>

         {/* Display Prakriti result */}
         {response && (
          <div className="prakriti-result" style={{ 
            marginTop: "20px", 
            fontSize: "18px", 
            marginBottom: "60px", 
            fontWeight: "bold", 
            textAlign: "center" 
          }}>
            <p>Final Prakriti type is <strong>{response}</strong></p>
          </div>
        )}
      </div>
    </>
  );
};

export default Question;
