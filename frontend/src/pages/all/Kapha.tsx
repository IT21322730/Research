import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonButtons,IonBackButton } from '@ionic/react';
import '../css/Kapha.css';

const Kapha: React.FC = () => {
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
        <div className="Kapha-container">
          <h1>How to Balance Kapha Dosha</h1>
          <p>
            Kapha is one of the doshas that governs the structure of the body. It is the principle that holds the cells together, forming muscles, fat, and bones. People governed by Kapha are often strong and energetic but can experience weight gain, fluid retention, allergies, and fatigue when out of balance. Kapha imbalances can lead to conditions like diabetes, depression, asthma, and excessive sleep.
          </p>
          <h2>Physical Characteristics of Kapha Dosha:</h2>
          <ul>
            <li>Heaviness</li>
            <li>Lethargy</li>
            <li>Laziness</li>
            <li>Excessive sleep</li>
            <li>Constipation</li>
            <li>Poor appetite</li>
            <li>Nausea</li>
            <li>Excess salivation</li>
            <li>Diarrhea</li>
            <li>Indigestion</li>
            <li>Sweet taste in mouth</li>
          </ul>

          <h2>How to Balance Kapha Dosha—Easy Lifestyle Tips</h2>
          <p>
            To balance Kapha, introduce heating spices, regular exercise, and variety into your daily routine. Focus on lighter, drier foods and avoid cold, heavy meals. Embrace a routine of socializing, taking up new activities, and making sure to keep the body warm and active.
          </p>

          <h2>Kapha Yoga Poses</h2>

          <h3>Surya Namaskar (Sun Salutations)</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Surya%20Namaskar%20or%20Sun%20salutations%201020x450.jpg" alt="Surya Namaskar" />
          <p>Surya namaskar is done to increase warmth and mobility in the body and help in boosting blood circulation in the morning hours.</p>

          <h3>Twisting Chair Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Twisting%20Chair%20Pose%201020x450.jpg" alt="Twisting Chair Pose" />
          <p>Twisting Chair Pose helps to exercise the legs bringing heat and helping clear out lungs and the chest area from excess of kapha. It also helps in keeping the posture straight and is a great form of kapha yoga that can be performed every day.</p>

          <h3>Half-Moon Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Half-Moon%20pose%201020x450.jpg" alt="Half-Moon Pose" />
          <p>Half-Moon pose can help in keeping the digestion in order as it involves constantly moving sideways helping the organs to awaken the digestive juices and making the organs strong. Sideways motion also helps in keeping the lungs clear of excessive build-up of kapha and mucous.</p>

          <h3>Warrior Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Warrior%20Pose%201020x450.jpg" alt="Warrior Pose" />
          <p>Warrior Pose is great to bring in more heat, warmth, and energy to the body, and is one of the most beneficial kapha pacifying yoga. By stretching arms sideways every morning for an hour or so can help bring a wide space into the front body helping remove kapha dosha.</p>

          <h3>Triangle Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Triangle%20Pose%201020x450.jpg" alt="Triangle Pose" />
          <p>Triangle Pose also helps to treat digestive problems and also clear out lungs and chest of excessive kapha dosha. Regular formation of this pose helps to strengthen the legs, back, and spine areas.</p>

          <h3>Headstand</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Headstand%201020x450.jpg" alt="Headstand" />
          <p>Headstand is one of the most popular yogas for kapha body type which helps in turning around the blood flow (that builds up in the knees and ankles) in the body. Headstand also helps to move the kapha around the body so as to make it unable to settle at one place.</p>

          <h3>Planks</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/planks%201020x450.jpg" alt="Planks" />
          <p>Planks are not just a great form of exercise but also help to build a strong and sturdy back that weakens the kapha dosha. It also helps in opening the chest and lungs. Planks are an important asana in kapha balancing yoga.</p>

          <h3>Bow Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Bow%20Pose%201020x450.jpg" alt="Bow Pose" />
          <p>Bow Pose is also meant to strengthen the weak digestive system by bringing agni or fire to the digestive juices to work fine. This yoga for kapha dosha helps in keeping the spine also strong and stomach in order.</p>

          <h3>Tree Pose</h3>
          <img src="https://www.dabur.com/Blogs/Doshas/Tree%20Pose%201020x450.jpg" alt="Tree Pose" />
          <p>Tree Pose is made by standing on one leg for a while to balance the kapha dosha.</p>

          <h2>Kapha Diet Guidelines</h2>
          <div style={{ overflowX: "auto", maxWidth: "100%" }}>
          <table className="diet-table"
          style={{
            width: "100%", // Ensures it stretches to fit parent width
            minWidth: "600px", // Prevents shrinking too much
            borderCollapse: "collapse", // Merges borders for a clean look
          }}>
            <thead>
              <tr>
                <th>Favor</th>
                <th>Reduce or Avoid</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Lighter diet; dry, warm food and warm drinks; pungent, bitter, and astringent tastes</td>
                <td>Avoid large quantities of food, especially at night; avoid unctuous, cold, heavy food; minimize sweet, sour, and salty tastes</td>
                <td>Food should be fresh and light, with heating spices to help balance Kapha’s cool and sluggish nature.</td>
              </tr>
              <tr>
                <td>Old grains (minimum one year), barley, millet, corn, buckwheat, rye, oats, wheat, rice (good quality, like basmati rice)</td>
                <td>Avoid new grains, especially wheat and rice</td>
                <td>Favor older, lighter grains that are easy to digest.</td>
              </tr>
              <tr>
                <td>All pulses, except tofu and black gram</td>
                <td>Avoid tofu (soybeans), black gram</td>
                <td>Pulses are good, but soy-based products should be avoided.</td>
              </tr>
              <tr>
                <td>Lassi (yoghurt and water drink — preferably made thin), buttermilk, low-fat milk; small amount of ghee</td>
                <td>Cheese, whole milk</td>
                <td>Low-fat dairy is best for Kapha individuals.</td>
              </tr>
              <tr>
                <td>Honey, old jaggery (caramelized sugar cane syrup)</td>
                <td>Avoid sugar cane products (except old jaggery)</td>
                <td>Sweeteners like honey and jaggery are acceptable in moderation.</td>
              </tr>
              <tr>
                <td>Ghee (for cooking), mustard, sunflower, corn, olive (all, especially ghee, in small amounts)</td>
                <td>—</td>
                <td>Healthy oils in moderation are good for Kapha.</td>
              </tr>
              <tr>
                <td>Sunflower and pumpkin seeds</td>
                <td>Avoid all nuts</td>
                <td>Seeds are better than nuts for balancing Kapha.</td>
              </tr>
              <tr>
                <td>All spices except salt, especially pungent and sharp spices (pepper, ginger, etc.), lemon juice; Kapha Churna and Kapha Tea</td>
                <td>Avoid salt</td>
                <td>Spices like ginger and pepper stimulate digestion and metabolism.</td>
              </tr>
              <tr>
                <td>Light to medium cooked vegetables: carrots, onions, cauliflower, bell peppers, zucchini, okra, peas, sprouts, broccoli, cabbage</td>
                <td>Avoid heavy vegetables: potatoes, tomatoes, lettuce, cucumbers</td>
                <td>Light, warming vegetables work best for Kapha.</td>
              </tr>
              <tr>
                <td>Fruit: apples, pears, pomegranate, papaya, apricot, prunes, grapes</td>
                <td>Avoid tropical fruits (e.g., bananas, melons, coconut)</td>
                <td>Fresh, sweet fruits that are not too heavy or cooling.</td>
              </tr>
            </tbody>
          </table>
          </div>

          <h2>Ayurvedic Remedies and Practices for Kapha</h2>
          <ul>
            <li>Triphala and Trikatu: Consider taking Triphala, an Ayurvedic herbal formula known for its detoxifying and balancing properties, which support healthy digestion and elimination. Similarly, Trikatu (a combination of three pungent spices—ginger, black pepper, and long pepper) promotes digestion and reduces sluggishness.</li>
            <li>Herbal teas: Drink herbal teas with warming and stimulating herbs like ginger, cinnamon, and cardamom.</li>
            <li>Tongue scraping: Use a tongue scraper each morning to remove ama (toxins) and stimulate digestion.</li>
            <li>Neti: Neti, or nasal cleansing, involves cleansing the nasal passages with a saline solution. It helps clear mucus and supports respiratory health.</li>
            <li>Dry saunas or steam baths: Indulge in occasional dry saunas or herbal steam baths (Swedana) to promote sweating and eliminate excess moisture.</li>
            <li>Abhyanga: Regular oil massage, especially using warming oils like sesame or mustard oil, helps stimulate circulation, reduce stiffness, and balance Kapha.</li>
            <li>Pinda Sweda: This therapy involves massaging the body with boluses filled with herbs and rice. It helps stimulate circulation and reduce Kapha accumulation.</li>
            <li>Nasya oil: Nasya oil, or nasal oiling, involves applying a few drops of warm, herbal oil to the nostrils. This can help clear nasal passages and invigorate the mind.</li>
            <li>Meditation and Pranayama: Practice meditation and pranayama (breathwork) to calm the mind, reduce stress, and bring clarity.</li>
            <li>Fasting and Detoxing: Periodic fasting or detoxing can help reduce excess Kapha and support the body’s natural cleansing processes.</li>
            <li>Ayurveda is all about balance. But the road to restoring Kapha balance is a delicate dance between understanding one’s constitution and embracing the transformative power of holistic practices. However, with the right combination of dietary changes, lifestyle adaptations, and the incredible healing power of Ayurvedic therapies, true balance can be attained and maintained, ultimately leading to optimal health and inner harmony.</li>
          </ul>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Kapha;
