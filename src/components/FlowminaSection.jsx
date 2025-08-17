import React from 'react'
import flowminaImage from '/flowmina.jpg'
import flowminaVideo from '/Flowmina.webm'

// Compact Flowmina showcase section integrated into homepage
const featureBullets = [
  'Visual node-based flow builder',
  'Composable + inspectable nodes',
  'Lightweight runtime & async hooks',
  'Planned: persistence, collaboration, marketplace'
]

export default function FlowminaSection() {
  return (
    <section id="flowmina" className="pf-section" style={{ padding: '100px 20px 120px' }}>
      <div className="pf-section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 className="pf-projects-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Flowmina</h2>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5)' }}>
              <video src={flowminaVideo} autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.8, textAlign: 'center' }}>Quick demo capture</div>
          </div>
          <div>
            <p style={{ lineHeight: 1.55, fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Flowmina is an experimental workflow visualization & automation sandbox. Model processes as connected nodes with
              real-time evaluation, explore ideas rapidly, and evolve into shareable, persisted flows.
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {featureBullets.map(f => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://flowmina.krishnapaul.in"
                target="_blank"
                rel="noopener noreferrer"
                className="pf-show-more-btn"
                style={{ textDecoration: 'none' }}
                aria-label="Open Flowmina playground in a new tab"
              >
                Open Playground
              </a>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <img
                  src={flowminaImage}
                  alt="Flowmina logo"
                  style={{ maxWidth: '110px', width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 2px 12px -2px rgba(0,0,0,0.5)', opacity: 0.95 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
