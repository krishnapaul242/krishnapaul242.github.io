import React from 'react'
import kahiyeVideo from '/kahiye.webm'
import kahiyeLogo from '/kahiye-logo.png'

const kahiyeBullets = [
  'Streaming token responses (smooth incremental UI)',
  'Prompt + layered transient memory experiments',
  'Draft tool / function invocation pipeline',
  'Lightweight themable chat surface',
  'Focus: fast iteration & UX instrumentation'
]

export default function KahiyeSection() {
  return (
    <section id="kahiye" className="pf-section" style={{ padding: '100px 20px 120px' }}>
      <div className="pf-section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 className="pf-projects-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Kahiye</h2>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', alignItems: 'start' }}>
          <div>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px -4px rgba(0,0,0,0.5)' }}>
              <video src={kahiyeVideo} autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', opacity: 0.8, textAlign: 'center' }}>Streaming chat demo capture</div>
          </div>
          <div>
            <p style={{ lineHeight: 1.55, fontSize: '1.05rem', marginBottom: '1.25rem' }}>
              Kahiye is a conversational AI playground exploring streaming UX, prompt layering, and future tool invocation.
              It emphasizes minimal surface + rapid iteration instrumentation to refine interaction patterns.
            </p>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {kahiyeBullets.map(f => <li key={f}>{f}</li>)}
            </ul>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://kahiye.krishnapaul.in"
                target="_blank"
                rel="noopener noreferrer"
                className="pf-show-more-btn"
                style={{ textDecoration: 'none' }}
                aria-label="Open Kahiye playground in a new tab"
              >
                Open App
              </a>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <img
                  src={kahiyeLogo}
                  alt="Kahiye logo"
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
