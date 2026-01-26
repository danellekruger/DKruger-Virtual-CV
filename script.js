// Particle System
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particleCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = window.innerWidth < 768 ? 30 : 60;
    this.mouse = { x: 0, y: 0, radius: 100 };
    
    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resize();
    
    // Create particles
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(${Math.floor(Math.random() * 100 + 156)}, ${Math.floor(Math.random() * 100 + 156)}, 255, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off walls
      if (particle.x > this.canvas.width) particle.speedX = -Math.abs(particle.speedX);
      if (particle.x < 0) particle.speedX = Math.abs(particle.speedX);
      if (particle.y > this.canvas.height) particle.speedY = -Math.abs(particle.speedY);
      if (particle.y < 0) particle.speedY = Math.abs(particle.speedY);
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      // Draw connections
      this.drawConnections(particle);
    });
    
    requestAnimationFrame(() => this.animate());
  }

  drawConnections(particle) {
    this.particles.forEach(otherParticle => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance/100)})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(otherParticle.x, otherParticle.y);
        this.ctx.stroke();
      }
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      
      // Add mouse interaction
      this.particles.forEach(particle => {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= dx * force * 0.05;
          particle.y -= dy * force * 0.05;
        }
      });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Feather icons if available
  if (typeof feather !== "undefined") {
    feather.replace();
  }

  // Initialize Particle System
  new ParticleSystem();

  initializeApp();
});

// Project Filtering
function setupProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.display = 'block';
          }, 300);
        } else {
          card.classList.add('hidden');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function initializeApp() {
  // REMOVED: Theme switching functionality
  
  // Animate hero elements
  function animateHeroElements() {
    // Animate counter numbers
    const counters = document.querySelectorAll(".stat-number");
    const speed = 200; // Lower is faster

    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-count");
      const count = +counter.innerText;
      const increment = target / speed;

      const updateCount = () => {
        const current = +counter.innerText;

        if (current < target) {
          counter.innerText = Math.ceil(current + increment);
          setTimeout(updateCount, 10);
        } else {
          counter.innerText = target;
        }
      };

      // Start counting when element is in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateCount();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );

      observer.observe(counter);
    });

    // Add hover effects to badges
    const badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
      badge.addEventListener("mouseenter", () => {
        const icon = badge.querySelector(".badge-icon");
        if (icon) {
          icon.style.transform = "rotate(15deg)";
          setTimeout(() => {
            icon.style.transform = "rotate(0deg)";
          }, 300);
        }
      });
    });
  }

  // Initialize animations
  animateHeroElements();

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
