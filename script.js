// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather icons if available
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  initializeApp();
});

function initializeApp() {
  // Theme switching functionality
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const body = document.body;

  // Check for saved theme
  const savedTheme = localStorage.getItem("theme");

  function setTheme(theme) {
    if (theme === "dark") {
      body.setAttribute("data-theme", "dark");
      themeIcon.setAttribute("data-feather", "sun");
      localStorage.setItem("theme", "dark");
    } else {
      body.setAttribute("data-theme", "light");
      themeIcon.setAttribute("data-feather", "moon");
      localStorage.setItem("theme", "light");
    }
    feather.replace();
  }

  // Initialize theme - Light as default
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme("light");
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", function () {
    const currentTheme = body.getAttribute("data-theme");
    if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });

  // Mobile Navigation Toggle
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      const icon = navToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.setAttribute("data-feather", "x");
      } else {
        icon.setAttribute("data-feather", "menu");
      }
      feather.replace();
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = navToggle.querySelector("i");
        icon.setAttribute("data-feather", "menu");
        feather.replace();

        // Update active link
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  // Animate progress bars on scroll
  function animateProgressBars() {
    const progressBars = document.querySelectorAll(".progress-fill");
    if (progressBars.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const width = entry.target.dataset.width || "0";
            entry.target.style.width = "0%";
            setTimeout(() => {
              entry.target.style.width = width + "%";
            }, 200);
          }
        });
      },
      { threshold: 0.5 },
    );

    progressBars.forEach((bar) => observer.observe(bar));
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active nav link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);

  // Initialize animations
  animateProgressBars();
  updateActiveLink();

  // Form submission (basic)
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Message sent! (This is a demo)");
      this.reset();
    });
  }
}
