document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

  const hero = document.querySelector(".web-hero");
  if (hero) {
    hero.addEventListener("pointermove", event => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      hero.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    }, { passive: true });
  }

  document.querySelectorAll(".web-project").forEach(project => {
    const art = project.querySelector(".web-project-art");
    if (!art) return;
    project.addEventListener("pointermove", event => {
      const bounds = art.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 14;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14;
      art.style.setProperty("--art-x", `${Math.max(-7, Math.min(7, x))}px`);
      art.style.setProperty("--art-y", `${Math.max(-7, Math.min(7, y))}px`);
    }, { passive: true });
    project.addEventListener("pointerleave", () => {
      art.style.removeProperty("--art-x");
      art.style.removeProperty("--art-y");
    });
  });
});
