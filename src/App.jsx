import React, { useState } from 'react';
import profile from './assets/profilepic.webp';
import experience from './data/experience.json';
import projects from './data/projects.json';
import socials from './data/social-links.json';
import services from './data/services.json';
import './App.css';

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
const Arrow = () => <span aria-hidden="true">↗</span>;
const featured = [
  { name: 'Gati', type: 'BACKEND FRAMEWORK', text: 'Less infrastructure. More possibility.', description: 'A TypeScript-first backend framework that brings runtime generation, versioning, and deployment together.', tags: ['TypeScript', 'Node.js', 'Cloud native'], url: 'https://krishnapaul.in/gati/', theme: 'gati', mark: 'gati', detail: 'Build what matters.' },
  { name: 'Flowmina', type: 'WORKFLOW AUTOMATION', text: 'Connect ideas. Build workflows.', description: 'An experimental visual playground for modeling processes, connecting nodes, and exploring automation.', tags: ['Visual editor', 'Automation', 'Web'], url: 'https://flowmina.krishnapaul.in', theme: 'flowmina', mark: 'flowmina', detail: 'Ideas, in flow.' },
  { name: 'Kahiye', type: 'CONVERSATIONAL AI', text: 'A little curiosity. A conversation.', description: 'A conversational AI playground exploring streaming responses, layered prompts, and thoughtful chat experiences.', tags: ['AI', 'Streaming', 'Chat UX'], url: 'https://kahiye.krishnapaul.in', theme: 'kahiye', mark: 'कहिए', detail: 'Start a conversation.' },
];

