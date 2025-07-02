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
    // Hide extra projects
    projectsGrid.classList.remove('show-all');
    showMoreText.textContent = 'Show More Projects';
    showMoreBtn.classList.remove('expanded');
    
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
  }
}

// Technology Filter functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeTechnologyFilters();
});

function initializeTechnologyFilters() {
  const projectCards = document.querySelectorAll('.pf-project-card');
  const filterContainer = document.getElementById('technologyFilters');
  
  if (!filterContainer || projectCards.length === 0) {
    return;
  }

  // Extract all technologies from project cards
  const technologiesMap = new Map();
  
  projectCards.forEach(card => {
    const techBadges = card.querySelectorAll('.pf-project-tech-badge');
    techBadges.forEach(badge => {
      const techText = badge.textContent.trim();
      const techClass = Array.from(badge.classList).find(cls => cls !== 'pf-project-tech-badge') || '';
      const icon = badge.querySelector('i');
      const iconClass = icon ? icon.className : '';
      
      if (!technologiesMap.has(techText)) {
        technologiesMap.set(techText, {
          count: 0,
          class: techClass,
          icon: iconClass
        });
      }
      technologiesMap.get(techText).count++;
    });
  });

  // Create filter badges
  const allFilterBadge = createFilterBadge('All', 'fas fa-th-large', '', projectCards.length);
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
    filterBadge.setAttribute('data-filter', techName.toLowerCase().replace(/\s+/g, '-'));
    filterContainer.appendChild(filterBadge);
  });

  // Add "Show More" badge if there are hidden technologies
  if (hiddenTechnologies.length > 0) {
    const showMoreBadge = createShowMoreBadge(hiddenTechnologies.length);
    filterContainer.appendChild(showMoreBadge);

    // Add hidden technology badges (initially hidden)
    hiddenTechnologies.forEach(([techName, techData]) => {
      const filterBadge = createFilterBadge(techName, techData.icon, techData.class, techData.count);
      filterBadge.setAttribute('data-filter', techName.toLowerCase().replace(/\s+/g, '-'));
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
      filterProjects(filterValue, projectCards);
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
  projectCards.forEach(card => {
    if (filterValue === 'all') {
      card.style.display = 'block';
    } else {
      const techBadges = card.querySelectorAll('.pf-project-tech-badge');
      let hasMatchingTech = false;
      
      techBadges.forEach(badge => {
        const techText = badge.textContent.trim();
        const normalizedTech = techText.toLowerCase().replace(/\s+/g, '-');
        if (normalizedTech === filterValue) {
          hasMatchingTech = true;
        }
      });
      
      card.style.display = hasMatchingTech ? 'block' : 'none';
    }
  });

  // Update project counts in filter badges
  updateFilterCounts();
}

function updateFilterCounts() {
  const filterBadges = document.querySelectorAll('.pf-filter-badge:not(.pf-filter-show-more)');
  const visibleProjects = document.querySelectorAll('.pf-project-card[style*="display: block"], .pf-project-card:not([style*="display: none"])');
  
  filterBadges.forEach(badge => {
    const filterValue = badge.getAttribute('data-filter');
    const countElement = badge.querySelector('.filter-count');
    
    if (filterValue === 'all') {
      countElement.textContent = document.querySelectorAll('.pf-project-card').length;
    } else {
      let count = 0;
      document.querySelectorAll('.pf-project-card').forEach(card => {
        const techBadges = card.querySelectorAll('.pf-project-tech-badge');
        techBadges.forEach(techBadge => {
          const techText = techBadge.textContent.trim();
          const normalizedTech = techText.toLowerCase().replace(/\s+/g, '-');
          if (normalizedTech === filterValue) {
            count++;
          }
        });
      });
      countElement.textContent = count;
    }
  });
}
