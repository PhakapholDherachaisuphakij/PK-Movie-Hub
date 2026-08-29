import { Link, useLocation } from "react-router-dom";
import { JSX, useState, useEffect } from "react";
import "../styles/Nav.css";

export default function Navbar(): JSX.Element {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`pk-navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="pk-navbar-container">
        <Link to="/" className="pk-brand-logo">
          <span className="brand-accent">PK</span>
          <span className="brand-white">FLIX</span>
          <span className="brand-dot"></span>
        </Link>

        <nav className="pk-nav-links">
          <Link to="/" className={`pk-nav-item ${isActive("/") ? "active" : ""}`}>
            <span>Home</span>
          </Link>
          <Link to="/collection" className={`pk-nav-item ${isActive("/collection") ? "active" : ""}`}>
            <span>Browse Collection</span>
          </Link>
        </nav>

        <div className="pk-nav-actions">
          <Link to="/admin/login" className="pk-admin-pill-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            <span>Admin Blog</span>
          </Link>
        </div>
      </div>
    </header>
  );
}