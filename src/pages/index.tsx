import "../styles/Home.css";
import Background from "../components/Background";
import Twinkling from "../../src/images/twinkling-watermelon.png";
import Undercover from "../../src/images/undercover.jpg";
import Qot from "../../src/images/qot.jpg";
import lovelyrunner from "../../src/images/lovelyrunner.jpg";
import startup from "../../src/images/startup.jpg";
import tangurine from "../../src/images/tangurine.jpg";
import topgun from "../../src/images/topgun.jpg";
import vagabond from "../../src/images/vagabond.jpg";
import twenty from "../../src/images/20cen.jpg";
import nextdoor from "../../src/images/nextdoor.jpg";
import hyperknife from "../../src/images/hyperknife.jpg";
import friendlyrivalry from "../../src/images/friendly-rivalry.jpg";
import mydearestnemesis from "../../src/images/dearest-nemesis.jpg";
import residentplaybook from "../../src/images/resident-playbook.png";
import weakhero from "../../src/images/weakhero.jpg";
import weakhero2 from "../../src/images/weakhero2.png";
import moving from "../../src/images/moving.jpg";
import alchemyofsoul from "../../src/images/alchemy.jpg";
import { JSX } from "react";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const STATIC_FALLBACK_ITEMS: JSX.Element[] = [
  <img key="vagabond-1" src={vagabond} alt="Vagabond Image" />,
  <img key="twinkling-watermelon-1" src={Twinkling} alt="Twinkling Watermelon Image" />,
  <img key="resident-playbook-1" src={residentplaybook} alt="Resident Playbook Image" />,
  <img key="queen-of-tears-1" src={Qot} alt="Queen of Tears Image" />,
  <img key="tangerine-1" src={tangurine} alt="Tangerine Image" />,
  <img key="weak-hero-class-2-1" src={weakhero2} alt="Weak Hero Class 2 Image" />,
  <img key="next-door-1" src={nextdoor} alt="Next Door Image" />,
  <img key="lovely-runner-1" src={lovelyrunner} alt="Lovely Runner Image" />,
  <img key="my-dearest-nemesis-1" src={mydearestnemesis} alt="My Dearest Nemesis Image" />,
  <img key="hyper-knife-1" src={hyperknife} alt="Hyper Knife Image" />,
  <img key="start-up-1" src={startup} alt="Start-Up Image" />,
  <img key="friendly-rivalry-1" src={friendlyrivalry} alt="Friendly Rivalry Image" />,
  <img key="20th-century-girl-1" src={twenty} alt="20th Century Girl Image" />,
  <img key="undercover-high-school-1" src={Undercover} alt="Undercover High School Image" />,
  <img key="top-gun-1" src={topgun} alt="Top Gun Image" />,
  <img key="moving-1" src={moving} alt="Moving Image" />,
  <img key="weak-hero-class-1-1" src={weakhero} alt="Weak Hero Class 1 Image" />,
  <img key="twinkling-watermelon-2" src={Twinkling} alt="Twinkling Watermelon Image" />,
  <img key="resident-playbook-2" src={residentplaybook} alt="Resident Playbook Image" />,
  <img key="alchemy-of-soul" src={alchemyofsoul} alt="Hyper Knife Image" />,
  <img key="queen-of-tears-2" src={Qot} alt="Queen of Tears Image" />,
  <img key="moving-2" src={moving} alt="Moving Image" />,
  <img key="tangerine-2" src={tangurine} alt="Tangerine Image" />,
  <img key="lovely-runner-2" src={lovelyrunner} alt="Lovely Runner Image" />,
  <img key="next-door-2" src={nextdoor} alt="Next Door Image" />,
  <img key="alchemy-of-soul" src={alchemyofsoul} alt="Hyper Knife Image" />,
  <img key="start-up-2" src={startup} alt="Start-Up Image" />,
  <img key="20th-century-girl-2" src={twenty} alt="20th Century Girl Image" />,
];

function Index() {
  const [backgroundItems, setBackgroundItems] = useState<JSX.Element[]>(STATIC_FALLBACK_ITEMS);

  useEffect(() => {
    const loadBackgroundMovies = async () => {
      try {
        const { data, error } = await supabase
          .from("Store")
          .select("id, src, title")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const fetchedItems = data.map((movie) => (
            <img key={movie.id} src={movie.src} alt={movie.title} />
          ));
          setBackgroundItems(fetchedItems);
        }
      } catch (err) {
        console.error("Error loading dynamic background items:", err);
      }
    };
    loadBackgroundMovies();
  }, []);

  return (
    <div className="home-container">
      <div className="background-wrapper">
        <Background items={backgroundItems} />
      </div>
      
      <div className="home-overlay">
        <div className="home-card">
          <div className="home-pre-badge">
            <span className="live-pulse-dot"></span>
            <span>PHAKAPHOL'S CURATED DIARY</span>
          </div>

          <h1 className="home-title">
            <span>PK</span>
            <span className="title-highlight">FLIX</span>
          </h1>
          <h2 className="home-subtitle">Personal Cinema & Series Hub</h2>
          
          <p className="home-description">
            A meticulously curated diary of cinematic masterpieces, emotional K-Dramas, action-packed blockbusters, and unfiltered reviews.
          </p>

          <div className="home-feature-tags">
            <span className="feature-pill">
              <span className="pill-icon">🎬</span> 100+ Titles
            </span>
            <span className="feature-pill">
              <span className="pill-icon">⭐</span> Honest Ratings
            </span>
            <span className="feature-pill">
              <span className="pill-icon">🏆</span> Top 10 Hall of Fame
            </span>
          </div>

          <div className="home-btn-group">
            <Link to="/collection" className="home-btn primary-btn">
              <span>EXPLORE COLLECTION</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/admin/login" className="home-btn secondary-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>Writing Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;