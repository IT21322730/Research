import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonButtons, 
  IonBackButton, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonItem, 
  IonLabel, 
  IonTextarea, 
  IonButton, 
  IonSpinner
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import '../css/EditPatient.css';

const EditPatient: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const history = useHistory();
  
  const [prakurthiType, setPrakurthiType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Patient Data
  useEffect(() => {
    if (!patientId) {
      setErrorMessage("⚠ No patient ID provided!");
      return;
    }

    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://192.168.1.100:5000/patients/${patientId}`);
        if (!response.ok) throw new Error("⚠ No patient found!");


        const data = await response.json();
        setPrakurthiType(data.prakurthiType || '');
        setErrorMessage('');
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred.");
        }
        console.error("❌ Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);
  
  // Handle Save Changes
  const handleSave = async () => {
    if (!patientId) {
      console.error("❌ No patient ID provided");
      return;
    }
  
    const updatedPrakurthiType = prakurthiType.trim();
  
    if (!updatedPrakurthiType) {
      console.error("❌ Prakurthi Type cannot be empty!");
      return;
    }
  
    try {
      const apiUrl = `https://192.168.1.100:5000/patients/${patientId}`;
      const requestBody = { prakurthiType: updatedPrakurthiType };

  
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        console.error("❌ Failed to update Prakurthi Type:", responseData.error);
        return;
      }
  
      console.log("✅ Prakurthi Type updated successfully!");
  
      // ✅ Navigate to the patient info page first
      history.push(`/app/patient-info/${patientId}`);

  
      // ✅ Optional: Refresh after navigating (if needed)
      setTimeout(() => {
        window.location.reload();
      }, 500);
  
    } catch (error) {
      console.error("❌ Error updating Prakurthi Type:", error);
    }
  };
  


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/patient" />
          </IonButtons>
          <IonTitle>EDIT PRAKURTHI TYPE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="edit-patient-form">
          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <>
              {/* Prakurthi Type */}
              <IonItem>
                <IonLabel position="floating" style={{ fontFamily: "Open Sans, sans-serif" }}>
                  Prakurthi Type
                </IonLabel>
                <IonTextarea
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  value={prakurthiType}
                  onIonInput={(e) => setPrakurthiType(e.detail.value!)}
                  placeholder="Enter Prakurthi Type"
                />
              </IonItem>

              {/* Save Changes Button */}
              <IonButton className='save-patient' expand="full" color="primary" onClick={handleSave}>
                Save Changes
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditPatient;
