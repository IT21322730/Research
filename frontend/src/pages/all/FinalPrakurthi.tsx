import React from 'react';
import { IonHeader, IonPage, IonContent, IonToolbar, IonTitle, IonButtons, IonBackButton, IonText, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom'; // To programmatically navigate
import '../css/FinalPrakurthi.css'; // Import your styles here

const bodyTypes = [
  { name: "Vata Body Type", color: "#FFCCCB", path: "/app/vata-body" },
  { name: "Pitta Body Type", color: "#FFD700", path: "/app/pitta-body" },
  { name: "Kapha Body Type", color: "#ADD8E6", path: "/app/kapha-body" },
  { name: "Vata-Pitta Body Type", color: "#FFB6C1", path: "/app/vata-pitta-body" },
  { name: "Pitta-Kapha Body Type", color: "#FF7F50", path: "/app/pitta-kapha-body" },
  { name: "Vata-Kapha Body Type", color: "#90EE90", path: "/app/vata-kapha-body" },
  { name: "Vata-Pitta-Kapha Body Type", color: "#DDA0DD", path: "/app/vata-pitta-kapha-body" },
];

const FinalPrakurthi: React.FC = () => {
  const history = useHistory();

  const handleNavigate = (path: string) => {
    history.push(path); // Navigate programmatically
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/previousPage" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>Final Prakurthi</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="final-prakurthi-container">
          <IonText>
            <h2>Your Final Prakurthi is:</h2>
            <p>Your analysis results will be displayed here.</p>
          </IonText>

          <div className="body-type-cards">
            {bodyTypes.map((type, index) => (
              <IonButton
                key={index}
                expand="full"
                style={{ backgroundColor: type.color }}
                onClick={() => handleNavigate(type.path)}
              >
                {type.name}
              </IonButton>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FinalPrakurthi;
