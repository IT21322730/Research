import React, { useState } from 'react';
import { IonCard,IonButtons,IonBackButton, IonCardContent, IonContent, IonHeader, IonImg, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import Tabs from '../all/Tabs'
import { useHistory } from 'react-router-dom';
import '../css/Facehome.css';

interface Post {

  id : string,
  image: string,
  name: string,
  route: string

}

const FaceHome: React.FC = () => {

  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: "https://ayuvi.com/wp-content/uploads/2020/09/UNDERSTANDING-YOUR-PRAKRUTI-AND-VIKRUTI.jpg",
      name: "Prakurhi Analysis",
      route: "/app/faceprakurthi"

    },
    {
      id: '2',
      image: "https://edited.beautybay.com/wp-content/uploads/2021/04/04_05_EDITED_DERMALOGICA_FACEMAPPING_EDITED-ARTICLE.jpg",
      name: "Face Mapping Analysis",
      route: "/app/facemapping"

    },
    {
      id: '3',
      image: "https://www.candacesmithetiquette.com/images/xMontage_of_facial_expressions.jpg.pagespeed.ic.vB1xtSDp_0.jpg",
      name: "Facial Micro Expression Analysis",
      route: "/app/facemicro"

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
          <IonTitle>FACE ANALYSIS</IonTitle>
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

export default FaceHome;
