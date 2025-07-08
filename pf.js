// Sticky Navigation Header functionality
document.addEventListener("DOMContentLoaded", function () {
  const stickyHeader = document.getElementById('stickyHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.pf-nav-link');
  const sections = document.querySelectorAll('section, main');
  
  let isScrolled = false;
  let ticking = false;

  // Show/hide sticky header based on scroll
  function updateStickyHeader() {
    const isAtTop = window.scrollY <= 50;
    
    if (isAtTop !== !isScrolled) {
      isScrolled = !isAtTop;
      if (isAtTop) {
        stickyHeader.classList.remove('scrolled');
        stickyHeader.style.background = 'rgba(0, 0, 0, 0.7)';
      } else {
        stickyHeader.classList.add('scrolled');
        stickyHeader.style.background = 'rgba(0, 0, 0, 0.95)';
      }
    }
  }

  // Throttled scroll handler
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateStickyHeader();
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Update active navigation link based on current section
  function updateActiveNavLink() {
    let currentSection = '';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = 120; // Account for header height
      
      if (rect.top <= offset && rect.bottom >= offset) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Mobile menu toggle
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      // Smooth scroll to section
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        const headerHeight = 80;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!stickyHeader.contains(e.target) && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Listen for scroll events
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Initial calls
  updateStickyHeader();
  updateActiveNavLink();
});

// Timeline auto-rotation functionality
document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".pf-timeline-item");
  const timelineDetails = document.querySelectorAll(".pf-timeline-details");
  let currentIndex = 0;
  let autoRotateInterval;
  let clickPauseTimeout;
  let isMouseOverDetails = false;
  let isClickPaused = false;

  function showExperience(index) {
    // Remove active class from all items and details
    timelineItems.forEach((item) => item.classList.remove("active"));
    timelineDetails.forEach((detail) => detail.classList.remove("active"));

    // Add active class to current item and detail
    if (timelineItems[index]) {
      timelineItems[index].classList.add("active");
    }
    if (timelineDetails[index]) {
      timelineDetails[index].classList.add("active");
    }

    currentIndex = index;
  }

  function nextExperience() {
    // Don't auto-advance if mouse is over details or click-paused
    if (isMouseOverDetails || isClickPaused) {
      return;
    }
    // Guard against empty timelineItems
    if (timelineItems.length === 0) {
      return;
    }
    const nextIndex = (currentIndex + 1) % timelineItems.length;
    showExperience(nextIndex);
  }

  function startAutoRotation() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
    autoRotateInterval = setInterval(nextExperience, 5000); // 5 seconds
  }

  function stopAutoRotation() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
  }

  function pauseForClick() {
    isClickPaused = true;
    if (clickPauseTimeout) {
      clearTimeout(clickPauseTimeout);
    }
    clickPauseTimeout = setTimeout(() => {
      isClickPaused = false;
    }, 30000); // 30 seconds
  }

  // Add click event listeners to timeline items
  timelineItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      showExperience(index);
      pauseForClick(); // Pause for 30 seconds after click
    });
  });

  // Handle mouse over/out for timeline details
  timelineDetails.forEach((detail) => {
    detail.addEventListener("mouseenter", function() {
      isMouseOverDetails = true;
    });
    detail.addEventListener("mouseleave", function() {
      isMouseOverDetails = false;
    });
  });

  // Start auto-rotation when page loads
  startAutoRotation();

  // Pause auto-rotation when page is not visible
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoRotation();
    } else {
      startAutoRotation();
    }
  });
});

// Projects Show More functionality
function toggleProjects() {
  const projectsGrid = document.querySelector('.pf-projects-grid');
  const showMoreBtn = document.querySelector('.pf-show-more-btn');
  const showMoreText = document.querySelector('.pf-show-more-text');
  const showMoreIcon = document.querySelector('.pf-show-more-icon');
  
  if (projectsGrid.classList.contains('show-all')) {
    // Hide extra projects - go back to showing only latest 6 with links
    projectsGrid.classList.remove('show-all');
    showMoreText.textContent = 'Show More Projects';
    showMoreBtn.classList.remove('expanded');
    
    // Apply default display logic
    applyDefaultProjectDisplay();
    
    // Smooth scroll to projects section when collapsing
    document.querySelector('.pf-projects').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    // Show all projects
    projectsGrid.classList.add('show-all');
    showMoreText.textContent = 'Show Less Projects';
    showMoreBtn.classList.add('expanded');
    
    // Show all projects
    const projectCards = document.querySelectorAll('.pf-project-card');
    projectCards.forEach(card => {
      card.style.display = 'block';
    });
  }
}

// Technology Filter initialization moved to project loader
// This is handled by loadProjects() function

