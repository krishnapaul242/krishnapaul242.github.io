// Timeline auto-rotation functionality
document.addEventListener("DOMContentLoaded", function () {
  const timelineItems = document.querySelectorAll(".pf-timeline-item");
  const timelineDetails = document.querySelectorAll(".pf-timeline-details");
  let currentIndex = 0;
  let autoRotateInterval;

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
    const nextIndex = (currentIndex + 1) % timelineItems.length;
    showExperience(nextIndex);
  }

  function startAutoRotation() {
    autoRotateInterval = setInterval(nextExperience, 5000); // 5 seconds
  }

  function stopAutoRotation() {
    if (autoRotateInterval) {
      clearInterval(autoRotateInterval);
    }
  }

  // Add click event listeners to timeline items
  timelineItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      stopAutoRotation();
      showExperience(index);
      // Restart auto-rotation after user interaction
      setTimeout(startAutoRotation, 1000);
    });

    // Pause auto-rotation on hover
    item.addEventListener("mouseenter", stopAutoRotation);
    item.addEventListener("mouseleave", startAutoRotation);
  });

  // Also pause on details hover
  timelineDetails.forEach((detail) => {
    detail.addEventListener("mouseenter", stopAutoRotation);
    detail.addEventListener("mouseleave", startAutoRotation);
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
