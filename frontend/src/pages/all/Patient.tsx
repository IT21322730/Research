import React, { useState, useEffect } from 'react';
import { IonContent, IonTextarea, IonButtons, IonBackButton, IonPage, IonHeader, IonToolbar, IonTitle, IonFab, IonFabButton, IonIcon, IonModal, IonItem, IonLabel, IonButton, IonDatetime, IonAlert } from '@ionic/react';
import { add, trash } from 'ionicons/icons'; 
import { db, addDoc, collection, onSnapshot, deleteDoc, doc, getDocs} from '../firebase/firebase'; 
import '../css/Patient.css';
import DefaultProfilePic from '../images/img_07.png';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useHistory } from 'react-router-dom';

// Define the Patient interface
interface Patient {
  id: string;
  name: string;
  age: string;
  date: string;
  prakurthiType: string;
  user_id: string; // Ensure user_id is included
}

const Patient: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [prakurthiType, setPrakurthiType] = useState('');
  const [patientDate, setPatientDate] = useState('');
  const [savedPatientDetails, setSavedPatientDetails] = useState<any[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // For delete confirmation
  const [selectedPatientId, setSelectedPatientId] = useState<string>(''); // Selected patient ID

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return; // If no user is logged in, do nothing.
  
      const unsubscribeSnapshot = onSnapshot(collection(db, 'patients'), (snapshot) => {
        const patientsList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Patient)) // Explicitly cast to Patient type
          .filter(patient => patient.user_id === user.uid); // Now TypeScript knows user_id exists
      
        setSavedPatientDetails(patientsList);
      });      
  
      return () => unsubscribeSnapshot(); // Clean up Firestore listener
    });
  
    return () => unsubscribeAuth(); // Clean up authentication listener
  }, []);
  

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found.");
      return;
    }
  
    try {
      // Save the patient data to Firestore
      await addDoc(collection(db, 'patients'), {
        name: patientName,
        age: patientAge,
        date: patientDate,
        prakurthiType: prakurthiType,
        user_id: user.uid,
      });
  
      // Fetch the updated list of patients after saving the new patient
      const snapshot = await getDocs(collection(db, 'patients')); // Corrected to getDocs
      const patientsList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as Patient) // Explicitly typing the document data
        .filter((patient) => patient.user_id === user.uid); // Type patient as Patient here
  
      // Update the state to reflect the refreshed list
      setSavedPatientDetails(patientsList);
  
      // Close the modal after saving
      setShowModal(false);
    } catch (error) {
      console.error('Error saving patient data: ', error);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowDeleteAlert(true); // Show delete confirmation alert
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" style={{ color: 'black' }} />
          </IonButtons>
          <IonTitle style={{ color: 'black' }}>EDIT PROFILE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonBackButton defaultHref="/app/profile" style={{ color: 'black' }} />
                </IonButtons>
                <IonTitle style={{ color: 'black' }}>EDIT PROFILE</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="modal-box">
                <IonItem>
                  <IonLabel>
                    <IonTextarea
                      label="Patient Name"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter Patient Name"
                      value={patientName}
                      onIonChange={e => setPatientName(e.detail.value!)}
                      className="patient-input"
                    />
                    <IonTextarea
                      label="Patient Age"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter Patient Age"
                      value={patientAge}
                      onIonChange={e => setPatientAge(e.detail.value!)}
                      className="patient-input"
                    />
                    <IonTextarea
                      label="Prakurthi Type"
                      labelPlacement="floating"
                      fill="outline"
                      placeholder="Enter Prakurthi Type"
                      value={prakurthiType}
                      onIonChange={e => setPrakurthiType(e.detail.value!)}
                      className="patient-input"
                    />
                    <IonDatetime
                      value={patientDate || new Date().toISOString()}
                      onIonChange={e => setPatientDate(String(e.detail.value))}
                      className="patient-input"
                    />
                  </IonLabel>
                </IonItem>
                <button
                  className="take-picture-button"
                  style={{ backgroundColor: '#48D1CC', color: 'black', width: '320px' }}
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="take-picture-button"
                  style={{ backgroundColor: '#e61717', color: 'black', width: '320px' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </IonContent>
          </IonPage>
        </IonModal>

        {savedPatientDetails.map((patient, index) => (
          <div className="patient-details" key={index}>
            <div className="patient-details-card" style={{ position: 'relative' }}>
              <div className="patient-info">
                <div className="patient-profile-picture-container">
                  <img
                    src={DefaultProfilePic}
                    alt="Patient Profile"
                    className="patient-profile-picture"
                  />
                </div>
                <div className="patient-info-details">
                  <div className="patient-details-text">
                    <strong>Name: </strong>{patient.name}
                  </div>
                  <div className="patient-details-text">
                    <strong>Prakurthi Type: </strong>{patient.prakurthiType}
                  </div>
                  <div className="patient-details-text">
                    <strong>Age: </strong>{patient.age}
                  </div>
                  <div className="patient-details-text">
                    <strong>Date: </strong>{patient.date}
                  </div>
                  <button
                    className="patient-edit"
                    onClick={() => history.push(`/app/edit-patient/${patient.id}`)} // Use history.push for navigation
                  >
                    Edit Details
                  </button>
                </div>
              </div>

              <IonIcon
                icon={trash}
                onClick={() => handleDeletePatient(patient.id)}
                className="delete-icon"
              />
            </div>
          </div>
        ))}
        
        {/* Delete Confirmation Alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm"
          message="Are you sure you want to delete this patient?"
          buttons={[
            {
              text: 'No',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false)
            },
            {
              text: 'Yes',
              handler: async () => {
                try {
                  await deleteDoc(doc(db, 'patients', selectedPatientId));
                  console.log('Patient deleted successfully');
                } catch (error) {
                  console.error('Error deleting patient: ', error);
                }
                setShowDeleteAlert(false);
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Patient;
