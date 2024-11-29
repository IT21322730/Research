import React, { useState, useEffect } from 'react';
import { IonPage,IonIcon, IonLabel, IonRouterOutlet,IonTabBar,IonTabButton,IonTabs, IonAlert} from '@ionic/react';

import { Redirect, Route,useHistory } from 'react-router';
import Home from '../all/Home';
import Profile from '../all/Profile';
import Search from '../all/Search';
import Prakurthi from '../all/Prakurthi';


import { home, person, search, logOut} from 'ionicons/icons';  // Import icons correctly
import FinalPrakurthi from '../all/FinalPrakurthi';
import Pitta from './Pitta';
import Kapha from './Kapha'


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
