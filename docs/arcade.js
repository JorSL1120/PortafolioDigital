document.addEventListener("DOMContentLoaded", () => {
  const screen = document.getElementById("arcade-screen");
  const ship = document.getElementById("pixel-ship");
  const coordinates = document.getElementById("screen-coordinates");
  const year = document.getElementById("current-year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const machine = document.getElementById("balloon-machine");
  const projects = document.getElementById("game-projects");
  const empty = document.getElementById("discovery-empty");
  const count = document.getElementById("discovery-count");
  const complete = document.getElementById("discovery-complete");
  const announcement = document.getElementById("discovery-announcement");
  const showAll = document.getElementById("show-all-games");
  const back = document.getElementById("back-to-balloons");
  const result = document.getElementById("discovery-result");
  if (machine && projects && empty && count && complete && announcement && showAll && back && result) {
    const balloons = Array.from(machine.querySelectorAll(".balloon"));
    const games = Array.from(projects.querySelectorAll(".arcade-game-card"));
    const discovered = new Set();
    let selected = null;
    let showingAll = false;

    const updateText = () => {
      const english = document.documentElement.lang === "en";
      balloons.forEach((balloon, index) => {
        const title = games[index].querySelector("h3").textContent;
        const label = discovered.has(index)
          ? `${english ? "View" : "Ver"} ${title}`
          : `${english ? "Discover project" : "Descubrir proyecto"} ${index + 1}`;
        balloon.setAttribute("aria-label", label);
      });
      if (showingAll) announcement.textContent = english ? "All projects" : "Todos los proyectos";
      else if (selected !== null) announcement.textContent = `${english ? "Project discovered" : "Proyecto descubierto"}: ${games[selected].querySelector("h3").textContent}. ${discovered.size} / ${games.length}`;
    };
    const revealResult = event => {
      if (event.detail && window.matchMedia("(max-width: 820px)").matches) {
        result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    };
    balloons.forEach((balloon, index) => {
      games[index].id = `game-project-${index + 1}`;
      balloon.setAttribute("aria-controls", games[index].id);
      balloon.addEventListener("click", event => {
        selected = index;
        showingAll = false;
        discovered.add(index);
        balloon.classList.add("is-discovered");
        balloons.forEach((item, itemIndex) => item.setAttribute("aria-pressed", String(itemIndex === index)));
        games.forEach((game, gameIndex) => { game.hidden = gameIndex !== index; });
        count.textContent = String(discovered.size);
        complete.hidden = discovered.size !== games.length;
        empty.hidden = true;
        back.hidden = false;
        updateText();
        revealResult(event);
      });
    });
    showAll.addEventListener("click", event => {
      selected = null;
      showingAll = true;
      balloons.forEach(balloon => balloon.setAttribute("aria-pressed", "false"));
      games.forEach(game => { game.hidden = false; });
      empty.hidden = true;
      back.hidden = false;
      updateText();
      revealResult(event);
    });
    document.addEventListener("languagechange", updateText);
    games.forEach(game => { game.hidden = true; });
    empty.hidden = false;
    machine.hidden = false;
  }

  if (!screen || !ship || !coordinates) return;

  let x = 50;
  let y = 62;
  const renderPosition = () => {
    ship.style.left = `${x}%`;
    ship.style.top = `${y}%`;
    coordinates.textContent = `X: ${Math.round(x)}　Y: ${Math.round(y)}`;
  };
  const move = (direction, amount) => {
    if (direction === "left") x -= amount;
    if (direction === "right") x += amount;
    if (direction === "up") y -= amount;
    if (direction === "down") y += amount;
    x = Math.max(8, Math.min(92, x));
    y = Math.max(18, Math.min(82, y));
    renderPosition();
  };

  screen.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    const bounds = screen.getBoundingClientRect();
    x = Math.max(8, Math.min(92, ((event.clientX - bounds.left) / bounds.width) * 100));
    y = Math.max(18, Math.min(82, ((event.clientY - bounds.top) / bounds.height) * 100));
    renderPosition();
  });
  screen.addEventListener("keydown", event => {
    const directions = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    move(direction, 5);
  });
  document.querySelectorAll(".touch-controls [data-move]").forEach(button => {
    button.addEventListener("click", () => move(button.getAttribute("data-move"), 6));
  });
  const background = document.getElementById("arcade-background");
  const context = background instanceof HTMLCanvasElement ? background.getContext("2d") : null;
  if (context && !reduceMotion) {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const stars = Array.from({ length: mobile ? 35 : 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.0007 + 0.0002
    }));
    const rockets = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastLaunch = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      background.width = Math.round(width * ratio);
      background.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      stars.forEach(star => {
        star.y = (star.y + star.speed) % 1;
        context.fillStyle = star.size > 1.8 ? "#ff91d3" : "#b9a8f3";
        context.globalAlpha = 0.35 + star.size * 0.2;
        context.fillRect(star.x * width, star.y * height, star.size, star.size);
      });
      context.globalAlpha = 1;
      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.life -= 1;
        if (rocket.life <= 0) {
          rockets.splice(index, 1);
          continue;
        }
        context.save();
        context.translate(rocket.x, rocket.y);
        context.rotate(Math.atan2(rocket.vy, rocket.vx));
        context.globalAlpha = Math.min(1, rocket.life / 20) * 0.8;
        context.fillStyle = "#ff65bd";
        context.fillRect(-18, -1, 13, 2);
        context.fillStyle = "#ffe66d";
        context.fillRect(-10, -2, 6, 4);
        context.fillStyle = "#62f4e3";
        context.beginPath();
        context.moveTo(9, 0);
        context.lineTo(-5, -4);
        context.lineTo(-2, 0);
        context.lineTo(-5, 4);
        context.closePath();
        context.fill();
        context.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    if (!mobile) {
      window.addEventListener("pointermove", event => {
        if (event.pointerType === "touch" || event.timeStamp - lastLaunch < 150) return;
        lastLaunch = event.timeStamp;
        if (rockets.length >= 24) rockets.shift();
        rockets.push({ x: event.clientX, y: event.clientY, vx: 1.5 + Math.random() * 2, vy: -1 - Math.random() * 2, life: 45 });
      }, { passive: true });
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(draw);
    });
  }

  if (reduceMotion) {
    document.querySelectorAll(".arcade-sky i").forEach(star => {
      star.style.animation = "none";
      star.style.opacity = "0.75";
    });
  }
});
