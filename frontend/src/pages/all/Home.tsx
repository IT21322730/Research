import React from 'react';
import {
  IonCard,
  IonBackButton,
  IonCardContent,
  IonContent,
  IonButtons,
  IonHeader,
  IonImg,
  IonItem,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../css/HomePage.css';

interface Post {
  id: string;
  image: string;
  name: string;
  route: string;
}

const Home: React.FC = () => {
  const history = useHistory();

  const posts: Post[] = [
    {
      id: '1',
      image: 'https://aayushbharat.com/blogs/wp-content/uploads/2021/11/prakruti_blogbanner.jpg',
      name: 'Prakurthi Analysis',
      route: '/app/step',
    },
    {
      id: '2',
      image: 'https://edited.beautybay.com/wp-content/uploads/2021/04/04_05_EDITED_DERMALOGICA_FACEMAPPING_EDITED-ARTICLE.jpg',
      name: 'Face Mapping Analysis',
      route: '/app/facemapping',
    },
    {
      id: '3',
      image: 'https://www.candacesmithetiquette.com/images/xMontage_of_facial_expressions.jpg.pagespeed.ic.vB1xtSDp_0.jpg',
      name: 'Facial Micro Expression Analysis',
      route: '/app/facemicro',
    },
    {
      id: '4',
      image: 'https://www.sistemaimpulsa.com/blog/wp-content/uploads/2024/05/Beneficios-del-Eye-Tracking-para-tu-estrategia-de-marketing.jpg',
      name: 'Blinking Rate and Eye Movement Analysis',
      route: '/app/blink',
    },
    {
      id: '5',
      image: 'https://www.drmalaymehta.com/wp-content/uploads/2023/12/androgenic-alopecia-diagnosed-994x1024.jpg',
      name: 'Patterned Alopecia Analysis and Hair Texture Based Diagnosis',
      route: '/app/alophecia',
    },
    {
      id: '6',
      image: 'https://bjgp.org/content/bjgp/66/652/587/F1.large.jpg',
      name: 'Capillary Refill Time Analysis',
      route: '/app/cap',
    },
  ];

  const handleCardClick = (route: string) => {
    history.push(route);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>HOME</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-content" fullscreen>
        <div className="content-container">
          <IonList mode="ios" className="ion-no-padding">
            {posts.map((post) => (
              <IonItem key={post.id} mode="ios" lines="none" className="ion-no-padding">
                <IonCard className="ion-no-padding" onClick={() => handleCardClick(post.route)}>
                  <div className="card-content">
                    <IonImg className="card-image" src={post.image} alt={post.name} />
                    <IonCardContent>
                      <div className="title-container">
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

export default Home;
