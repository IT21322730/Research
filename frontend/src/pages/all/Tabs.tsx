import React, { useState, useEffect } from 'react';
import { IonPage, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonAlert } from '@ionic/react';

import { Redirect, Route, useHistory } from 'react-router';
import Home from '../all/Home';
import Profile from '../all/Profile';
import Search from '../all/Search';
import Prakurthi from '../all/Prakurthi';
import { home, person, search, logOut } from 'ionicons/icons';  // Import icons correctly
import FinalPrakurthi from '../all/FinalPrakurthi';
import Vata from './Vata';
import Pitta from './Pitta';
import Kapha from './Kapha'
import VataPitta from './VataPitta';
import PittaKapha from './PittaKapha';
import VataKapaha from './VataKapaha';
import VataPittaKapha from './VataPittaKapha'
import EditPatient from '../all/EditPatient';
import Patient from '../all/Patient'
import Question from '../all/Question';
import Step from './Step';

// IT21322730
import FaceMicro from '../face/FaceMicro';
import FaceMapping from '../face/FaceMapping';
import FaceMappingPrediction from '../face/FaceMappingPrediction';
import FaceVideoPrediction from '../face/FaceVideoPrediction';
import FacePrakurthiPrediction from '../face/FacePrakurthiPrediction';

// IT21319488
import EyeHome from '../eye/EyeHome';
import EyePredictionPage from '../eye/Eyeprediction'
import BlinkFinal from '../eye/BlinkFinal';
import BlinkEye from '../eye/BlinkEye';
import BlinkPrediction from '../eye/BlinkPrediction';

// IT21319938
import HairHome from '../hair/HairHome';
import HairPrakurthi from '../hair/HairPrakurthi';
import HairPrakruthiResults from '../hair/HairPrakurthiResults';
import HairAlophecia from '../hair/Hairalophecia';
import HairAlopeciaResults from '../hair/HairAlopheciaResults';

// IT21324024
import NailPredictionPage from '../nail/NailPredictionpage';
import NailCap from '../nail/NailCap';
import CRTprediction from '../nail/CRTPrediction';


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
          <Route path="/app/final" component={FinalPrakurthi} />
          <Route path="/app/question" component={Question} />
          <Route path="/app/step" component={Step} />
          <Route path="/app/patient-info" component={Patient} />
          <Route path="/app/edit-patient/:patientId" component={EditPatient} />
          <Route path="/app/vata-body" component={Vata} />
          <Route path="/app/pitta-body" component={Pitta} />
          <Route path="/app/kapha-body" component={Kapha} />
          <Route path="/app/vata-pitta-body" component={VataPitta} />
          <Route path="/app/pitta-kapha-body" component={PittaKapha} />
          <Route path="/app/vata-kapha-body" component={VataKapaha} />
          <Route path="/app/vata-pitta-kapha-body" component={VataPittaKapha} />

          {/* IT21322730 */}
          <Route path="/app/face-prakurthi-prediction" component={FacePrakurthiPrediction} exact={true} />
          <Route path="/app/facemicro" component={FaceMicro} />
          <Route path="/app/facemapping" component={FaceMapping} exact={true} />
          <Route path="/app/face-mapping-prediction" component={FaceMappingPrediction} exact={true} />
          <Route path="/app/face-video-prediction" component={FaceVideoPrediction} />

          {/* IT21319488 */}
          <Route path="/app/eyehome" component={EyeHome} />
          <Route path="/app/prediction/:docId" component={EyePredictionPage} />
          <Route path="/app/blink" component={BlinkEye} />
          <Route path="/app/blinkfinal" component={BlinkFinal} />
          <Route path="/app/blink-prediction/:docId" component={BlinkPrediction} />

          {/* IT21319938 */}
          <Route path="/app/hairhome" component={HairHome} />
          <Route path="/app/hairprakurthi" component={HairPrakurthi} />
          <Route path="/app/hairprakurthi" component={HairPrakurthi} />
          <Route path="/app/hair-results" component={HairPrakruthiResults} />
          <Route path="/app/alophecia" component={HairAlophecia} />
          <Route path="/app/hair-alohecia-results" component={HairAlopeciaResults} exact={true} />

          {/* IT21324024 */}
          <Route path="/app/nailprediction" component={NailPredictionPage} exact={true} />
          <Route path="/app/cap" component={NailCap} exact={true} />
          <Route path="/app/crt-prediction" component={CRTprediction} exact={true} />





          <Route exact path="/app">
            <Redirect to="/app/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot='bottom'>
          <IonTabButton tab="home" onClick={() => history.replace("/app/home")}>
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
