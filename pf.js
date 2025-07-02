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
