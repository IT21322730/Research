import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import '../css/Question.css';
import img_02 from '../images/img_02.png';

const questions = [
  {
    question: "How do you usually respond to stress or pressure?",
    answers: ["Remain calm", "Become irritable", "Feel anxious"],
  },
  {
    question: "How would you describe your sleep patterns?",
    answers: ["Light and easily disturbed", "Moderate and sound", "Deep and long"],
  },
  {
    question: "How do you typically make decisions?",
    answers: ["Quickly and intuitively", "Carefully and logically", "Slowly but confidently"],
  },
  {
    question: "What is your usual reaction to a change in routine?",
    answers: ["Easily adapt", "Become frustrated", "Prefer stability and consistency"],
  },
  {
    question: "How do you generally feel in social situations?",
    answers: ["Energetic and talkative", "Assertive and direct", "Calm and reserved"],
  },
  {
    question: "How would you describe your digestion?",
    answers: ["Variable and sensitive", "Strong and consistent", "Slow and steady"],
  },
  {
    question: "What is your approach to completing tasks?",
    answers: ["Multi-tasking", "Focused and goal-oriented", "Methodical and steady"],
  },
  {
    question: "How do you handle conflicts or disagreements?",
    answers: ["Avoid confrontation", "Assert your point", "Seek compromise and peace"],
  },
  {
    question: "How would you describe your energy levels throughout the day?",
    answers: ["Fluctuating with highs and lows", "High and intense", "Stable and moderate"],
  },
  {
    question: "How do you typically respond to cold weather?",
    answers: ["Dislike it and feel cold", "Tolerate it well", "Prefer warmth"],
  },
];

const Question: React.FC = () => {
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
                  <input type="radio" name={`question-${index}`} value={answer} />
                  {answer}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="button-container">
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
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default Question;
