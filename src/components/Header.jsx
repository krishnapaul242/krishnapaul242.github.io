import React, { useState, useEffect } from "react";
import Scorecard from "./Scorecard";

const Header = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
    onNavigate(sectionId);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "";
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs", link: "https://dev.to/krishnapaul" },
    { id: "gati", label: "Gati" },
    { id: "flowmina", label: "Flowmina" },
    { id: "kahiye", label: "Kahiye" },
  ];

  return (
    <header
      className={`pf-sticky-header ${isScrolled ? "scrolled" : ""}`}
      style={{
        background: isScrolled ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.7)",
      }}
    >
      <nav className="pf-nav">
        <div className="pf-nav-brand">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("home");
            }}
          >
            Krishna Paul
          </a>
        </div>
        <div className={`pf-nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.link ? item.link : `#${item.id}`}
              target={item.link ? "_blank" : "_self"}
              className={`pf-nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={(e) => {
                if (item.link) return;
                e.preventDefault();
                handleNavClick(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
          {/* External links removed: Flowmina now an in-page section */}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginLeft: 12,
          }}
        >
          <div style={{ color: "var(--pf-text, #fff)", fontSize: 12 }}>
            <Scorecard
              compact
              githubUser="krishnapaul242"
              npmMaintainer="krishna.paul"
            />
          </div>
          <div
            className={`pf-nav-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
