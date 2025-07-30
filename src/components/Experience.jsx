import React, { useState, useEffect } from 'react'
import experienceData from '../data/experience.json'

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setExperiences(experienceData.experience)
    setCurrentIndex(0)
  }, [])

  const handleTimelineClick = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section id="experience" className="pf-experience">
      <div className="pf-experience-title">Work Experience</div>
      <div className="pf-timeline" id="experienceTimeline">
        <div className="pf-timeline-items" id="timelineItems">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`pf-timeline-item ${index === currentIndex ? 'active' : ''}`}
              data-index={index}
              onClick={() => handleTimelineClick(index)}
            >
              <div className="pf-timeline-company">{exp.company}</div>
              <div className="pf-timeline-dot"></div>
              <div className="pf-timeline-year">{exp.year}</div>
            </div>
          ))}
        </div>
        
        <div id="timelineDetails">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`pf-timeline-details ${index === currentIndex ? 'active' : ''}`}
              data-index={index}
            >
              <div className="pf-timeline-header">
                <div className="pf-timeline-header-left">
                  <div className="pf-timeline-company">{exp.company}</div>
                  <div className="pf-timeline-location">{exp.location}</div>
                </div>
                <div className="pf-timeline-header-right">
                  <div className="pf-timeline-position">{exp.position}</div>
                  <div className="pf-timeline-duration">{exp.duration}</div>
                </div>
              </div>
              <div className="pf-timeline-description">
                <ul>
                  {exp.responsibilities.map((responsibility, respIndex) => (
                    <li key={respIndex}>{responsibility}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
