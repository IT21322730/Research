import React, { useState } from 'react';
import { IonCard,IonBackButton, IonCardContent, IonButtons,IonContent, IonHeader, IonImg, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Tabs from '../all/Tabs'
import { useHistory } from 'react-router-dom';
import '../css/Facehome.css';

interface Post {

  id : string,
  image: string,
  name: string,
  route: string

}

const NailHome: React.FC = () => {

  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: "https://www.ayurvana.fr/media/wysiwyg/AY_FR/bilanayurvedique.jpg",
      name: "Prakruthi Analysis",
      route: "/app/nailprakurthi"

    },
    {
      id: '2',
      image: "https://bjgp.org/content/bjgp/66/652/587/F1.large.jpg",
      name: "Capillary Refill Time Analysis",
      route: "/app/cap"

    }

  ]

  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);

  const handleCardClick = (route: string) => {
    history.push(route);  // Use history to navigate to the respective route
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/home" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>NAIL ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding">
    <div className='content-container'>
      <IonList mode="ios" className='ion-no-padding'>
        {posts.map((post) => (
          <IonItem key={'card-' + post.id} mode='ios' lines='none' className='ion-no-padding ion-no-inner-padding'>
            <IonCard className='ion-no-padding' onClick={() => handleCardClick(post.route)}>
              <div className='card-content'>
                <IonImg className='card-image' src={post.image} />
                <IonCardContent>
                  <div className='title-container'>
                    <IonText>{post.name}</IonText>
                  </div>
                </IonCardContent>
              </div>
            </IonCard>
          </IonItem>
        ))}
      </IonList>
    </div>
  </IonContent>
    </IonPage>
    
  );
};

export default NailHome;