export default function App() {
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState('All work');
  const [expanded, setExpanded] = useState(false);
  const [activeJob, setActiveJob] = useState(0);
  const [archive, setArchive] = useState(false);
  const filters = ['All work', 'Web', 'Mobile', 'Open source'];
  const visible = projects.projects.filter(p => filter === 'All work' || (filter === 'Open source' ? p.links.some(l => l.type === 'npm' || l.type === 'github') : p.technologies.some(t => filter === 'Mobile' ? /mobile|android|ios|react native/i.test(t) : /web|react|next/i.test(t))));
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header wrap">
      <a className="wordmark" href="#home" aria-label="Krishna Paul home">kp<span>.</span></a>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? 'Close −' : 'Menu +'}</button>
      <nav className={menu ? 'nav open' : 'nav'} aria-label="Main navigation">
        {[['work', 'Work'], ['about', 'About'], ['experience', 'Experience']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{label}</a>)}
        <a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <Arrow /></a>
      </nav>
    </header>
    <main id="main">
      <section id="home" className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot" /> DEVELOPER. BUILDER. CURIOUS HUMAN.</div>
          <h1>Turning complex<br />ideas into<br /><em>simple experiences.</em></h1>
          <p className="hero-intro">Hey, I’m Krishna Paul <span className="wave" aria-hidden="true">✳</span></p>
          <p className="hero-description">A full stack & mobile developer building thoughtful digital products, useful tools, and things for the open source community.</p>
          <div className="hero-actions"><a className="button" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a className="text-link" href={asset('KrishnaPaulCV.pdf')} target="_blank" rel="noreferrer">View résumé <Arrow /></a></div>
        </div>
        <div className="portrait-scene">
          <div className="portrait-label">A LITTLE LOGIC. A LOT OF CURIOSITY.</div>
          <div className="portrait-frame"><img src={profile} alt="Krishna Paul" /><span className="portrait-cross">+</span></div>
          <div className="portrait-sticker"><span aria-hidden="true">✳</span> Always<br />building.</div>
          <div className="portrait-caption"><span className="dot" /> BASED IN INDIA · BUILDING FOR THE WEB</div>
        </div>
        <div className="hero-bottom"><span>GOOD SOFTWARE STARTS WITH A GOOD QUESTION.</span><a href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
      </section>
      <div className="tool-strip"><div className="wrap"><span>MY EVERYDAY TOOLKIT</span>{['TypeScript', 'React', 'React Native', 'Next.js', 'Node.js', 'Docker'].map(t => <span key={t} className="tool">{t}</span>)}</div></div>
      <section id="work" className="section wrap">
        <div className="section-heading"><div><div className="eyebrow">01 / SELECTED WORK</div><h2>Built with purpose.<br /><span>And a bit of obsession.</span></h2></div><p>A few things I’ve been building.<br />From developer tools to everyday experiences.</p></div>
        <div className="featured-grid">{featured.map((p, i) => <article className="project" key={p.name} id={p.theme}>
          <a className={`project-visual ${p.theme}`} href={p.url} target="_blank" rel="noreferrer" aria-label={`Explore ${p.name}`}>
            <span className="visual-index">0{i + 1} / {p.type}</span>
            {p.theme === 'flowmina' ? <div className="flow-art"><div className="flow-node">↳ Trigger</div><div className="flow-line"/><div className="flow-node middle">✳ Transform</div><div className="flow-line"/><div className="flow-node">↗ Output</div></div> : <div className="project-mark">{p.mark}<small>{p.detail}</small></div>}
            <span className="project-open"><Arrow /></span>
          </a>
          <div className="project-meta"><h3>{p.name}</h3><span>{p.type}</span></div><h4>{p.text}</h4><p>{p.description}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
        </article>)}</div>
        <div className="work-more"><span>There’s more where that came from.</span><button className="text-link" aria-expanded={archive} onClick={() => setArchive(!archive)}>{archive ? 'Close project archive −' : 'Explore all projects + '}</button></div>
        {archive && <div className="archive"><div className="filters" aria-label="Filter projects">{filters.map(f => <button key={f} aria-pressed={f === filter} onClick={() => { setFilter(f); setExpanded(false); }}>{f}</button>)}</div><div className="archive-grid">{visible.slice(0, expanded ? undefined : 6).map(p => <article key={p.name}><h3>{p.name}</h3><p>{p.description}</p><div className="tags">{p.technologies.slice(0, 3).map(t => <span key={t}>{t}</span>)}</div><div className="archive-links">{p.links.map(l => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.type} <Arrow /></a>)}</div></article>)}</div>{visible.length > 6 && <button className="text-link" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer −' : `Show all ${visible.length} projects +`}</button>}</div>}
      </section>
      <section id="about" className="about-section"><div className="wrap about-grid"><div><div className="eyebrow">02 / THE PERSON BEHIND THE CODE</div><h2>Engineer by trade.<br /><em>Builder by nature.</em></h2></div><div className="about-copy"><p>I enjoy figuring out how things work — and how to make them work better.</p><p>My work spans web applications, mobile experiences, backend systems, and cloud infrastructure. I care about the whole picture: the architecture under the hood and the person on the other side of the screen.</p><p>Along the way, I build open source libraries and experiment with tools that make a developer’s day a little easier.</p><a className="text-link" href="https://github.com/krishnapaul242/" target="_blank" rel="noreferrer">Find me on GitHub <Arrow /></a></div><div className="numbers"><div><strong>2020</strong><span>Started building professionally</span></div><div><strong>{projects.projects.length}+</strong><span>Projects across web & mobile</span></div><div><strong>4</strong><span>Teams I’ve been part of</span></div></div></div></section>
      <section id="experience" className="section wrap"><div className="section-heading"><div><div className="eyebrow">03 / THE JOURNEY SO FAR</div><h2>Good teams.<br /><span>Meaningful work.</span></h2></div><a className="text-link" href={asset('KrishnaPaulCV.pdf')} target="_blank" rel="noreferrer">View full résumé <Arrow /></a></div><div className="experience-list">{experience.experience.map((job, i) => <article className={`job ${activeJob === i ? 'selected' : ''}`} key={job.id}><button className="job-toggle" onClick={() => setActiveJob(activeJob === i ? -1 : i)} aria-expanded={activeJob === i} aria-controls={`job-${i}`}><span className="job-year">{job.year}</span><span className="job-title"><strong>{job.position}</strong><span>{job.company}</span></span><span className="job-sign">{activeJob === i ? '−' : '+'}</span></button>{activeJob === i && <div className="job-details" id={`job-${i}`}><p>{job.duration} · {job.location}</p><ul>{job.responsibilities.map(r => <li key={r}>{r}</li>)}</ul></div>}</article>)}</div></section>
      <section id="services" className="services-section wrap"><div className="eyebrow">04 / HOW I CAN HELP</div><div className="service-heading"><h2>From the first idea<br />to the final deploy.</h2><p>Hands-on engineering, across the stack.</p></div><div className="service-grid">{[['01', 'Web experiences', 'Fast, accessible interfaces with React, Next.js, and TypeScript.'], ['02', 'Mobile applications', 'Cross-platform apps built with React Native for Android and iOS.'], ['03', 'Systems & infrastructure', 'Scalable backends, thoughtful architecture, and reliable deployments.']].map(([n,t,d]) => <div key={n}><span className="service-number">{n} /</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
      <section id="contact" className="contact-section"><div className="wrap contact-grid"><div><div className="eyebrow">HAVE SOMETHING IN MIND?</div><h2>Let’s build<br />something <em>good.</em><span className="contact-star" aria-hidden="true">✳</span></h2><p>A project, a collaboration, or just a good conversation.<br />I’d love to hear from you.</p><a className="email-link" href="mailto:krishnapaulmailbox@gmail.com">krishnapaulmailbox@gmail.com <Arrow /></a></div><form action="https://send.pageclip.co/zKXWmL6UblXejMyBvwbrHn3XWauUJCPU" method="post"><div className="form-row"><label>Your name<input name="name" placeholder="Alex Smith" required autoComplete="name" /></label><label>Email address<input name="contact" type="email" placeholder="alex@example.com" required autoComplete="email" /></label></div><label>What are you thinking?<select name="service" defaultValue=""><option value="">Select a service (optional)</option>{services.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}<option value="other">Something else</option></select></label><label>A little about your idea<textarea name="query" placeholder="Tell me what you’d like to build…" rows="3" required /></label><button className="button" type="submit">Send message <Arrow /></button></form></div></section>
    </main>
    <footer className="wrap footer"><a className="wordmark" href="#home">kp<span>.</span></a><span>© {new Date().getFullYear()} Krishna Paul · Built with care.</span><div>{socials.socialLinks.filter(s => ['github','linkedin','npm','codepen'].includes(s.id)).map(s => <a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.name} <Arrow /></a>)}<a href="#home" aria-label="Back to top">↑</a></div></footer>
  </>;
}
