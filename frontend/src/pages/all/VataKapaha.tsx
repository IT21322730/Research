import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonButtons,IonBackButton } from '@ionic/react';
import '../css/VataKapaha.css';

const VataKapaha: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
                      <IonBackButton defaultHref="/app/final" />
                    </IonButtons>
          <IonTitle>RECOMANDATION</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="Vata-Kapaha-container">
          <h2>Character of the Vata-Kapha Type</h2>
          <p>
            The Vata-Kapha Ayurveda type is an interesting combination of the Vata and Kapha doshas. It can be compared to a racecar driver pressing both the gas and the brake pedals at the same time. The creative Vata Dosha is always in the fast lane of life, while the Kapha type is grounded and averse to change. This creates internal conflict, which often leads to frustration for the Vata-Kapha person.
          </p>

          <h2>Physical Characteristics</h2>
          <p>
            The body of a Vata-Kapha person can appear either like a Vata type—small and delicate or tall and slender—or more like the larger and stronger Kapha type. The physical appearance can vary greatly depending on which dosha is more pronounced.
          </p>

          <h2>Typical Vata-Kapha Disorders</h2>
          <p>
            People with a Vata-Kapha constitution often experience a range of health issues. They tend to freeze easily, suffer from poor digestion, feel bloated, and are prone to constipation. Emotionally, they may experience anxiety, lethargy, and alternating patterns of waking at night and excessive sleep during the day. They can also experience migratory pain, frequent edema, stone formation, and a lack of discipline and disorientation. In some cases, they may also struggle with mental health issues like schizophrenia-like disorders and depression.
          </p>

          <h2>Health Tips for Vata-Kapha Types</h2>
          <p>
            To manage the fluctuating conditions of a Vata-Kapha type, it is important to focus on maintaining warmth, ease, and mental clarity. Regular Hatha yoga can be helpful, as can eating warm, nourishing meals. Creating and following a structured daily routine is essential for maintaining balance. 
          </p>
          <p>
            The Vata-Kapha Ayurveda type is an interesting combination of the Vata and Kapha doshas. It can be compared to a racecar driver pressing both the gas and the brake pedals at the same time. The creative Vata Dosha is always in the fast lane of life, while the Kapha type is grounded and averse to change. This creates internal conflict, which often leads to frustration for the Vata-Kapha person.
        </p>

        <h2>Vata-Kapha Balancing Dietary Guide</h2>
          <h3>Key Dietary Principles:</h3>
          <ul>
            <li><strong>Fruits:</strong> Select fresh fruits like apples, pears, persimmon, and sweet grapes. Soaked dried fruits like raisins, prunes, and figs are also beneficial.</li>
            <li><strong>Vegetables:</strong> Focus on asparagus, zucchini, fennel, broccoli, and artichokes. Green, leafy vegetables are essential but avoid raw salads, tomatoes, spinach, and root vegetables.</li>
            <li><strong>Dairy:</strong> Use organic skim milk boiled with ginger, cardamom, or turmeric. Homemade lassi is recommended.</li>
            <li><strong>Legumes:</strong> Lentils and dahls are favorable. All dried beans and peas are acceptable unless they cause digestive issues.</li>
            <li><strong>Soy:</strong> Processed soy products should be avoided. Soy milk, boiled with cinnamon or ginger, is acceptable.</li>
            <li><strong>Nuts/Seeds:</strong> Choose unprocessed sunflower, sesame, and pumpkin seeds, pecans, and walnuts in modest portions.</li>
            <li><strong>Non-Vegetarian:</strong> A vegetarian diet is advised.</li>
            <li><strong>Kitcheri:</strong> A blend of mung dahl and barley cooked in water is recommended.</li>
            <li><strong>Oils:</strong> Use sesame or olive oil sparingly. Ensure they are extra virgin, cold-pressed, and organic.</li>
            <li><strong>Spices:</strong> Incorporate a variety of spices and herbs, especially ginger, cumin, black pepper, mustard seeds, oregano, sage, thyme, mint, basil, turmeric, cinnamon, and cloves. Use rock salt in moderation.</li>
            <li><strong>Sugar:</strong> Minimize sugar intake, using rock sugar or raw honey in small quantities.</li>
          </ul>

          <h3>Items to Avoid:</h3>
          <ul>
            <li><strong>Fruits:</strong> Avoid jams and certain dried fruits.</li>
            <li><strong>Vegetables:</strong> Stay away from raw vegetables, tomatoes, and root vegetables.</li>
            <li><strong>Dairy:</strong> Exclude curdled milk products like yogurt (except lassi), cheese, and sour cream.</li>
            <li><strong>Carbohydrates:</strong> Avoid pizza, bread with yeast, cookies, and pastries.</li>
            <li><strong>Animal Protein:</strong> No red meat.</li>
            <li><strong>Others:</strong> Avoid oily or heavy foods, fried foods, cream sauces, and heavy desserts.</li>
            <li><strong>Drinks:</strong> No cold or carbonated beverages, alcohol, or caffeinated drinks.</li>
            <li><strong>Condiments:</strong> Avoid vinegar and vinegar-containing substances.</li>
          </ul>

          <h3>Balancing Points for Vata and Kapha:</h3>
          <ul>
            <li>Exercise is crucial for maintaining a healthy weight and metabolism.</li>
            <li>Prefer a diet with more vegetables and less quantity of grains.</li>
            <li>Minimize fats and sugars.</li>
            <li>Favor warm, cooked foods and avoid cold drinks and desserts.</li>
            <li>A vegetarian diet is beneficial for maintaining health.</li>
            <li>Engage in regular, light exercise and maintain a positive outlook.</li>
          </ul>

          <h2>Yoga Poses for Vata-Kapha Imbalance</h2>
          <h3>Vrikshasana (Tree Pose)</h3>
          <img src="https://www.arhantayoga.org/wp-content/uploads/2022/03/Tree-Pose-%E2%80%93-Vrikshasana.jpg" alt="Vrikshasana (Tree Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Tadasana (Mountain Pose)</h3>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/09/Mountain-Pose-for-Poses-Page-e1572142996266.jpeg" alt="Tadasana (Mountain Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Balasana (Child&apos;&apos;s Pose)</h3>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-1200x800.jpg" alt="Balasana (Child's Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Virabhadrasana II (Warrior II Pose)</h3>
          <img src="https://cdn.prod.website-files.com/670a59845f0989763e175227/670a59845f0989763e17610d_648d7618416218e8f0198717_Learning-Yoga-How-to-Do-Warrior-2.jpg" alt="Virabhadrasana II (Warrior II Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Savasana (Corpse Pose)</h3>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/10/3375586094932946951_IMG_8997-2-e1571156387174.jpg" alt="Savasana (Corpse Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Ustrasana (Camel Pose)</h3>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/10/AdobeStock_132661315-1200x800.jpeg" alt="Ustrasana (Camel Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Utkatasana (Chair Pose)</h3>
          <img src="https://www.ekhartyoga.com/media/image/articles/Chair-pose-Utkatasana-EkhartYoga.jpg" alt="Utkatasana (Chair Pose)" style={{ width: '100%', height: 'auto' }} />

          <h3>Kapalabhati Pranayama (Skull Shining Breath)</h3>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU5on4tJ1j1LORNSllH-1AudmKmAk3johXsA&s" alt="Kapalabhati Pranayama (Skull Shining Breath)" style={{ width: '100%', height: 'auto' }} />

          <h3>Urdhva Mukha Svanasana (Upward-Facing Dog Pose)</h3>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/10/8251271252083802169_IMG_8753-2-1-1200x800.jpg" alt="Urdhva Mukha Svanasana (Upward-Facing Dog Pose)" style={{ width: '100%', height: 'auto' }} />

        </div>
      </IonContent>
    </IonPage>
  );
};

export default VataKapaha;
