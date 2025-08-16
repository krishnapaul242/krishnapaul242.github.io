import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

const Header = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100
      setIsScrolled(window.scrollY > scrollThreshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
    onNavigate(sectionId)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : ''
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' }
  ]

  return (
    <header 
      className={`pf-sticky-header ${isScrolled ? 'scrolled' : ''}`}
    >
      <nav className="pf-nav">
        <div className="pf-nav-brand">
          <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
            Krishna Paul
          </a>
        </div>
        <div className={`pf-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`pf-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.id); }}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
        <div 
          className={`pf-nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  )
}

export default Header
