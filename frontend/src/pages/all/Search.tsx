import React, { useState, useEffect } from 'react';
import { IonContent, IonButtons, IonBackButton, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';
import { db, onSnapshot, collection } from '../firebase/firebase'; // Import Firestore utilities
import DefaultProfilePic from '../images/img_07.png'; // Profile picture placeholder
import '../css/Search.css'; // Assuming this is where your CSS is located

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [savedPatientDetails, setSavedPatientDetails] = useState<any[]>([]); // State to store patient data

  // Fetch saved patient details from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'patients'), (snapshot) => {
      if (!snapshot.empty) {
        const patientsList = snapshot.docs.map(doc => doc.data());
        setSavedPatientDetails(patientsList);
      } else {
        setSavedPatientDetails([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (e: CustomEvent) => {
    setSearchQuery(e.detail.value!); // Update the search query on input change
  };

  const handleClear = () => {
    setSearchQuery(''); // Clear the search query when cancel is clicked
  };

  const filteredPatients = savedPatientDetails.filter(patient => {
    return patient.name.toLowerCase().includes(searchQuery.toLowerCase()); // Filter by patient name
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonSearchbar
        value={searchQuery}
        onIonInput={handleSearchChange}
        debounce={0}
        showCancelButton="always"
        showClearButton={searchQuery.length > 0 ? "always" : "never"}
        placeholder="Search by Patient Name"
        onIonCancel={handleClear}
        style={{
          borderRadius: '25px',        // Curved corners
          paddingLeft: '12px',         // Padding for better text alignment
          paddingRight: '12px',        // Padding for better text alignment
          backgroundColor: '#f4f4f4',  // Background color to match your design
          border: '1px solid #ccc',    // Subtle border color
          boxShadow: 'none',           // Remove any box-shadow for a cleaner look
          color: 'black',              // Text color
          fontSize: '16px',            // Font size adjustment
        }}
      />

        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        {/* Display filtered patient cards */}
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <div className="patient-details" key={index}>
              <div className="patient-details-card">
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
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              fontSize: '18px',
              color: '#888',
              marginTop: '20px'
            }}
          >
            No patients found
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
