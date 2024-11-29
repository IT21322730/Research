import React, { useState } from 'react';
import { IonCard, IonBackButton,IonCardContent, IonContent, IonButtons, IonHeader, IonImg, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../css/Home.css';

interface Post {

  id : string,
  image: string,
  name: string,
  route: string

}

const Home: React.FC = () => {

  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: "https://coastaldermaesthetics.com/wp-content/uploads/2021/03/Coastal-Derm-March-2021-Web-Go-Glow-scaled.jpg",
      name: "Face Analysis",
      route: "/app/facehome"

    },
    {
      id: '2',
      image: "https://www.centreforsight.net/wp-content/uploads/2023/03/complete-eye-care.webp",
      name: "Eye Analysis",
      route: "/app/eyehome"

    },
    {
      id: '3',
      image: "https://img.freepik.com/free-photo/happy-smiling-woman-playing-with-her-long-curly-hair_171337-12165.jpg",
      name: "Hair Analysis",
      route: "/app/hairhome"

    },
    {
      id: '4',
      image: "https://www.gotirth.org/wp-content/uploads/2020/01/healthy-nails.jpg",
      name: "Nail Analysis",
      route: "/app/nailhome"

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
            <IonBackButton defaultHref="/login" /> {/* Replace with your previous page path */}
          </IonButtons>
          <IonTitle>HOME</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-content' fullscreen>
        <div className='content-container'>
          <IonList mode="ios" className='ion-no-padding'>
            {
              posts.map((post) => 
                <IonItem key={'card-'+post.id} mode='ios' lines='none' className='ion-no-padding ion-no-inner-padding'>
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
              
              )
            }
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
