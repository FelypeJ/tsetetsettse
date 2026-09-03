"use strict";

/* =========================================
   NEXUS DIGITAL EXPERIENCE
   Vanilla JS / Performance-oriented
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -----------------------------------------
     HELPERS
  ----------------------------------------- */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  /* -----------------------------------------
     LOADER
  ----------------------------------------- */

  const loader = $("#loader");
  const loaderProgress = $("#loader-progress");

  let progress = 0;

  const loaderInterval = setInterval(() => {
    progress += Math.random() * 12;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);

      setTimeout(() => {
        loader?.classList.add("hidden");
      }, 300);
    }

    if (loaderProgress) {
      loaderProgress.style.width = `${progress}%`;
    }
  }, 90);

  window.addEventListener("load", () => {
    progress = 100;

    if (loaderProgress) {
      loaderProgress.style.width = "100%";
    }

    setTimeout(() => {
      loader?.classList.add("hidden");
    }, 500);
  });

  /* -----------------------------------------
     NAVBAR
  ----------------------------------------- */

  const navbar = $("#navbar");

  const updateNavbar = () => {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();

  /* -----------------------------------------
     MOBILE MENU
  ----------------------------------------- */

  const menuToggle = $("#menu-toggle");
  const navLinks = $("#nav-links");

  const closeMenu = () => {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* -----------------------------------------
     SMOOTH LINKS
  ----------------------------------------- */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* -----------------------------------------
     REVEAL ON SCROLL
  ----------------------------------------- */

  const revealElements = $$(".reveal");

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(
        index * 35,
        250
      )}ms`;

      revealObserver.observe(element);
    });
  }

  /* -----------------------------------------
     ACTIVE NAVIGATION
  ----------------------------------------- */

  const sections = $$("section[id]");
  const navItems = $$(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navItems.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      });
    },
    {
      threshold: 0.35
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  /* -----------------------------------------
     COUNTERS
  ----------------------------------------- */

  const counters = $$(".stat-number");

  const animateCounter = (element) => {
    if (element.dataset.animated === "true") return;

    element.dataset.animated = "true";

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      element.textContent = target;
      return;
    }

    const duration = 1800;
    const start = performance.now();

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        1 - Math.pow(1 - progress, 4);

      element.textContent = Math.floor(
        target * eased
      );

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.6
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  /* -----------------------------------------
     CUSTOM CURSOR
  ----------------------------------------- */

  const cursorDot = $(".cursor-dot");
  const cursorRing = $(".cursor-ring");

  const isTouchDevice =
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.transform =
          `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      cursorRing.style.transform =
        `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const interactiveElements = $$(
      "a, button, input, .project-card"
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursorRing.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("hover");
      });
    });
  }

  /* -----------------------------------------
     MAGNETIC BUTTONS
  ----------------------------------------- */

  if (!prefersReducedMotion && !isTouchDevice) {
    const magneticElements = $$(".magnetic");

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();

        const x =
          event.clientX -
          (rect.left + rect.width / 2);

        const y =
          event.clientY -
          (rect.top + rect.height / 2);

        element.style.transform =
          `translate3d(${x * 0.16}px, ${y * 0.16}px, 0)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }

  /* -----------------------------------------
     3D TILT CARDS
  ----------------------------------------- */

  if (!prefersReducedMotion && !isTouchDevice) {
    $$(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const rotateY =
          ((x / rect.width) - 0.5) * 10;

        const rotateX =
          ((y / rect.height) - 0.5) * -10;

        card.style.transform =
          `perspective(900px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateZ(5px)`;

        const image =
          $(".project-image", card);

        if (image) {
          image.style.setProperty(
            "--mx",
            `${(x / rect.width) * 100}%`
          );

          image.style.setProperty(
            "--my",
            `${(y / rect.height) * 100}%`
          );
        }
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      });
    });
  }

  /* -----------------------------------------
     HERO PARALLAX
  ----------------------------------------- */

  if (!prefersReducedMotion && !isTouchDevice) {
    const hero = $(".hero");
    const heroContent = $(".hero-content");
    const orbits = $$(".hero-orbit");

    let ticking = false;

    const updateParallax = () => {
      const scroll = window.scrollY;

      if (hero && scroll < window.innerHeight * 1.2) {
        const movement = scroll * 0.18;

        heroContent?.style.setProperty(
          "transform",
          `translate3d(0, ${movement}px, 0)`
        );

        orbits.forEach((orbit, index) => {
          orbit.style.transform =
            `translateY(calc(-50% + ${scroll * (0.06 + index * 0.04)}px))
             rotate(${25 + index * -60}deg)`;
        });
      }

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
  }

  /* -----------------------------------------
     PROJECT IMAGE MOUSE LIGHT
  ----------------------------------------- */

  if (!isTouchDevice) {
    $$(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const image = $(".project-image", card);

        if (!image) return;

        const rect = image.getBoundingClientRect();

        image.style.setProperty(
          "--mx",
          `${((event.clientX - rect.left) / rect.width) * 100}%`
        );

        image.style.setProperty(
          "--my",
          `${((event.clientY - rect.top) / rect.height) * 100}%`
        );
      });
    });
  }

  /* -----------------------------------------
     MUSIC PLAYER
  ----------------------------------------- */

  const audio = $("#ambient-audio");
  const musicToggle = $("#music-toggle");
  const musicPlayer = $("#music-player");
  const volume = $("#volume");

  let musicStarted = false;

  if (audio && volume) {
    audio.volume = Number(volume.value);

    volume.addEventListener("input", () => {