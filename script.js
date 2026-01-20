// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Feather icons if available
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
  
  initializeApp();
});

function initializeApp() {
    // Add this code INSIDE the initializeApp() function, at the beginning:

  // Theme switching functionality
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const body = document.body;
  const container = document.getElementById('mainContainer');
  
  // Check for saved theme or system preference
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  function setTheme(theme) {
    if (theme === 'dark') {
      body.setAttribute('data-theme', 'dark');
      container.setAttribute('data-theme', 'dark');
      feather.replace({ 'data-feather': 'moon' });
      themeIcon.setAttribute('data-feather', 'sun');
      localStorage.setItem('theme', 'dark');
    } else {
      body.setAttribute('data-theme', 'light');
      container.setAttribute('data-theme', 'light');
      feather.replace({ 'data-feather': 'sun' });
      themeIcon.setAttribute('data-feather', 'moon');
      localStorage.setItem('theme', 'light');
    }
    feather.replace();
  }
  
  // Initialize theme
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDarkScheme.matches) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const currentTheme = body.getAttribute('data-theme');
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  });
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Loading screen
  const loading = document.getElementById('loading');
  if (loading) {
    window.addEventListener('load', function () {
      loading.style.opacity = '0';
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    });
  }
  
  // Scroll progress indicator
  let scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateScrollProgress, 50);
  });
  
  function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = scrollPercent + '%';
    }
  }
  
  // Create animated background particles
  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.setAttribute('aria-hidden', 'true');
      
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  // Animate skill bars on scroll
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill_progress');
    if (skillBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width || '0%';
          entry.target.style.width = '0%';
          setTimeout(() => {
            entry.target.style.width = width;
          }, 200);
        }
      });
    }, { threshold: 0.5 });
  
    skillBars.forEach(bar => observer.observe(bar));
  }
  
  // Event delegation for card hover effects
  document.addEventListener('mouseover', function(e) {
    const card = e.target.closest('.card');
    if (card) {
      card.style.transform = 'translateY(-8px) scale(1.02)';
    }
  });
  
  document.addEventListener('mouseout', function(e) {
    const card = e.target.closest('.card');
    if (card) {
      card.style.transform = 'translateY(0) scale(1)';
    }
  });
  
  // Ripple effect for download button
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('downloadBtn') || 
        e.target.closest('.downloadBtn')) {
      const button = e.target.classList.contains('downloadBtn') ? e.target : e.target.closest('.downloadBtn');
      const ripple = document.createElement('span');
      ripple.setAttribute('aria-hidden', 'true');
      
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255,255,255,0.3)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.pointerEvents = 'none';
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode === button) {
          button.removeChild(ripple);
        }
      }, 600);
    }
  });
  
  // Initialize everything
  createParticles();
  animateSkillBars();
}