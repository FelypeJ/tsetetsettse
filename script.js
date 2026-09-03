/* =========================================================
   NEXUS — INTERACTIVE ENGINE
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   LOADER
========================================================= */

const loader = $('#loader');
const loaderLine = $('.loader-line span');
const loaderPercent = $('.loader-percent');

let progress = 0;

const loaderInterval = setInterval(() => {

  progress += Math.floor(Math.random() * 7) + 1;

  if (progress >= 100) {
    progress = 100;
    clearInterval(loaderInterval);

    setTimeout(() => {
      loader.classList.add('hide');
    }, 450);
  }

  loaderLine.style.width = `${progress}%`;
  loaderPercent.textContent = `${progress}%`;

}, 45);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor = $('.cursor');
const cursorRing = $('.cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

window.addEventListener('mousemove', (event) => {

  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

function animateCursor() {

  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;

  cursorRing.style.left = `${ringX}px`;
  cursorRing.style.top = `${ringY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor();


/* =========================================================
   CURSOR HOVER
========================================================= */

const interactiveElements = $$(
  'a, button, .feature-card, .gallery-card, .tech-item'
);

interactiveElements.forEach((element) => {

  element.addEventListener('mouseenter', () => {
    cursorRing.classList.add('hover');
  });

  element.addEventListener('mouseleave', () => {
    cursorRing.classList.remove('hover');
  });

});


/* =========================================================
   MAGNETIC BUTTONS
========================================================= */

$$('.magnetic').forEach((element) => {

  element.addEventListener('mousemove', (event) => {

    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    element.style.transform =
      `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = '';
  });

});


/* =========================================================
   3D TILT
========================================================= */

$$('.tilt').forEach((card) => {

  card.addEventListener('mousemove', (event) => {

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform =
      `perspective(900px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       translateZ(8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform =
      'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });

});


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }

    });

  },
  {
    threshold: 0.12
  }
);

$$('.reveal').forEach((element) => {
  observer.observe(element);
});


/* =========================================================
   NAVBAR
========================================================= */

const navbar = $('.navbar');

window.addEventListener(
  'scroll',
  () => {

    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

  },
  { passive: true }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = $$('section[id]');
const navLinks = $$('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        navLinks.forEach((link) => {
          link.classList.remove('active');
        });

        const activeLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`
        );

        if (activeLink) {
          activeLink.classList.add('active');
        }

      }

    });

  },
  {
    threshold: 0.45
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});


/* =========================================================
   PARALLAX
========================================================= */

const orb = $('.hero-orb');
const heroGrid = $('.hero-grid');

window.addEventListener(
  'scroll',
  () => {

    const scroll = window.scrollY;

    if (orb) {
      orb.style.transform =
        `translateY(calc(-50% + ${scroll * 0.16}px))`;
    }

    if (heroGrid) {
      heroGrid.style.transform =
        `translateY(${scroll * 0.08}px)`;
    }

  },
  { passive: true }
);


/* =========================================================
   MOUSE PARALLAX
========================================================= */

window.addEventListener('mousemove', (event) => {

  const x = (event.clientX / window.innerWidth - .5);
  const y = (event.clientY / window.innerHeight - .5);

  if (orb) {
    orb.style.marginLeft = `${x * 20}px`;
    orb.style.marginTop = `${y * 20}px`;
  }

});


/* =========================================================
   MUSIC PLAYER
========================================================= */

const music = $('#music');
const musicButton = $('#musicButton');
const musicPlayer = $('.music-player');

let musicPlaying = false;

music.volume = 0.35;

musicButton.addEventListener('click', async () => {

  try {

    if (!musicPlaying) {

      await music.play();

      musicPlaying = true;
      musicPlayer.classList.add('playing');

      musicButton.querySelector('.music-icon').textContent = 'Ⅱ';

    } else {

      music.pause();

      musicPlaying = false;
      musicPlayer.classList.remove('playing');

      musicButton.querySelector('.music-icon').textContent = '♫';
    }

  } catch (error) {

    console.warn(
      'Não foi possível iniciar a música:',
      error
    );

  }

});


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

window.addEventListener('keydown', (event) => {

  if (event.code === 'Space' &&
      event.target.tagName !== 'INPUT' &&
      event.target.tagName !== 'TEXTAREA') {

    event.preventDefault();
    musicButton.click();
  }

});


/* =========================================================
   SMOOTH ANCHORS
========================================================= */

$$('a[href^="#"]').forEach((link) => {

  link.addEventListener('click', (event) => {

    const targetId = link.getAttribute('href');

    if (targetId === '#') return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  });

});


/* =========================================================
   CARD GLOW FOLLOWING MOUSE
========================================================= */

$$('.feature-card, .gallery-card').forEach((card) => {

  card.addEventListener('mousemove', (event) => {

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(139,92,246,.12),
        rgba(255,255,255,.035) 35%,
        rgba(255,255,255,.01)
      )
    `;

  });

  card.addEventListener('mouseleave', () => {

    card.style.background =
      'linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.015))';

  });

});


/* =========================================================
   PARTICLE SYSTEM
========================================================= */

const canvas = $('#particles');
const ctx = canvas.getContext('2d');

let particles = [];
let particleWidth;
let particleHeight;

function resizeCanvas() {

  particleWidth = canvas.width = window.innerWidth;
  particleHeight = canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

class Particle {

  constructor() {

    this.x = Math.random() * particleWidth;
    this.y = Math.random() * particleHeight;

    this.size = Math.random() * 1.6 + .2;

    this.speedX =
      (Math.random() - .5) * .25;

    this.speedY =
      (Math.random() - .5) * .25;

    this.opacity =
      Math.random() * .5 + .1;
  }

  update() {

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = particleWidth;
    if (this.x > particleWidth) this.x = 0;

    if (this.y < 0) this.y = particleHeight;
    if (this.y > particleHeight) this.y = 0;
  }

  draw() {

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(180,160,255,${this.opacity})`;

    ctx.fill();
  }
}

function createParticles() {

  particles = [];

  const amount =
    Math.min(
      180,
      Math.floor(window.innerWidth / 8)
    );

  for (let i = 0; i < amount; i++) {
    particles.push(new Particle());
  }

}

createParticles();

window.addEventListener(
  'resize',
  createParticles
);


/* =========================================================
   PARTICLE CONNECTIONS
========================================================= */

function connectParticles() {

  for (let a = 0; a < particles.length; a++) {

    for (
      let b = a + 1;
      b < particles.length;
      b++
    ) {

      const dx =
        particles[a].x - particles[b].x;

      const dy =
        particles[a].y - particles[b].y;

      const distance =