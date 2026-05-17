import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { createClient } from "@supabase/supabase-js";
import "../styles/login.css";

// Initialize Supabase Client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [backgroundItems, setBackgroundItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchBackgroundMovies = async () => {
      try {
        const { data, error } = await supabase
          .from("Store")
          .select("id, src, title")
          .order("created_at", { ascending: false });
        if (!error && data) {
          setBackgroundItems(data.map((item: any) => <img key={item.id} src={item.src} alt={item.title || "Movie Cover"} />));
        }
      } catch (err) {
        console.error("Failed to load background movies in Login page:", err);
      }
    };
    fetchBackgroundMovies();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const envUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (username === envUsername && password === envPassword) {
      navigate("/blogwriter/NewBlog");
    } else {
      alert("Incorrect username or password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        {/* Dynamic scrolling theater movie background behind form overlay */}
        <div className="login-background-wrapper">
          <Background items={backgroundItems} />
        </div>
        
        <div className="login-overlay">
          <div className="login-card">
            {/* Elegant glassmorphic Close Button */}
            <Link to="/">
              <button className="login-close-btn" aria-label="Close Portal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </Link>
            
            <div className="login-header">
              <div className="login-pre-title">🔒 ADMIN PORTAL</div>
              <h2 className="login-title">PK MOVIE HUB</h2>
              <p className="login-subtitle">Enter credentials to manage entries</p>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  autoComplete="username"
                />
              </div>
              <div className="login-field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  autoComplete="current-password"
                />
              </div>
              
              <button type="submit" className="login-btn">
                Log In
              </button>
              
              <div className="login-footer">
                <label className="login-checkbox-label">
                  <input type="checkbox" defaultChecked className="login-checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="login-link">
                  Need Help?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