// Technology Filter functionality (deprecated - now handled by JSON loader)
// This function is kept for compatibility but will be overridden by the JSON loader
function initializeTechnologyFilters() {
  // This will be handled by the new JSON-based initializeTechnologyFilters function
  return;
}

function createShowMoreBadge(hiddenCount) {
  const badge = document.createElement('div');
  badge.className = 'pf-filter-badge pf-filter-show-more';
  
  badge.innerHTML = `
    <i class="fas fa-plus"></i>
    <span class="show-more-text">Show More</span>
    <span class="filter-count">${hiddenCount}</span>
  `;
  
  return badge;
}

function toggleHiddenFilters(filterContainer) {
  const hiddenBadges = filterContainer.querySelectorAll('.pf-filter-badge-hidden');
  const showMoreBadge = filterContainer.querySelector('.pf-filter-show-more');
  const showMoreText = showMoreBadge.querySelector('.show-more-text');
  const showMoreIcon = showMoreBadge.querySelector('i');
  
  const isExpanded = showMoreBadge.classList.contains('expanded');
  
  if (isExpanded) {
    // Hide badges
    hiddenBadges.forEach(badge => {
      badge.classList.add('pf-filter-badge-hidden');
    });
    showMoreText.textContent = 'Show More';
    showMoreIcon.className = 'fas fa-plus';
    showMoreBadge.classList.remove('expanded');
  } else {
    // Show badges
    hiddenBadges.forEach(badge => {
      badge.classList.remove('pf-filter-badge-hidden');
    });
    showMoreText.textContent = 'Show Less';
    showMoreIcon.className = 'fas fa-minus';
    showMoreBadge.classList.add('expanded');
  }
}

function createFilterBadge(text, iconClass, techClass, count) {
  const badge = document.createElement('div');
  badge.className = `pf-filter-badge ${techClass}`;
  
  let iconHtml = '';
  if (iconClass) {
    iconHtml = `<i class="${iconClass}"></i>`;
  }
  
  badge.innerHTML = `
    ${iconHtml}
    <span>${text}</span>
    <span class="filter-count">${count}</span>
  `;
  
  return badge;
}

function filterProjects(filterValue, projectCards) {
  // This function is deprecated and replaced by filterProjectsByTechnology
  filterProjectsByTechnology(filterValue);
}

function updateFilterCounts() {
  // This function is deprecated and replaced by updateFilterCountsForJSON
  updateFilterCountsForJSON();
}

// Projects data loading and rendering
let projectsData = null;

// Technology to icon mapping
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
  'Web3': 'fab fa-ethereum',
  'Metamask': 'fas fa-wallet',
  'Location': 'fas fa-map-marker-alt',
  'NFC': 'fas fa-wifi',
  'Expo': 'fas fa-mobile-alt',
  'Maps': 'fas fa-map',
  'Charts': 'fas fa-chart-line',
  'Datagrid': 'fas fa-table',
  'Dashboard': 'fas fa-chart-bar',
  'Environment': 'fas fa-leaf',
  'Parking': 'fas fa-parking',
  'Tree Management': 'fas fa-tree',
  'Image Upload': 'fas fa-camera',
  'Chatbot': 'fas fa-robot',
  'Health': 'fas fa-virus',
  'Sanitization': 'fas fa-spray-can',
  'Transit': 'fas fa-train',
  'MQTT': 'fas fa-exchange-alt',
  'Real-time': 'fas fa-broadcast-tower',
  'Drag & Drop': 'fas fa-arrows-alt',
  'Display Config': 'fas fa-desktop',
  'Google Drive': 'fab fa-google-drive',
  'Digital Display': 'fas fa-tv',
  'Display': 'fas fa-tv',
  'Auto-refresh': 'fas fa-sync-alt',
  'Radio': 'fas fa-radio',
  'Audio Streaming': 'fas fa-play',
  'Hook': 'fas fa-clock',
  'Component': 'fas fa-mobile-alt',
  'Food Delivery': 'fas fa-utensils',
  'Material UI': 'fas fa-calendar-alt',
  'Vendor App': 'fas fa-store',
  'Food Management': 'fas fa-utensils',
  'Admin Panel': 'fas fa-user-shield',
  'Air Quality': 'fas fa-wind',
  'Blockchain': 'fab fa-ethereum',
  'Image Processing': 'fas fa-image'
};

// Load projects from JSON file
async function loadProjects() {
  try {
    const response = await fetch('./projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    projectsData = await response.json();
    renderProjects();
    initializeTechnologyFilters();
  } catch (error) {
    console.error('Error loading projects:', error);
    // Fallback: show error message or hide projects section
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
      projectsGrid.innerHTML = '<div class="pf-projects-error">Unable to load projects. Please try again later.</div>';
    }
  }
}

