import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Experience from './components/Experience'
import Projects from './components/Projects'
import FlowminaSection from './components/FlowminaSection'
import KahiyeSection from './components/KahiyeSection'
import Footer from './components/Footer'
import backgroundVideo from './assets/background.webm'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      // Section tracking
      const sections = document.querySelectorAll('section, main')
      const scrollPosition = window.scrollY + 120 // Account for header height

      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const offset = 120

        if (rect.top <= offset && rect.bottom >= offset) {
          setActiveSection(section.id)
        }
      })

      // Parallax effect for background video - zoom in/out effect
      const backgroundVideos = document.querySelectorAll('.background-video')
      if (backgroundVideos.length > 0) {
        const scrolled = window.pageYOffset
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = scrolled / maxScroll
        
        // Create alternating zoom effect - zoom in then out
        const zoomCycle = Math.sin(scrollProgress * Math.PI * 2) * 0.1 + 1
        const scale = Math.max(0.9, Math.min(1.3, zoomCycle)) // Limit scale between 0.9 and 1.3
        
        backgroundVideos.forEach(video => {
          video.style.transform = `translate(-50%, -50%) scale(${scale})`
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const headerHeight = 80
      const targetPosition = section.offsetTop - headerHeight
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="App">
      <div className="background-video-container">
        <video className="background-video" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="content-overlay">
        <Header 
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />
        <Hero />
        <Services />
        <Experience />
        <Projects />
  <FlowminaSection />
  <KahiyeSection />
        <Footer />
      </div>
    </div>
  )
}

export default App
