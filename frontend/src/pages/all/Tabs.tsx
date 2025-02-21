import React, { useState, useEffect } from 'react';
import { IonPage,IonIcon, IonLabel, IonRouterOutlet,IonTabBar,IonTabButton,IonTabs, IonAlert} from '@ionic/react';

import { Redirect, Route,useHistory } from 'react-router';
import Home from '../all/Home';
import Profile from '../all/Profile';
import Search from '../all/Search';
import Prakurthi from '../all/Prakurthi';
import Patient from '../all/Patient';
import EditPatient from '../all/EditPatient';


import { home, person, search, logOut} from 'ionicons/icons';  // Import icons correctly
import FinalPrakurthi from '../all/FinalPrakurthi';
import Pitta from './Pitta';
import Kapha from './Kapha'
import EditPatient from '../all/EditPatient';
import Patient from '../all/Patient'
import EyePredictionPage from '../eye/Eyeprediction'
import BlinkFinal from '../eye/BlinkFinal';
import BlinkEye from '../eye/BlinkEye';
import EyePrakurthi from '../eye/Eyeprakurthi';
import BlinkPrediction from '../eye/BlinkPrediction';


import EyeHome from '../eye/EyeHome';
import HairHome from '../hair/HairHome';
import Step from './Step';

import HairPrakurthi from '../hair/HairPrakurthi';

import NailHome from '../nail/NailHome';
import NailPrakurthi from '../nail/NailPrakurthi';
import NailCap from '../nail/NailCap';
import NailPredictionPage from '../nail/NailPredictionpage';




const Tabs: React.FC = () => {

  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    console.log("showLogoutAlert updated:", showLogoutAlert);
  }, [showLogoutAlert]);

  const handleLogout = () => {
    console.log("Logout button clicked");
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    console.log("Navigating to /");
    history.push('/');
    window.location.reload();
  };

  return (
    <IonPage>
    <IonTabs>
        <IonRouterOutlet>
            <Route path="/app/home" component={Home} />
            <Route path="/app/profile" component={Profile} />
            <Route path="/app/search" component={Search} />
            <Route path="/app/final-prakurthi" component={Prakurthi} />
            <Route path="/app/step" component={Step} />
            <Route path="/app/patient-info" component={Patient} />
            <Route path="/app/edit-patient/:patientId" component={EditPatient} />

            <Route path="/app/eyehome" component={EyeHome} />
            <Route path="/app/hairhome" component={HairHome} />
            <Route path="/app/hairprakurthi" component={HairPrakurthi} />

            <Route path="/app/blink" component={BlinkEye} />
            <Route path="/app/blinkfinal" component={BlinkFinal} />

            <Route path="/app/nailhome" component={NailHome} />
            <Route path="/app/nailprakurthi" component={NailPrakurthi} />
            <Route path="/app/cap" component={NailCap} />
            

            <Route path="/app/patient-info" component={Patient} />
            <Route path="/app/edit-patient/:patientId" component={EditPatient} />

            
            <Route path="/app/final" component={FinalPrakurthi} />

            
            <Route path="/app/pitta-body" component={Pitta} />
            <Route path="/app/kapha-body" component={Kapha} />

            
            <Route exact path="/app">
                <Redirect to="/app/home" />
            </Route>
        </IonRouterOutlet>

        <IonTabBar slot='bottom'>
            <IonTabButton tab="home" href='/app/home'>
            <IonIcon icon={home}></IonIcon>
            <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href='/app/profile'>
            <IonIcon icon={person}></IonIcon>
            <IonLabel>Profile</IonLabel>
            </IonTabButton>

            <IonTabButton tab="search" href='/app/search'>
            <IonIcon icon={search}></IonIcon>
            <IonLabel>Search</IonLabel>
            </IonTabButton>

            <IonTabButton tab="logout" onClick={handleLogout}>
            <IonIcon icon={logOut} />
            <IonLabel>Logout</IonLabel>
            </IonTabButton>
        </IonTabBar>
        </IonTabs>

        <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header="Logout"
        message="Are you sure you want to logout?"
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              setShowLogoutAlert(false);
            },
          },
          {
            text: 'Yes',
            handler: confirmLogout,
          },
        ]}
      />
      </IonPage>
    
  );
};

export default Tabs;
