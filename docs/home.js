document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("intro-loader");
  const loaderMessage = document.getElementById("loader-message");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const messages = {
    es: ["Preparando experiencia", "Cargando proyectos", "Listo para explorar"],
    en: ["Preparing experience", "Loading projects", "Ready to explore"]
  };

  if (loader) {
    let messageIndex = 0;
    const updateLoaderMessage = () => {
      if (loaderMessage) loaderMessage.textContent = messages[document.documentElement.lang === "en" ? "en" : "es"][messageIndex];
    };
    updateLoaderMessage();
    document.addEventListener("languagechange", updateLoaderMessage);
    const messageTimer = window.setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, messages.es.length - 1);
      updateLoaderMessage();
    }, 420);
    window.setTimeout(() => {
      window.clearInterval(messageTimer);
      document.removeEventListener("languagechange", updateLoaderMessage);
      loader.classList.add("is-hidden");
      window.setTimeout(() => loader.remove(), 650);
    }, reduceMotion ? 100 : 1500);
  }

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  if (menuToggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", document.documentElement.lang === "en" ? "Open menu" : "Abrir menú");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const english = document.documentElement.lang === "en";
      menuToggle.setAttribute("aria-label", isOpen ? (english ? "Close menu" : "Cerrar menú") : (english ? "Open menu" : "Abrir menú"));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("languagechange", () => {
      const english = document.documentElement.lang === "en";
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-label", isOpen ? (english ? "Close menu" : "Cerrar menú") : (english ? "Open menu" : "Abrir menú"));
    });
  }

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const canvas = document.getElementById("ambient-canvas");
  const context = canvas instanceof HTMLCanvasElement ? canvas.getContext("2d") : null;
  if (!canvas || !context || reduceMotion) return;

  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resizeCanvas = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };

  resizeCanvas();
  for (let index = 0; index < (mobile ? 30 : 62); index += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.7,
      speed: Math.random() * 0.3 + 0.08,
      phase: Math.random() * Math.PI * 2
    });
  }

  const draw = () => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      particle.phase += 0.012;
      if (particle.y < -3) {
        particle.y = height + 3;
        particle.x = Math.random() * width;
      }
      const alpha = 0.25 + (Math.sin(particle.phase) + 1) * 0.2;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(201, 255, 89, ${alpha})`;
      context.fill();
      if (!mobile) {
        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance < 135) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(151, 129, 255, ${(1 - distance / 135) * 0.24})`;
            context.stroke();
          }
        }
      }
    });
    frame = window.requestAnimationFrame(draw);
  };

  draw();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(frame);
    } else {
      frame = window.requestAnimationFrame(draw);
    }
  });
});
