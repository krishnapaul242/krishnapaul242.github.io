import React, { useState, useEffect } from 'react'
import ContactModal from './ContactModal'
import CompatibilityCheck from './CompatibilityCheck'

const Header = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          
          // Header is hidden at top (0), visible when scrolled
          if (scrollPosition === 0) {
            setIsScrolled(false)
            setIsHeaderVisible(false)
          } else {
            setIsScrolled(scrollPosition > 50)
            setIsHeaderVisible(true)
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    // Initial setup - header is hidden at page load if at top
    const initialScrollPosition = window.scrollY
    if (initialScrollPosition === 0) {
      setIsScrolled(false)
      setIsHeaderVisible(false)
    } else {
      setIsScrolled(initialScrollPosition > 50)
      setIsHeaderVisible(true)
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

  const openContactModal = () => {
    setIsContactModalOpen(true)
    setIsMobileMenuOpen(false)
    document.body.style.overflow = 'hidden'
  }

  const closeContactModal = () => {
    setIsContactModalOpen(false)
    document.body.style.overflow = ''
  }

  const openCompatibilityModal = () => {
    setIsCompatibilityModalOpen(true)
    setIsMobileMenuOpen(false)
    document.body.style.overflow = 'hidden'
  }

  const closeCompatibilityModal = () => {
    setIsCompatibilityModalOpen(false)
    document.body.style.overflow = ''
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' }
  ]

  return (
    <header 
      className={`pf-sticky-header ${isScrolled ? 'scrolled' : ''} ${!isHeaderVisible ? 'hidden' : ''}`}
      style={{
        background: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
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
          <div className="nav-actions">
            <button 
              className="compatibility-trigger-btn"
              onClick={openCompatibilityModal}
              title="Check your compatibility with available roles"
            >
              🤖 AI Check
            </button>
            <button 
              className="contact-trigger-btn"
              onClick={openContactModal}
            >
              Contact Me
            </button>
          </div>
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
      
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
      />
      
      <CompatibilityCheck 
        isOpen={isCompatibilityModalOpen} 
        onClose={closeCompatibilityModal} 
      />
    </header>
  )
}

export default Header
