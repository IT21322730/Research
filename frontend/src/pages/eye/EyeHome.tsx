import React, { useState } from 'react';
import { IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar,IonButtons,IonBackButton } from '@ionic/react';
import Tabs from '../all/Tabs'
import { useHistory } from 'react-router-dom';
import '../css/Facehome.css';

interface Post {

  id : string,
  image: string,
  name: string,
  route: string

}

const EyeHome: React.FC = () => {

  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: "https://www.medicalindiatourism.com/wp-content/uploads/2021/11/eye-laser-surgery-banner-1024x597.jpg",
      name: "Prakuruthi Analysis",
      route: "/app/eyeprakurthi"

    },
    {
      id: '2',
      image: "https://www.sistemaimpulsa.com/blog/wp-content/uploads/2024/05/Beneficios-del-Eye-Tracking-para-tu-estrategia-de-marketing.jpg",
      name: "Blinking rate and eye movement Analysis",
      route: "/app/blink"

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
          <IonTitle>EYE ANALYSIS</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="ion-padding"> {/* Add padding to prevent extra space */}
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

export default EyeHome;
