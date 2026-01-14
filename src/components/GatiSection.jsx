import React from 'react'

const gatiBullets = [
  'Code that understands itself: auto-generated runtime, manifests, validators',
  'Timescape versioning: safe parallel versions & schema diffs',
  'Modular architecture: install modules like npm packages',
  'Zero-ops deployment: automated containers, K8s, multi-cloud',
  'Visual debugging playground & built-in observability'
]

export default function GatiSection() {
  return (
    <section id="gati" className="pf-section" style={{ padding: '100px 20px 120px' }}>
      <div className="pf-section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 className="pf-projects-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Gati</h2>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5)', background: 'var(--pf-card-bg, #111)'}}>
              <img src={"gati-wide.png"} alt="Gati framework" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.8, textAlign: 'center' }}>Backend framework: zero-ops deployment & visual playground</div>
          </div>
          <div>
            <p style={{ lineHeight: 1.55, fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Gati is a backend framework that automates runtime generation, deployment, and versioning so developers can focus on business logic.
              It combines high-performance execution with tooling for observability, visual debugging, and AI-assisted developer experience.
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {gatiBullets.map(f => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://krishnapaul.in/gati/"
                target="_blank"
                rel="noopener noreferrer"
                className="pf-show-more-btn"
                style={{ textDecoration: 'none' }}
                aria-label="Open Gati page in a new tab"
              >
                Learn More
              </a>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <img
                  src={"gati.png"}
                  alt="Gati logo"
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