// Create project card HTML
function createProjectCard(project) {
  const hasLinks = project.links && project.links.length > 0;
  const cardClass = hasLinks ? 'pf-project-card pf-project-with-link' : 'pf-project-card';
  
  // Create technology badges
  const techBadges = project.technologies.map(tech => {
    const icon = technologyIcons[tech] || 'fas fa-cog';
    const techClass = tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `<span class="pf-project-tech-badge ${techClass}"><i class="${icon}"></i> ${tech}</span>`;
  }).join('');

  // Create project details
  const tools = project.tools.join(', ');
  const languages = project.languages.join(', ');
  const libraries = project.libraries.join(', ');

  // Create project links
  let linksHtml = '';
  if (hasLinks) {
    const links = project.links.map(link => {
      let icon = 'fas fa-external-link-alt';
      let text = 'Visit Site';
      
      switch (link.type) {
        case 'playstore':
          icon = 'fab fa-google-play';
          text = 'Play Store';
          break;
        case 'npm':
          icon = 'fab fa-npm';
          text = 'NPM Package';
          break;
        case 'github':
          icon = 'fab fa-github';
          text = 'GitHub';
          break;
        case 'website':
        default:
          icon = 'fas fa-external-link-alt';
          text = 'Visit Site';
          break;
      }
      
      return `<a href="${link.url}" target="_blank" class="pf-project-link">
                <i class="${icon}"></i> ${text}
              </a>`;
    }).join('');
    
    linksHtml = `<div class="pf-project-links">${links}</div>`;
  }

  return `
    <div class="${cardClass}">
      <div class="pf-project-card-wrapper">
        <div class="pf-project-header">
          <h3 class="pf-project-name">${project.name}</h3>
        </div>
        <div class="pf-project-technologies">
          ${techBadges}
        </div>
        <div class="pf-project-description">${project.description}</div>
        <div class="pf-project-details">
          <div class="pf-project-tools"><strong>Tools:</strong> ${tools}</div>
          <div class="pf-project-languages"><strong>Languages:</strong> ${languages}</div>
          <div class="pf-project-libraries"><strong>Libraries:</strong> ${libraries}</div>
          <div class="pf-project-duration"><strong>Worked on:</strong> ${project.duration}</div>
        </div>
        <div class="pf-project-responsibilities">
          <strong>Responsibilities:</strong> ${project.responsibilities}
        </div>
        ${linksHtml}
      </div>
    </div>
  `;
}

// Render all projects
function renderProjects() {
  if (!projectsData || !projectsData.projects) {
    return;
  }

  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) {
    return;
  }

  const projectsHtml = projectsData.projects.map(project => createProjectCard(project)).join('');
  projectsGrid.innerHTML = projectsHtml;

  // Apply default display logic: show only latest 6 projects with links
  applyDefaultProjectDisplay();
}

// Apply default display logic for projects
function applyDefaultProjectDisplay() {
  const projectCards = document.querySelectorAll('.pf-project-card');
  const projectsWithLinks = [];
  const projectsWithoutLinks = [];

  // Separate projects with and without links
  projectCards.forEach((card, index) => {
    if (card.classList.contains('pf-project-with-link')) {
      projectsWithLinks.push({ card, index });
    } else {
      projectsWithoutLinks.push({ card, index });
    }
  });

  // Hide all projects first
  projectCards.forEach(card => {
    card.style.display = 'none';
  });

  // Show only the first 6 projects with links
  projectsWithLinks.slice(0, 6).forEach(({ card }) => {
    card.style.display = 'block';
  });
}

