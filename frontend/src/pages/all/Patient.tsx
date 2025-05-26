import React, { useState, useEffect ,useRef } from "react";
import {
  IonContent,
  IonTextarea,
  IonButtons,
  IonBackButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert,
  IonInput
} from "@ionic/react";
import { add, trash, create } from "ionicons/icons";
import DefaultProfilePic from "../images/img_07.png";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useHistory } from "react-router-dom";
import '../css/Patient.css';


interface Patient {
  id: string;
  name: string;
  age: number;
  date: string;
  prakurthiType: string;
  user_id: string;
}

const Patient: React.FC = () => {
  const prakurthiTypeRef = useRef(""); // Add this line
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState<string | number | null>("");

  const [prakurthiType, setPrakurthiType] = useState("");
  const [savedPatientDetails, setSavedPatientDetails] = useState<Patient[]>([]);
  const [showAlert, setShowAlert] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User logged in:", user.uid);
        setUserId(user.uid);
        fetchPatients(user.uid);
      } else {
        console.warn("⚠️ No user logged in!");
        setUserId(null);
        setSavedPatientDetails([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchPatients = async (user_id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/patients?user_id=${user_id}`);
      if (!response.ok) throw new Error("Failed to fetch patients");
  
      const data = await response.json();
      console.log("🔄 Raw Patient Data:", data);
  
      if (!data.patients || !Array.isArray(data.patients)) {
        console.warn("⚠️ Unexpected patient data format:", data);
        return;
      }
  
      const patientsWithId = data.patients
        .filter((patient: any) => patient.id && !patient.id.startsWith("temp-")) // ❌ Ignore temp-* IDs
        .map((patient: any) => ({
          id: patient.id.toString(), // Ensure ID is a string
          name: patient.name || "Unknown",
          age: typeof patient.age === "number" && patient.age > 0 ? patient.age : "N/A", // ✅ Ensure age is displayed correctly
          prakurthiType: patient.prakurthiType || "Not Provided",
          date: patient.date || new Date().toISOString().split("T")[0],
        }));
  
      console.log("✅ Processed Patients:", patientsWithId);
      setSavedPatientDetails(patientsWithId);
    } catch (error) {
      console.error("❌ Error fetching patients:", error);
    }
  };
  
  const handleSave = async () => {
    console.log("🔍 Debug - Entered Age:", patientAge); // Debugging

    if (!userId) {
      console.error("❌ No authenticated user found.");
      return;
    }
  
    // Capture the latest value from the input
    const latestAgeInput = document.getElementById("patient-age") as HTMLInputElement;
    const latestAge = latestAgeInput?.value ?? "";
    const numericAge = latestAge ? parseInt(latestAge, 10) : "N/A";    

  const latestPrakurthiType = prakurthiTypeRef.current.trim(); // Use ref instead of state

  console.log("🛠 Current State - Name:", patientName, "| Age:", numericAge, "| Prakurthi Type:", prakurthiType);

    if (!latestPrakurthiType) {
      console.warn("⚠️ Prakurthi Type is empty. Using default value 'Not Provided'");
    }

    console.log("🛠 Current State - Name:", patientName, "| Age:", patientAge, "| Prakurthi Type:", prakurthiType);

    const trimmedAge = typeof patientAge === "string" ? patientAge.trim() : patientAge;
    const ageValue = patientAge !== null && !isNaN(Number(patientAge)) ? Number(patientAge) : null;
  
    const patientData = {
      name: patientName || "Unknown",
      age: numericAge,
      prakurthiType: prakurthiType,
      user_id: userId,
      date: new Date().toISOString().split("T")[0],
    };
  
    console.log("📤 Sending patient data:", JSON.stringify(patientData, null, 2));
  
    try {
      const response = await fetch("http://127.0.0.1:5000/create/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });
  
      if (!response.ok) throw new Error(await response.text());
  
      setShowModal(false);
      fetchPatients(userId);
    } catch (error) {
      console.error("❌ Error saving patient data:", error);
    }
  };  
  

  const handleDeletePatient = async (patientId: string) => {
    if (!patientId) {
      console.error("❌ No patient ID provided");
      return;
    }
  
    try {
      const apiUrl = `http://127.0.0.1:5000/delete/patient/${patientId}`;
      const response = await fetch(apiUrl, { method: "DELETE" });
      const responseData = await response.json();
  
      if (response.ok) {
        console.log("✅ Patient deleted successfully!", responseData);
        setSavedPatientDetails((prevDetails) =>
          prevDetails.filter((patient) => patient.id !== patientId)
        );
      } else {
        console.error("❌ Failed to delete patient:", responseData.error);
      }
    } catch (error) {
      console.error("❌ Error deleting patient:", error);
    }
  };
  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" style={{ color: "black" }} />
          </IonButtons>
          <IonTitle style={{ color: "black" }}>EDIT PROFILE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton
            onClick={() => {
              setPatientName("");
              setPatientAge("");
              setPrakurthiType("");
              setShowModal(true);
            }}
          >
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonPage>
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonBackButton defaultHref="/app/patient-info" />
                </IonButtons>
                <IonTitle style={{ color: "black" }}>ADD PATIENT</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="modal-box">
                <IonItem>
                  <IonLabel>
                    <IonTextarea
                      label="Patient Name"
                      placeholder="Enter Patient Name"
                      value={patientName}
                      onIonChange={(e) => setPatientName(e.detail.value!)}
                    />
                    <IonInput
                    id="patient-age"
                    label="Patient Age"
                    type="number"
                    placeholder="Enter Patient Age"
                    value={patientAge || ""}
                    onIonChange={(e) => {
                      const newValue = e.detail.value?.trim() || "";
                      const numericAge = newValue !== "" ? parseInt(newValue, 10) : "";
                      console.log("🔍 Debug - Age Input Changed:", numericAge);
                      setPatientAge(numericAge);
                    }}
                  />




                    <IonTextarea
                    label="Prakurthi Type"
                    placeholder="Enter Prakurthi Type"
                    value={prakurthiType}
                    onIonChange={(e) => {
                      console.log("🔍 Prakurthi Type changed:", e.detail.value, "Type:", typeof e.detail.value);
                      const newValue = e.detail.value?.toString().trim() || "";
                      setPrakurthiType(newValue);
                      prakurthiTypeRef.current = newValue; // Store latest value in ref
                    }}
                  />

                  </IonLabel>
                </IonItem>
                <IonButton expand="full" color="success" onClick={handleSave}>
                  Save
                </IonButton>
                <IonButton expand="full" color="danger" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
              </div>
            </IonContent>
          </IonPage>
        </IonModal>

        {savedPatientDetails.map((patient) => (
          <div className="patient-details" key={patient.id}>
            <div className="patient-details-card">
              <div className="patient-info">
              <img
                src={DefaultProfilePic}
                alt="Patient Profile"
                className="patient-profile-picture"
                onClick={() => {
                  if (!patient.id || patient.id.startsWith("temp-")) {
                    console.error("❌ Invalid Patient ID! Cannot view:", patient);
                    alert("⚠️ This patient record is missing a valid ID. Please refresh.");
                    return;
                  }

                  console.log("👀 Navigating to view patient:", patient.id);
                  history.push(`/app/view-patient/${patient.id}`);
                }}
                style={{ cursor: "pointer" }} // Make it visually clickable
              />

                <div className="patient-info-details">
                  <div className="patient-details-text"><strong>Name: </strong>{patient.name}</div>
                  <div className="patient-details-text"><strong>Prakurthi Type: </strong> {patient.prakurthiType || "Not Provided"}</div>
                  <div className="patient-details-text">
                  <strong>Age: </strong> {patient.age && patient.age > 0 ? patient.age : "N/A"}
                </div>



                  <button
                    className="patient-edit"
                    onClick={() => {
                      if (!patient.id || patient.id.startsWith("temp-")) {
                        console.error("❌ Invalid Patient ID! Cannot edit:", patient);
                        alert("⚠️ This patient record is missing a valid ID. Please refresh.");
                        return;
                      }

                      console.log("📝 Navigating to edit:", patient.id);
                      history.push( `/app/edit-patient/${patient.id}`);
                    }}
                  >
                    Edit Details
                  </button>
                  <IonIcon
                  icon={trash}
                  onClick={() => {
                    setSelectedPatientId(patient.id);  // Store selected patient ID
                    setShowDeleteAlert(true); // Show confirmation alert
                  }}
                  className="delete-icon"
                />


                </div>

              </div>
            </div>
          </div>
        ))}

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirm"
          message="Are you sure you want to delete this patient?"
          buttons={[
            {
              text: "No",
              role: "cancel",
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: "Yes",
              handler: async () => {
                if (!selectedPatientId) return;
                await handleDeletePatient(selectedPatientId);
                setShowDeleteAlert(false);
              },
            },
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Patient;
