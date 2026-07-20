/* ================================================================
   CHEELA SAMEERRAJ — Cybersecurity Portfolio
   script.js  |  All interactivity and animations
   ================================================================ */

/* ----------------------------------------------------------------
   1. MATRIX RAIN CANVAS
   Draws the iconic falling-character rain on the background canvas.
---------------------------------------------------------------- */
(function initMatrixRain() {
  const canvas  = document.getElementById('matrix-canvas');
  const ctx     = canvas.getContext('2d');

  // Characters used in the rain (Latin + Katakana mix for cyber feel)
  const chars = '01アイウエオカキクケコサシスセソ0123456789ABCDEF<>{}[]|\\/*+-=_?!@#$%^&';
  const charArr = chars.split('');

  let columns, drops;
  const fontSize = 14;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops   = Array(columns).fill(1);
  }

  function draw() {
    // Semi-transparent black to create trailing fade effect
    ctx.fillStyle = 'rgba(5, 10, 14, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff9d';
    ctx.font      = `${fontSize}px Share Tech Mono, monospace`;

    drops.forEach((y, i) => {
      const char = charArr[Math.floor(Math.random() * charArr.length)];
      const x    = i * fontSize;
      ctx.fillText(char, x, y * fontSize);

      // Randomly reset a drop to the top
      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 60);  // ~16fps to keep it subtle
})();


/* ----------------------------------------------------------------
   2. CUSTOM CURSOR
   Tracks mouse position and adds hover state on interactive elements.
---------------------------------------------------------------- */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  // Elements that trigger the "hover" cursor state
  const hoverTargets = 'a, button, .skill-card, .project-card, .cert-card, .stat-card, .social-btn';

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring lags slightly for a smooth feel
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Toggle hover class on interactive elements
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();


/* ----------------------------------------------------------------
   3. NAVBAR — scroll shrink + active link highlighting
---------------------------------------------------------------- */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  // Shrink navbar on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveLink();
  });

  // Highlight whichever section is in viewport
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 90;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }
})();


/* ----------------------------------------------------------------
   4. HAMBURGER — mobile nav toggle
---------------------------------------------------------------- */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


/* ----------------------------------------------------------------
   5. HERO — TYPING ANIMATION
   Types the terminal command, then cycles through roles.
---------------------------------------------------------------- */
(function initHeroTyping() {
  // --- Terminal command ---
  const cmdEl   = document.getElementById('typed-cmd');
  const command = 'whoami';
  let i = 0;

  function typeCommand() {
    if (i < command.length) {
      cmdEl.textContent += command[i];
      i++;
      setTimeout(typeCommand, 80);
    }
    // After command is typed, start role cycling
    else {
      setTimeout(startRoleCycle, 600);
    }
  }

  // Small delay before typing starts
  setTimeout(typeCommand, 800);

  // --- Role cycling ---
  const roles = [
    'AIML Student',
    'Cybersecurity Enthusiast',
    'Networking Learner',
    'Ethical Hacking Aspirant',
    'Python Developer',
    'Security Engineer (In Progress)',
  ];

  const roleEl = document.getElementById('role-dynamic');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function startRoleCycle() {
    typeRole();
  }

  function typeRole() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      roleEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        // Pause at end before deleting
        setTimeout(() => { isDeleting = true; typeRole(); }, 1800);
        return;
      }
    } else {
      // Deleting
      roleEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 45 : 85;
    setTimeout(typeRole, speed);
  }
})();


/* ----------------------------------------------------------------
   6. SCROLL REVEAL
   Uses IntersectionObserver to fade-in elements as they enter view.
---------------------------------------------------------------- */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve once revealed to save resources
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ----------------------------------------------------------------
   7. SKILL BAR ANIMATION
   Fills skill progress bars when they scroll into view.
---------------------------------------------------------------- */
(function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level');
          // Short delay for visual polish
          setTimeout(() => {
            entry.target.style.width = level + '%';
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach(bar => observer.observe(bar));
})();


/* ----------------------------------------------------------------
   8. CONTACT FORM
   Basic client-side validation + simulated submission feedback.
   NOTE: Wire to your own backend, EmailJS, or Formspree for real sending.
---------------------------------------------------------------- */
(function initContactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent   = '// ERROR: Please fill in all required fields.';
      status.style.color   = '#ff2244';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      status.textContent = '// ERROR: Invalid email address.';
      status.style.color = '#ff2244';
      return;
    }

    // Simulate sending (replace with real submission logic)
    status.textContent = '// Sending...';
    status.style.color = '#7a9ab5';

    setTimeout(() => {
      status.textContent = '// Message sent successfully. I will get back to you soon!';
      status.style.color = '#00ff9d';
      form.reset();

      // Clear status after 6 seconds
      setTimeout(() => { status.textContent = ''; }, 6000);
    }, 1500);
  });
})();


/* ----------------------------------------------------------------
   9. FOOTER YEAR — auto-updates the copyright year
---------------------------------------------------------------- */
(function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ----------------------------------------------------------------
   10. SMOOTH SCROLLING — for anchor links (polyfill for older browsers)
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