// Technology Filter functionality (updated to work with JSON data)
function initializeTechnologyFilters() {
  if (!projectsData || !projectsData.projects) {
    return;
  }

  const projectCards = document.querySelectorAll('.pf-project-card');
  const filterContainer = document.getElementById('technologyFilters');
  
  if (!filterContainer || projectCards.length === 0) {
    return;
  }

  // Clear existing filters
  filterContainer.innerHTML = '';

  // Extract all technologies from project data
  const technologiesMap = new Map();
  
  projectsData.projects.forEach(project => {
    project.technologies.forEach(tech => {
      if (!technologiesMap.has(tech)) {
        const icon = technologyIcons[tech] || 'fas fa-cog';
        const techClass = tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        technologiesMap.set(tech, {
          count: 0,
          class: techClass,
          icon: icon
        });
      }
      technologiesMap.get(tech).count++;
    });
  });

  // Create filter badges
  const allFilterBadge = createFilterBadge('All', 'fas fa-th-large', '', projectsData.projects.length);
  allFilterBadge.classList.add('active');
  allFilterBadge.setAttribute('data-filter', 'all');
  filterContainer.appendChild(allFilterBadge);

  // Sort technologies by count (descending) and then alphabetically
  const sortedTechnologies = Array.from(technologiesMap.entries())
    .sort((a, b) => {
      if (b[1].count !== a[1].count) {
        return b[1].count - a[1].count;
      }
      return a[0].localeCompare(b[0]);
    });

  // Split technologies into initial (15) and hidden ones
  const initialTechnologies = sortedTechnologies.slice(0, 15);
  const hiddenTechnologies = sortedTechnologies.slice(15);

  // Add initial technology badges
  initialTechnologies.forEach(([techName, techData]) => {
    const filterBadge = createFilterBadge(techName, techData.icon, techData.class, techData.count);
    filterBadge.setAttribute('data-filter', techName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    filterContainer.appendChild(filterBadge);
  });

  // Add "Show More" badge if there are hidden technologies
  if (hiddenTechnologies.length > 0) {
    const showMoreBadge = createShowMoreBadge(hiddenTechnologies.length);
    filterContainer.appendChild(showMoreBadge);

    // Add hidden technology badges (initially hidden)
    hiddenTechnologies.forEach(([techName, techData]) => {
      const filterBadge = createFilterBadge(techName, techData.icon, techData.class, techData.count);
      filterBadge.setAttribute('data-filter', techName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
      filterBadge.classList.add('pf-filter-badge-hidden');
      filterContainer.appendChild(filterBadge);
    });
  }

  // Add click event listeners to filter badges
  const filterBadges = filterContainer.querySelectorAll('.pf-filter-badge:not(.pf-filter-show-more)');
  filterBadges.forEach(badge => {
    badge.addEventListener('click', function() {
      const filterValue = this.getAttribute('data-filter');
      
      // Update active state
      filterBadges.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      filterProjectsByTechnology(filterValue);
    });
  });

  // Add click event listener to show more badge
  const showMoreBadge = filterContainer.querySelector('.pf-filter-show-more');
  if (showMoreBadge) {
    showMoreBadge.addEventListener('click', function() {
      toggleHiddenFilters(filterContainer);
    });
  }
}

// Filter projects by technology (updated for JSON data)
function filterProjectsByTechnology(filterValue) {
  if (!projectsData || !projectsData.projects) {
    return;
  }

  const projectCards = document.querySelectorAll('.pf-project-card');
  const projectsGrid = document.querySelector('.pf-projects-grid');
  const showingAll = projectsGrid.classList.contains('show-all');
  
  // First, apply the technology filter
  projectCards.forEach((card, index) => {
    const project = projectsData.projects[index];
    if (project) {
      let shouldShow = false;
      
      if (filterValue === 'all') {
        shouldShow = true;
      } else {
        shouldShow = project.technologies.some(tech => {
          const normalizedTech = tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return normalizedTech === filterValue;
        });
      }
      
      // Set visibility based on filter
      if (shouldShow) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });

  // If not showing all, apply the "latest 6 with links" restriction
  if (!showingAll && filterValue === 'all') {
    applyDefaultProjectDisplay();
  } else if (!showingAll) {
    // For filtered results, show only first 6 projects with links that match the filter
    const visibleProjectsWithLinks = [];
    projectCards.forEach((card) => {
      if (card.style.display === 'block' && card.classList.contains('pf-project-with-link')) {
        visibleProjectsWithLinks.push(card);
      }
    });

    // Hide all filtered projects first
    projectCards.forEach(card => {
      if (card.style.display === 'block') {
        card.style.display = 'none';
      }
    });

    // Show only the first 6 filtered projects with links
    visibleProjectsWithLinks.slice(0, 6).forEach(card => {
      card.style.display = 'block';
    });
  }

  // Update project counts in filter badges
  updateFilterCountsForJSON();
}

// Update filter counts (updated for JSON data)
function updateFilterCountsForJSON() {
  if (!projectsData || !projectsData.projects) {
    return;
  }

  const filterBadges = document.querySelectorAll('.pf-filter-badge:not(.pf-filter-show-more)');
  
  filterBadges.forEach(badge => {
    const filterValue = badge.getAttribute('data-filter');
    const countElement = badge.querySelector('.filter-count');
    
    if (filterValue === 'all') {
      countElement.textContent = projectsData.projects.length;
    } else {
      let count = 0;
      projectsData.projects.forEach(project => {
        const hasMatchingTech = project.technologies.some(tech => {
          const normalizedTech = tech.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          return normalizedTech === filterValue;
        });
        if (hasMatchingTech) {
          count++;
        }
      });
      countElement.textContent = count;
    }
  });
}

// Load projects when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadProjects();
});
