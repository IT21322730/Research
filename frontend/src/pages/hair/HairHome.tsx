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

const HairHome: React.FC = () => {

  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: "https://static.toiimg.com/thumb/msid-88938696,width-400,resizemode-4/88938696.jpg",
      name: "Prakruthi Analysis",
      route: "/app/hairprakurthi"

    },
    {
      id: '2',
      image: "https://www.drmalaymehta.com/wp-content/uploads/2023/12/androgenic-alopecia-diagnosed-994x1024.jpg",
      name: "Patterned Alopecia Analysis",
      route: "/app/alophecia"

    },
    {
      id: '3',
      image: "https://haireveryday.com/wp-content/uploads/2022/10/Hormones.jpg",
      name: "Hair Texture Based Diagnosis",
      route: "/app/texture"

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
          <IonTitle>HAIR ANALYSIS</IonTitle>
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

export default HairHome;
