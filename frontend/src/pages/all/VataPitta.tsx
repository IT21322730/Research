import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,IonBackButton, IonButtons} from '@ionic/react';
import '../css/VataPitta.css';

const VataPitta: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonButtons slot="start">
                              <IonBackButton defaultHref="/app/final" />
                            </IonButtons>
        <IonTitle>VATA-PITTA DOSHA</IonTitle>
      </IonHeader>
      <IonContent>
        <div className="Vata-Pitta-container">
          <h1>What Does Vata-Pitta Mean?</h1>
          <p>
            Vata, Pitta, and Kapha regulate our physical, mental, and emotional constitution.
            The Vata-Pitta type combines the ambitious fire of Pitta with the light and restless qualities of Vata.
          </p>

          <h2>The Best Diet for Vata-Pitta Types</h2>
          <p>
            Vata-Pitta types should balance both Doshas by prioritizing the more pronounced one. 
            Seasonal adjustments are also key: pacify Pitta from June to September and Vata from October to January.
          </p>

          <h3>Fruit</h3>
          <p><strong>Vata:</strong> Sweet fruits like bananas, coconuts, apples, mangos, and grapes. Dried fruits in moderation.</p>
          <p><strong>Pitta:</strong> Sweet fruits like apples, coconuts, melons, and pomegranates. Avoid dried fruits.</p>
          <p><em>General Rule:</em> Consume fruits at least one hour before or after meals, not in the evening.</p>

          <h3>Vegetables</h3>
          <p><strong>Vata:</strong> Cooked vegetables like asparagus, carrots, sweet potatoes, radish, and zucchini.</p>
          <p><strong>Pitta:</strong> Sweet and bitter vegetables like asparagus, cabbage, cucumber, cauliflower, and green beans.</p>

          <h3>Grains</h3>
          <p><strong>Vata:</strong> Oats (boiled), brown rice, wheat.</p>
          <p><strong>Pitta:</strong> Barley, oats (cooked), basmati or white rice, wheat.</p>

          <h3>Eggs & Meat</h3>
          <p><strong>Vata:</strong> Eggs (omelets/scrambled), fish, chicken, and white meat.</p>
          <p><strong>Pitta:</strong> Eggs are fine; other animal products should be avoided.</p>

          <h3>Legumes</h3>
          <p><strong>Vata:</strong> Avoid beans except for mung beans and black lentils.</p>
          <p><strong>Pitta:</strong> All legumes except lentils.</p>

          <h3>Sweetening</h3>
          <p><strong>Vata:</strong> Jaggery, brown sugar.</p>
          <p><strong>Pitta:</strong> Brown sugar, honey (not older than six months).</p>

          <h3>Spices</h3>
          <p><strong>Vata:</strong> All spices, but peppers and chili in small quantities.</p>
          <p><strong>Pitta:</strong> No spices except cilantro, cinnamon, turmeric, cardamom, fennel, and some black pepper.</p>

          <h3>Milk Products & Substitutes</h3>
          <p><strong>Vata:</strong> Ghee, fresh milk, paneer; soy milk and tofu as substitutes.</p>
          <p><strong>Pitta:</strong> Butter (unsalted), ghee, goat milk, cow milk, cheese, soy milk, and tofu.</p>

          <h3>Oil</h3>
          <p><strong>Vata:</strong> All organic oils.</p>
          <p><strong>Pitta:</strong> Coconut oil, olive oil, sunflower oil, soy oil.</p>

          <h3>Anupana (Carrier Substance for Herbs)</h3>
          <p><strong>Vata:</strong> Lukewarm water or milk.</p>
          <p><strong>Pitta:</strong> Ghee, cold water, and milk.</p>

          <h2>Yoga Poses for Vata-Pitta Imbalance</h2>
          <p>
            Yoga helps balance Vata-Pitta energies by grounding restlessness and cooling excess heat.
            Focus on slow, steady movements and grounding poses.
          </p>
          <div className="yoga-poses-grid">
            <div>
              <h3>Surya Namaskar A</h3>
              <img
                src="https://articles-1mg.gumlet.io/articles/wp-content/uploads/2018/06/surya-namaskar.jpg?compress=true&quality=80&w=640&dpr=2.6"
                alt="Surya Namaskar A"
              />
            </div>
            <div>
              <h3>Warrior I</h3>
              <img
                src="https://www.yogateket.com/image/original/warrior1.jpg"
                alt="Warrior I"
              />
            </div>
            <div>
              <h3>Warrior II</h3>
              <img
                src="https://media.istockphoto.com/id/1179805345/photo/girl-standing-in-warrior-two-exercise-virabhadrasana-pose.jpg?s=612x612&w=0&k=20&c=gRaEhKtIbZOuVSf9clw2cNd4wrwOhvyl3QLjavy9nlU="
                alt="Warrior II"
              />
            </div>
            <div>
              <h3>Extended Side Angle</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2021/11/Extended-Side-Angle-Pose_Andrew-Clark_2400x1350.jpeg"
                alt="Extended Side Angle"
              />
            </div>
            <div>
              <h3>Triangle Pose</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg"
                alt="Triangle Pose"
              />
            </div>
            <div>
              <h3>Revolved Extended Side Angle</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2021/09/Revolved-Side-Angle-Pose_Andrew-Clark_1.jpg"
                alt="Revolved Extended Side Angle"
              />
            </div>
            <div>
              <h3>Half Moon</h3>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Ardha_Chandrasana.jpg/1200px-Ardha_Chandrasana.jpg"
                alt="Half Moon Pose"
              />
            </div>
            <div>
              <h3>Tree Pose</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2022/01/Tree-Pose_Alt-1_2400x1350_Andrew-Clark.jpeg"
                alt="Tree Pose"
              />
            </div>
            <div>
              <h3>Eagle Pose</h3>
              <img
                src="https://images.ctfassets.net/p0sybd6jir6r/nXYVGHIRslR3z6GYAWezw/94c5d6c27f0131608c18cf7bc5bc9736/Eagle_Pose_7-a114d91f3048bad2c7c287670a54d664.jpg"
                alt="Eagle Pose"
              />
            </div>
            <div>
              <h3>Locust Pose</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2022/03/locust-pose_andrew-clark.jpg"
                alt="Locust Pose"
              />
            </div>
            <div>
              <h3>Bow Pose</h3>
              <img
                src="https://fitsri.com/wp-content/uploads/2020/01/bow-pose.jpg"
                alt="Bow Pose"
              />
            </div>
            <div>
              <h3>Child’s Pose</h3>
              <img
                src="https://www.theyogacollective.com/wp-content/uploads/2019/10/4143473057707883372_IMG_8546-2-1200x800.jpg"
                alt="Child’s Pose"
              />
            </div>
            <div>
              <h3>Bridge Pose</h3>
              <img
                src="https://cdn.yogajournal.com/wp-content/uploads/2021/11/YJ_Bridge-Pose_Andrew-Clark_2400x1350.png"
                alt="Bridge Pose"
              />
            </div>
            <div>
              <h3>Wheel Pose</h3>
              <img
                src="https://t3.ftcdn.net/jpg/01/67/89/16/360_F_167891649_sTiFJUS9If8ow9KHsCZF9mVx5NX0npOV.jpg"
                alt="Wheel Pose"
              />
            </div>
            <div>
              <h3>Shoulderstand</h3>
              <img
                src="https://mindbodygreen-res.cloudinary.com/image/upload/c_fill,w_1200,h_800,g_auto,q_90,fl_lossy,f_jpg/org/nmwu80x8uk87k61fl.jpg"
                alt="Shoulderstand"
              />
            </div>
            <div>
              <h3>Fish Pose</h3>
              <img
                src="https://media.istockphoto.com/id/924163524/photo/young-woman-doing-matsyasana-exercise.jpg?s=612x612&w=0&k=20&c=MHHxaRFvbyBBzZFcaSSvQq4LEs3x42I9tLpQACXizSs="
                alt="Fish Pose"
              />
            </div>
            <div>
              <h3>Savasana</h3>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5oqh9RCo_qEcrhFgzzfi2oVj3hS83XwxBkA&s"
                alt="Savasana"
              />
            </div>
            <div>
              <h3>Yogi Mudra</h3>
              <img
                src="https://img.freepik.com/premium-photo/female-yogi-pilates-trainer-starting-her-daily-training-with-meditation-get-peace-mind_926199-2721359.jpg"
                alt="Yogi Mudra"
              />
            </div>
        </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default VataPitta;
