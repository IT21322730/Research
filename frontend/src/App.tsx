import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import FirstLook from './pages/all/FirstLook';
import LoginHome from './pages/all/LoginPage'
import ForgotPassword from './pages/all/ForgotPassword';
import Tabs from './pages/all/Tabs';
import Signup from './pages/all/Signup';
import VerificationCode from './pages/all/VerificationCode'
import EyePic from './pages/eye/EyePic'
import Eyevideo from './pages/eye/Eyevideo'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


import HairPic from './pages/hair/HairPic';

import NailVideo from './pages/nail/NailVedio'
import NailPic from './pages/nail/NailPic';
import NailPredictionPage from './pages/nail/NailPredictionpage';


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import FacePic from './pages/face/FacePic';
import FaceMicro from './pages/face/FaceMicro';
import FaceVideo from './pages/face/FaceVideo';
import FaceMapping from './pages/face/FaceMapping';
import FaceMappingPic from './pages/face/FaceMappingPic';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={FirstLook} />
        <Route path="/app" component={Tabs} />
        <Route path="/login" component={LoginHome} />
        <Route path="/register" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} exact={true} />
        <Route path="/verify-code" component={VerificationCode} exact={true} />
        

        <Route path="/app/eye-pic" component={EyePic} exact={true} />
        <Route path="/app/eye-video" component={Eyevideo} exact={true} />

        <Route path="/app/hair-pic" component={HairPic} exact={true} />

        <Route path="/app/face-pic" component={FacePic} exact={true} />

        <Route path="/app/nail-pic" component={NailPic} exact={true}/>
        <Route path="/app/nailprediction" component={NailPredictionPage} exact={true}/>

        
        <Route path="/app/facemicro" component={FaceMicro} />
        <Route path="/app/face-video" component={FaceVideo} exact={true} />
        <Route path="/app/facemapping" component={FaceMapping} exact={true} />
        <Route path="/app/face-mapping-pic" component={FaceMappingPic} exact={true} />

       
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
