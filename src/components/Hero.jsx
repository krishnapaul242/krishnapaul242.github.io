import React, { useState, useEffect } from 'react'
import socialLinksData from '../data/social-links.json'

const Hero = () => {
  const [socialLinks, setSocialLinks] = useState([])

  useEffect(() => {
    setSocialLinks(socialLinksData.socialLinks.sort((a, b) => a.order - b.order))
  }, [])

  return (
    <main id="home" className="pf-main-content">
      <div className="pf-name">Krishna Paul</div>
      <div className="pf-motto">
        <span className="pf-motto-desktop">
          Full Stack Developer. Mobile App Developer. Open Source Contributor.
        </span>
        <span className="pf-motto-mobile">
          Full Stack Developer.<br />
          Mobile App Developer.<br />
          Open Source Contributor.
        </span>
      </div>
      <div className="pf-social-pic">
        <img src="/profilepic.webp" alt="Krishna Paul" />
      </div>
      <div className="pf-description">
        Experienced full stack developer specializing in React Native, Next.js, and modern
        web technologies. Passionate about creating scalable applications and contributing to open source projects.
      </div>
      <div className="pf-social" id="socialLinksContainer">
        {socialLinks.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
          >
            <i className={link.icon}></i>
          </a>
        ))}
      </div>
    </main>
  )
}

export default Hero
