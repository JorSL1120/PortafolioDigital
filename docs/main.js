// Inicializar animaciones de AOS
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 800,
    easing: 'ease-out-quart',
    once: true
  });

  // Efecto gamer al cargar: flash en el título
  const title = document.querySelector('.neon-text');
  if (title) {
    title.classList.add('flash-neon');
    setTimeout(() => {
      title.classList.remove('flash-neon');
    }, 1200);
  }
});
