import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from '@ionic/react';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: CustomEvent) => {
    setSearchQuery(e.detail.value!);
  };

  const handleSearch = () => {
    // Placeholder function to perform the search action
    console.log('Searching for:', searchQuery);
    // You can filter a list or send the search query to an API here
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Search</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Search Bar */}
        <IonSearchbar
          value={searchQuery}
          onIonInput={handleSearchChange}
          debounce={0} // Optional: can control the delay before triggering the search
          showClearButton="focus"
          onIonClear={() => setSearchQuery('')} // Clears the search query
          placeholder="Search..."
          onIonBlur={handleSearch} // Trigger search when user finishes typing
        />

        {/* Add your content here that will be filtered based on the search */}
        <div>
          <p>Results for: {searchQuery}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
