import React from 'react'
import backgroundVideo from '../assets/background.webm'
import '../App.css'

// Simple Flowmina feature list; could be expanded with screenshots/assets later
const features = [
  {
    title: 'Visual Flow Builder',
    description: 'Drag, connect, and configure nodes to represent tasks, decisions, API calls, timers, or transformations.'
  },
  {
    title: 'Composable Nodes',
    description: 'Each node is a modular unit with inputs, outputs, and validation patterns to encourage reuse.'
  },
  {
    title: 'State Inspection',
    description: 'Live preview of node state & propagated outputs for easier debugging and learning.'
  },
  {
    title: 'Lightweight Runtime',
    description: 'Executes flows step-by-step with hooks for async operations (fetch, debounce, schedule, etc.).'
  },
  {
    title: 'Persistence Ready',
    description: 'Architecture built to serialize flows to JSON for storage, sharing, or versioning.'
  },
  {
    title: 'Keyboard Friendly',
    description: 'Quick node search, duplication, and structured navigation improve productivity.'
  }
]

export default function Flowmina() {
  return (
    <div className="App">
      <div className="background-video-container">
        <video className="background-video" autoPlay loop muted playsInline>
          <source src={backgroundVideo} type="video/webm" />
        </video>
      </div>
      <div className="content-overlay">
        <header className="pf-sticky-header" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <nav className="pf-nav">
            <div className="pf-nav-brand">
              <a href="/">Krishna Paul</a>
            </div>
            <div className="pf-nav-menu">
              <a href="/flowmina" className="pf-nav-link active">Flowmina</a>
              <a href="/" className="pf-nav-link">Portfolio</a>
            </div>
          </nav>
        </header>

        <main className="pf-hero" id="flowmina" style={{ minHeight: 'auto', paddingTop: '140px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Flowmina</h1>
          <p style={{ maxWidth: 800, lineHeight: 1.5, fontSize: '1.1rem' }}>
            Flowmina is an experimental workflow visualization & automation sandbox. It focuses on clarity, composability, and quick iteration—
            enabling you to model processes as connected nodes with real-time evaluation. This page showcases its core concepts & planned evolution.
          </p>
        </main>

        <section id="features" style={{ padding: '40px 20px 80px' }}>
          <h2 className="pf-projects-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Key Features</h2>
          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', maxWidth: 1200, margin: '0 auto' }}>
            {features.map(f => (
              <div key={f.title} className="pf-project-card" style={{ backdropFilter: 'blur(4px)' }}>
                <div className="pf-project-card-wrapper">
                  <h3 className="pf-project-name" style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                  <div className="pf-project-description" style={{ fontSize: '0.95rem' }}>{f.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" style={{ padding: '0 20px 120px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Try It</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              The hosted instance is available at{' '}
              <a href="https://flowmina.krishnapaul.in" target="_blank" rel="noopener noreferrer">flowmina.krishnapaul.in</a>. 
              Future updates will include saving, importing/exporting flows, collaboration primitives, and node marketplace concepts.
            </p>
            <a href="/" className="pf-show-more-btn" style={{ textDecoration: 'none' }}>Back to Portfolio</a>
          </div>
        </section>

        <footer className="pf-footer" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <div className="pf-footer-content">
            <div className="pf-footer-text">&copy; {new Date().getFullYear()} Krishna Paul. Flowmina showcase.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
