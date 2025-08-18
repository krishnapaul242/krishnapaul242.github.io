import React, { useState, useEffect } from 'react'
import projectsData from '../data/projects.json'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [selectedTechnology, setSelectedTechnology] = useState('All')
  const [showMore, setShowMore] = useState(false)
  const [technologies, setTechnologies] = useState([])

  // Technology icons mapping
  const technologyIcons = {
    'React': 'fab fa-react',
    'React Native': 'fab fa-react',
    'NextJS': 'fab fa-react',
    'TypeScript': 'fab fa-js-square',
    'JavaScript': 'fab fa-js-square',
    'Android': 'fab fa-android',
    'iOS': 'fab fa-apple',
    'Web': 'fas fa-globe',
    'Swift': 'fab fa-swift',
    'NPM': 'fab fa-npm',
    'Docker': 'fab fa-docker',
    'Java': 'fab fa-java',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'SVG': 'fas fa-code',
    'Behavior Analysis': 'fas fa-brain',
  'AI': 'fas fa-brain',
  'Chat': 'fas fa-comments',
    'Camera': 'fas fa-camera',
    'Expo': 'fas fa-mobile-alt',
    'Next.js': 'fab fa-react'
  }

  useEffect(() => {
    setProjects(projectsData.projects)
    setFilteredProjects(projectsData.projects)
    
    // Extract unique technologies for filter
    const allTechs = new Set()
    projectsData.projects.forEach(project => {
      project.technologies.forEach(tech => allTechs.add(tech))
    })
    setTechnologies(['All', ...Array.from(allTechs).sort()])
  }, [])

  useEffect(() => {
    if (selectedTechnology === 'All') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => 
        project.technologies.includes(selectedTechnology)
      ))
    }
  }, [selectedTechnology, projects])

  const toggleProjects = () => {
    setShowMore(!showMore)
  }

  // Show first 6 projects with links by default
  const projectsWithLinks = filteredProjects.filter(project => 
    project.links && project.links.length > 0
  )
  const projectsWithoutLinks = filteredProjects.filter(project => 
    !project.links || project.links.length === 0
  )
  
  let displayedProjects
  if (showMore) {
    displayedProjects = filteredProjects
  } else {
    displayedProjects = projectsWithLinks.slice(0, 6)
  }

  const getLinkIcon = (type) => {
    switch (type) {
      case 'github': return 'fab fa-github'
      case 'website': return 'fas fa-external-link-alt'
      case 'npm': return 'fab fa-npm'
      case 'playstore': return 'fab fa-google-play'
      default: return 'fas fa-external-link-alt'
    }
  }

  const getLinkText = (type) => {
    switch (type) {
      case 'github': return 'GitHub'
      case 'website': return 'Visit Site'
      case 'npm': return 'NPM Package'
      case 'playstore': return 'Play Store'
      default: return 'Visit Site'
    }
  }

  const getTechIcon = (tech) => {
    return technologyIcons[tech] || 'fas fa-cog'
  }

  const getTechClass = (tech) => {
    return tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  return (
    <section id="projects" className="pf-projects">
      <div className="pf-projects-title">Projects</div>
      
      <div className="pf-projects-filter">
        <div className="pf-filter-title">Filter by Technology:</div>
        <div className="pf-filter-badges" id="technologyFilters">
          {technologies.map(tech => (
            <button
              key={tech}
              className={`pf-filter-badge ${selectedTechnology === tech ? 'active' : ''}`}
              onClick={() => setSelectedTechnology(tech)}
            >
              {tech !== 'All' && <i className={getTechIcon(tech)}></i>} {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="pf-projects-grid" id="projectsGrid">
        {displayedProjects.map((project, index) => {
          const hasLinks = project.links && project.links.length > 0
          const cardClass = hasLinks ? 'pf-project-card pf-project-with-link' : 'pf-project-card'
          
          return (
            <div key={index} className={cardClass}>
              <div className="pf-project-card-wrapper">
                <div className="pf-project-header">
                  <h3 className="pf-project-name">{project.name}</h3>
                </div>
                
                <div className="pf-project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className={`pf-project-tech-badge ${getTechClass(tech)}`}
                    >
                      <i className={getTechIcon(tech)}></i> {tech}
                    </span>
                  ))}
                </div>
                
                <div className="pf-project-description">{project.description}</div>
                
                <div className="pf-project-details">
                  <div className="pf-project-tools"><strong>Tools:</strong> {project.tools.join(', ')}</div>
                  <div className="pf-project-languages"><strong>Languages:</strong> {project.languages.join(', ')}</div>
                  <div className="pf-project-libraries"><strong>Libraries:</strong> {project.libraries.join(', ')}</div>
                  <div className="pf-project-duration"><strong>Worked on:</strong> {project.duration}</div>
                </div>
                
                <div className="pf-project-responsibilities">
                  <strong>Responsibilities:</strong> {project.responsibilities}
                </div>

                {hasLinks && (
                  <div className="pf-project-links">
                    {project.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-project-link"
                      >
                        <i className={getLinkIcon(link.type)}></i> {getLinkText(link.type)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pf-projects-show-more">
        <button className="pf-show-more-btn" onClick={toggleProjects}>
          <span className="pf-show-more-text">
            {showMore ? 'Show Less Projects' : 'Show More Projects'}
          </span>
          <i className={`fas fa-chevron-${showMore ? 'up' : 'down'} pf-show-more-icon`}></i>
        </button>
      </div>
    </section>
  )
}

export default Projects
