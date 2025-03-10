import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

import FirstLook from './pages/all/FirstLook';
import LoginHome from './pages/all/LoginPage'
import ForgotPassword from './pages/all/ForgotPassword';
import Tabs from './pages/all/Tabs';
import Signup from './pages/all/Signup';
import VerificationCode from './pages/all/VerificationCode'


// IT21322730
import FacePic from './pages/face/FacePic';
import FaceVideo from './pages/face/FaceVideo';
import FaceMappingPic from './pages/face/FaceMappingPic';

// IT21319488
import EyePic from './pages/eye/EyePic'
import Eyevideo from './pages/eye/Eyevideo'

// IT21319938
import HairPic from './pages/hair/HairPic';
import HairAlopheciaPic from './pages/hair/HairAlopheciaPic';
import HairAlopeciaResults from './pages/hair/HairAlopheciaResults';

//IT21324024
import NailVideo from './pages/nail/NailVedio'
import NailPic from './pages/nail/NailPic';
import CRTprediction from './pages/nail/CRTPrediction';

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

        {/* IT21322730 */}
        <Route path="/app/face-pic" component={FacePic} exact={true} />
        <Route path="/app/face-video" component={FaceVideo} exact={true} />
        <Route path="/app/face-mapping-pic" component={FaceMappingPic} exact={true} />
        
        {/* IT21319488 */}
        <Route path="/app/eye-pic" component={EyePic} exact={true} />
        <Route path="/app/eye-video" component={Eyevideo} exact={true} />

        {/* IT21319938 */}
        <Route path="/app/hair-pic" component={HairPic} exact={true} />
        <Route path="/app/hair-pic-alophecia" component={HairAlopheciaPic} exact={true} />
        <Route path="/app/hair-alohecia-results" component={HairAlopeciaResults} exact={true} />
        

        {/* IT21324024 */}
        <Route path="/app/nail-pic" component={NailPic} exact={true}/>
        <Route path="/app/cap" component={NailVideo} />
        <Route path="/app/crt-prediction" component={CRTprediction} exact={true} />
       
        
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
