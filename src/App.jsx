import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section, main')
      const scrollPosition = window.scrollY + 120 // Account for header height

      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const offset = 120

        if (rect.top <= offset && rect.bottom >= offset) {
          setActiveSection(section.id)
        }
      })
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
      <Header 
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <Hero />
      <Services />
      <Experience />
      <Projects />
      <Footer />
    </div>
  )
}

export default App
