import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonBackButton ,IonButtons} from '@ionic/react';
import '../css/VataPittaKapha.css';

const VataPittaKapha: React.FC = () => {
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
        <div className="Vata-Pitta-Kapaha-container">
        <h2>What Does Vata-Pitta-Kapha Mean?</h2>
          <p>
            The individual constitution of a person is derived from the relationship of the three Doshas: Vata, Pitta, and Kapha. Because this innate constitutional type predetermines how we are doing physically, mentally, and emotionally, it is of the utmost importance in Ayurveda medicine.
          </p>
          <p>
            It is quite rare that Vata, Pitta, and Kapha are equally pronounced in a human being, a state that is also called the TriDosha. When this is the case, a natural balance is present that is the foundation of health, fitness, and wellbeing par excellence.
          </p>

          <h2>Character of the Vata-Pitta-Kapha Type</h2>
          <p>
            The poise of Vata-Pitta-Kapha types stands out above all. Nothing flusters them. They are neither lethargic nor wound up; their mind is alert and relaxed. In short, they are the happy types, at peace with themselves.
          </p>
          <p>
            Should it happen that a Vata-Pitta-Kapha type negates his/her nature, Vata, Pitta, or Kapha can get out of line. In this case, the typical characteristic features of the respective Dosha occur, including disorders.
          </p>

          <h2>Physical Characteristics of the Vata-Pitta-Kapha Type</h2>
          <p>
            There is also little to be said concerning the physique of the TriDosha Ayurveda type, since it is usually a medium build. In other words, such a person is neither too slender nor too corpulent and radiates peace and strength.
          </p>

          <h2>Typical Vata-Pitta-Kapha Disorders</h2>
          <p>
            If Vata-Pitta-Kapha types—who are inherently at ease and in harmony—eat the wrong foods, travel too much, and do not stay true to themselves over a longer period of time, Vata issues such as sleep disorders, digestive disorders, and anxiety may occur. Pitta disorders such as gastritis, heat flashes, difficulty falling asleep, and mushy bowel movements are also possible. If Kapha acts against the Vata and Pitta disorders, obesity, lethargy, and depression may occur.
          </p>

          <h2>Health Tips for Vata-Pitta-Kapha Types</h2>
          <p>
            As people with a Vata-Pitta-Kapha constitution are usually in balance, only a few regulating measures can be recommended. Should the digestive fire Agni get out of balance, <em>Plumbago Zeylanica</em> (Bai 01) is recommended, and a short-term purification with the “Three Fruits” (Bai 35) is also a gentle measure option.
          </p>
          <p>
            Cyavanprash, the Amla fruit jam (Bai 203), can be used as Rasayana (rejuvenation agent). The diet should be well balanced and contain all the elements so that the already existing balance can be maintained.
          </p>

          <h2>The Best Diet for Vata-Pitta-Kapha Types</h2>
          <p>
            Warm, well-seasoned food and drinks are the best for the TriDosha person. Due to the balanced digestive strength, this Ayurveda type can also digest cabbage and legumes with ease.
          </p>
          <p>
            The following list of beneficial foods helps to pacify the more dominant Dosha during the respective season: Kapha is the most active from February to May, Pitta from June to September, and Vata dominates from October to January.
          </p>

          <h3>Fruit</h3>
          <p><strong>Vata:</strong> Sweet fruits such as bananas, coconuts, apples, figs, grapefruits, grapes, mangos, melons, oranges, papayas, peaches, pineapples, plums, berries, cherries, apricots, and avocados. Dried fruits can also be eaten, but not too much.</p>
          <p><strong>Pitta:</strong> Sweet fruits like apples, avocados, coconuts, figs, melons, oranges, pears, plums, pomegranates, and mangos. Dried fruit is to be avoided.</p>
          <p><strong>Kapha:</strong> Apple, berries, cherries, mangos, peaches, pears, and raisins are recommended. Dried figs and plums are good, but other dried fruits should be avoided if possible.</p>
          <p><em>General rule:</em> Consume fruit at least one hour before or after meals, but not in the evening.</p>

          <h3>Vegetables</h3>
          <p><strong>Vata:</strong> Cooked vegetables such as asparagus, red beets, carrots, sweet potatoes, radish, zucchini, spinach (in small quantities), sprouts, tomatoes, celery, garlic, and steamed onions.</p>
          <p><strong>Pitta:</strong> Sweet and bitter vegetables like asparagus, cabbage, cucumber, cauliflower, celery, green beans, lettuce, peas, parsley, potatoes, zucchini, sprouts, cress, chicory, and mushrooms.</p>
          <p><strong>Kapha:</strong> Spicy and bitter vegetables like red beets, cabbage, carrots, cauliflower, celery, eggplant, garlic, lettuce, mushrooms, onions, parsley, peas, radish, spinach, sprouts, fennel, and Brussels sprouts.</p>

          <h3>Grains</h3>
          <p><strong>Vata:</strong> Oats (boiled), brown rice, wheat.</p>
          <p><strong>Pitta:</strong> Barley, oats (cooked), basmati or white rice, and wheat.</p>
          <p><strong>Kapha:</strong> Barley, corn, millet, oats, basmati rice (small quantities).</p>

          <h3>Eggs & Meat</h3>
          <p><strong>Vata:</strong> Eggs (omelets/scrambled eggs), fish, chicken, and other white meat.</p>
          <p><strong>Pitta:</strong> Eggs are fine. Other animal products are best to avoid.</p>
          <p><strong>Kapha:</strong> Eggs (scrambled eggs, no fried eggs), chicken, turkey, and rabbit.</p>

          <h3>Legumes</h3>
          <p><strong>Vata:</strong> No beans, with the exception of mung beans and black lentils.</p>
          <p><strong>Pitta:</strong> All legumes, except for lentils.</p>
          <p><strong>Kapha:</strong> All legumes except for white beans and black lentils. Azuki and black beans are good.</p>

          <h3>Sweetening</h3>
          <p><strong>Vata:</strong> Jaggery (dried sugar cane juice), brown sugar.</p>
          <p><strong>Pitta:</strong> Brown sugar, honey (not older than six months).</p>
          <p><strong>Kapha:</strong> Only organic honey and jaggery.</p>

          <h3>Spices</h3>
          <p><strong>Vata:</strong> All spices, peppers, and chili in small quantities.</p>
          <p><strong>Pitta:</strong> No spices except for cilantro, cinnamon, turmeric, cardamom, fennel, and some black pepper.</p>
          <p><strong>Kapha:</strong> All spices.</p>

          <h3>Milk Products & Substitutes</h3>
          <p><strong>Vata:</strong> Ghee (clarified butter), fresh milk, paneer; soy milk and tofu as a substitute.</p>
          <p><strong>Pitta:</strong> Butter (unsalted), ghee, goat milk, cow milk, pans, and cheese. Soy milk and tofu as a vegan substitute.</p>
          <p><strong>Kapha:</strong> Reduced-fat milk in small quantities; avoid fatty cheeses and curd (quark). Soy milk is preferable in general.</p>

          <h3>Oil</h3>
          <p><strong>Vata:</strong> All organic oils.</p>
          <p><strong>Pitta:</strong> Coconut oil, olive oil, sunflower oil, and soy oil.</p>
          <p><strong>Kapha:</strong> Walnut and corn oil, but just a little.</p>

          <h3>Anupana (Carrier Substance for Herbs)</h3>
          <p><strong>Vata:</strong> Lukewarm water or milk.</p>
          <p><strong>Pitta:</strong> Ghee, cold water, and milk.</p>
          <p><strong>Kapha:</strong> Warm or cold water and herbal tea.</p>

          <h4>Yoga for Vata-Pitta-Kapha Imbalance</h4>

          <div className="yoga-poses-grid">

          <div>
            <h3>Uttanasana</h3>
            <img
              src="https://cdn.yogajournal.com/wp-content/uploads/2021/11/Uttanasana-Pose_Andrew-Clark_2400x1350.jpeg"
              alt="Uttanasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Balasana</h3>
            <img
              src="https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-1200x800.jpg"
              alt="Balasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Paschimottanasana</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7YG2QvgeH7DgghmuyK2k0McIH76hlneEaZg&s"
              alt="Paschimottanasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Supta Virasana</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHx6ZIOPxn3d95bShwsg3CAGVGlNYg7bPeKXNgEdjaggOJr1dIzmxvTKZ8X__vj9Y1UUo&usqp=CAU"
              alt="Supta Virasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Dhanurasana</h3>
            <img
              src="https://www.theyogacollective.com/wp-content/uploads/2019/10/AdobeStock_193776647-1-1200x800.jpeg"
              alt="Dhanurasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Suryanamaskar</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0fC-X8CC5UWVzUtlPZbgN1aQrStKvMbK00Q&s"
              alt="Suryanamaskar"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Trikonasana</h3>
            <img
              src="https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg"
              alt="Trikonasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Bhujangasana</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC7IBwWojlhzr5FXxvY9hcYNDZrRa6o226lw&s"
              alt="Bhujangasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Chandra Namaskar</h3>
            <img
              src="https://assets.zeezest.com/images/PROD_anjali_yoga_chandranamaskar_step_by_step_1624019713428.jpg"
              alt="Chandra Namaskar"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Sheetali Pranayama</h3>
            <img
              src="https://static.vikaspedia.in/mediastorage/image/Sheetali_Pranayama.png"
              alt="Sheetali Pranayama"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Bandhasana</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezl_lsMggYrdrz-Vq-fi5mSnBLFiSIrKR6A&s"
              alt="Bandhasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Adho Mukha Svanasana</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4dfp2r7_AlClYG83KewMFwLtXDOxW_g2ZIg&s"
              alt="Adho Mukha Svanasana"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          <div>
            <h3>Pranayama</h3>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRJ6od-u98Yi1rvnFa-7LMACElE7ZEVLGKvQ&s"
              alt="Pranayama"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          </div>
          

        </div>

      </IonContent>
    </IonPage>
  );
};

export default VataPittaKapha;
