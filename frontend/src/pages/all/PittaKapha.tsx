import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/react';
import '../css/PittaKapha.css';
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const PittaKapha: React.FC = () => {
  const history = useHistory(); // Use useHistory() instead of useNavigate()
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>RECOMMENDATION</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="Pitta-Kapha-container">
          <h2>What Does Pitta-Kapha Mean?</h2>
          <p>
            The Pitta-Kapha type combines the fiery and competitive Pitta with the calm, grounded nature of Kapha.
            Pitta desires to prove itself, while Kapha enjoys stability and relaxation. Depending on which dosha is more pronounced,
            the person may lean more toward the Pitta-Kapha or Kapha-Pitta type. Both types share the same general health and lifestyle recommendations.
          </p>

          <h2>Key Characteristics of Pitta-Kapha</h2>
          <p>
            Pitta-Kapha individuals are strong, resilient, and assertive. Their physical strength, combined with perseverance,
            makes them well-suited for leadership roles. They are persistent and have enough energy to support long-term projects.
            This constitution is particularly suited for roles like CEO, provided they have the appropriate education.
          </p>

          <h2>Physical Characteristics</h2>
          <p>
            The Pitta-Kapha constitution is generally healthy, with the digestive fire (Agni) well-balanced. However, there is a tendency toward an unhealthy lifestyle, which can lead to weight gain and associated health issues such as obesity, skin problems, and toxin buildup.
            Until around the age of 50, Pitta-Kapha individuals can generally tolerate most things, but indulgence and a sedentary lifestyle should be avoided to maintain health.
          </p>

          <h2>Typical Disorders</h2>
          <p>
            Pitta-Kapha individuals may be prone to obesity, skin diseases, foul-smelling perspiration, and toxin accumulation in the body. Kapha &#39;&#39; s tendency to cling to things can lead to the retention of impurities.
          </p>

          <h2>Health Tips for Pitta-Kapha</h2>
          <p>
            Agni stimulation is essential for this type, which can be achieved with foods and herbs like ginger, long pepper, and black pepper.
            Rasayana (rejuvenating) herbs such as Boerhaavia diffusa or Cyavanprash, along with Amla fruit jam, can serve as preventive measures to maintain health.
          </p>
          <p>
            A regular, dynamic fitness program, challenges at work, dynamic meditation, and regular sauna visits are recommended to maintain balance.
          </p>

          <h2>Dietary Recommendations</h2>
          <h3>Fruits</h3>
          <p><strong>Pitta:</strong> Sweet fruits like apples, avocados, coconuts, figs, melons, oranges, pears, plums, pomegranates, and mangoes. Avoid dried fruits.</p>
          <p><strong>Kapha:</strong> Apples, berries, cherries, mangoes, peaches, pears, and raisins. Dried figs and plums are good, but other dried fruits should be avoided if possible.</p>
          <p><strong>General Rule:</strong> Consume fruit at least one hour before or after meals, and avoid eating fruit in the evening.</p>

          <h3>Vegetables</h3>
          <p><strong>Pitta:</strong> Sweet and bitter vegetables like asparagus, cabbage, cucumber, cauliflower, celery, green beans, lettuce, peas, parsley, potatoes, zucchini, sprouts, cress, chicory, and mushrooms.</p>
          <p><strong>Kapha:</strong> Spicy and bitter vegetables like red beets, cabbage, carrots, cauliflower, celery, eggplant, garlic, lettuce, mushrooms, onions, parsley, peas, radish, spinach, sprouts, fennel, and Brussels sprouts.</p>

          <h3>Grains</h3>
          <p><strong>Pitta:</strong> Barley, oats (cooked), basmati or white rice, and wheat.</p>
          <p><strong>Kapha:</strong> Barley, corn, millet, oats, basmati rice (in small quantities).</p>

          <h3>Eggs & Meat</h3>
          <p><strong>Pitta:</strong> Eggs are fine. Other animal products are best avoided.</p>
          <p><strong>Kapha:</strong> Eggs (scrambled, not fried), chicken, turkey, and rabbit are good options.</p>

          <h3>Legumes</h3>
          <p><strong>Pitta:</strong> All legumes except for lentils.</p>
          <p><strong>Kapha:</strong> All legumes except for white beans and black lentils. Azuki and black beans are good options.</p>

          <h3>Sweetening</h3>
          <p><strong>Pitta:</strong> Brown sugar, honey (not older than six months).</p>
          <p><strong>Kapha:</strong> Only organic honey and jaggery are recommended.</p>

          <h3>Spices</h3>
          <p><strong>Pitta:</strong> Cilantro, cinnamon, turmeric, cardamom, fennel, and some black pepper. Avoid other spices.</p>
          <p><strong>Kapha:</strong> All spices are good for Kapha types.</p>

          <h3>Milk Products & Substitutes</h3>
          <p><strong>Pitta:</strong> Unsalted butter, ghee, goat milk, cow milk, cheese. Soy milk and tofu as vegan substitutes.</p>
          <p><strong>Kapha:</strong> Reduced-fat milk in small quantities; avoid fatty cheeses and curd (quark). Soy milk is preferable.</p>

          <h3>Oils</h3>
          <p><strong>Pitta:</strong> Coconut oil, olive oil, sunflower oil, and soy oil.</p>
          <p><strong>Kapha:</strong> Walnut and corn oil (in small quantities).</p>

          <h2>Recommended Activities</h2>
          <p>Incorporate regular physical activities such as dynamic workouts, meditation, and challenge-oriented tasks at work. Regular sauna visits are also highly beneficial.</p>

          <h2>Herbs for Pitta-Kapha Imbalance</h2>
          <p>
            Pitta represents the fire and water elements, responsible for digestion and metabolism.
            When pitta becomes aggravated, you may experience heartburn, skin rashes, hot flushes,
            inflammation, or irritability. Soothing, cooling, and calming herbs help pacify this:
            <strong>Mint</strong>, which includes varieties like spearmint, peppermint, and field mint, has a sweet taste and helps soothe inner heat. It also improves digestion, enhances respiratory health, and provides antioxidant benefits. <strong>Coriander</strong>, which is pungent, sweet, and slightly bitter, is a wonderful remedy for clearing irritating heat and helping to clear the digestive tract. <strong>Shatavari</strong>, belonging to the wild asparagus family, helps reduce pitta and vata but increases kapha. It is a rejuvenating tonic and supports female reproductive health.
          </p>

          <p>
            Pitta types can benefit from teas like Pukka&apos;s Mint Refresh, which contains peppermint leaf, rose, coriander seed, hibiscus flower, fennel seed, and licorice—ingredients that soothe and calm pitta. Additionally, Pukka’s Womankind tea helps calm and cool pitta and can assist with inflammation and irritation.
          </p>

          <p>
            Kapha represents water and earth, responsible for maintaining the structure and lubrication of the body. When kapha becomes excessive, you might experience congestion, sinus problems, weight gain, and tiredness. Light, heating, and aromatic herbs are beneficial for maintaining balance in kapha: <strong>Turmeric</strong>, with its anti-inflammatory and antioxidant properties, is a potent detoxifier and helps balance excess kapha. <strong>Ginseng</strong>, known for its heating qualities, provides both mental and physical energy while boosting core energy levels. <strong>Black Pepper</strong>, with its heating, drying, and sharp properties, helps to clear fat from the digestive system and lungs while balancing kapha.
          </p>

          <p>
            Kapha types can benefit from a daily tonic of black pepper mixed with honey, especially when consuming foods like cheese, wheat, or potatoes that can aggravate kapha.
          </p>

          <h3>Yoga Poses for Pitta & Kapha</h3>

          <h4>Trikonasana</h4>
          <img src="https://www.theyogacollective.com/wp-content/uploads/2019/10/5850642685417750730_IMG_8904-1-1200x800.jpg" alt="Trikonasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Bhujangasana</h4>
          <img src="https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg" alt="Bhujangasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Dhanurasana</h4>
          <img src="https://fitsri.com/wp-content/uploads/2020/01/bow-pose.jpg" alt="Dhanurasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Chandra Namaskar</h4>
          <img src="https://assets.zeezest.com/images/PROD_anjali_yoga_chandranamaskar_step_by_step_1624019713428.jpg" alt="Chandra Namaskar" style={{ width: '100%', height: 'auto' }} />

          <h4>Sheetali Pranayama</h4>
          <img src="https://static.vikaspedia.in/mediastorage/image/Sheetali_Pranayama.png" alt="Sheetali Pranayama" style={{ width: '100%', height: 'auto' }} />

          <h4>Ustrasana</h4>
          <img src="https://patanjaleeyoga.com/wp-content/uploads/2024/01/1-7.webp" alt="Ustrasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Bandhasana</h4>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezl_lsMggYrdrz-Vq-fi5mSnBLFiSIrKR6A&s" alt="Bandhasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Adho Mukha Svanasana</h4>
          <img src="https://miro.medium.com/v2/resize:fit:1400/1*tE3y72ROkd3B2X-T_5xNJg.png" alt="Adho Mukha Svanasana" style={{ width: '100%', height: 'auto' }} />

          <h4>Surya Namaskar</h4>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_BIPOW03wnJ9ydzpSF2GrGEQqHhD-CNlOxQ&s" alt="Surya Namaskar" style={{ width: '100%', height: 'auto' }} />

          <h4>Pranayama</h4>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRJ6od-u98Yi1rvnFa-7LMACElE7ZEVLGKvQ&s" alt="Pranayama" style={{ width: '100%', height: 'auto' }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PittaKapha;
