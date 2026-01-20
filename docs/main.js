document.addEventListener("DOMContentLoaded", () => {
    // Configuración del observador: mayor margen para que no se corte el efecto
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            } else {
                // Se reinicia suavemente al salir de vista
                entry.target.classList.remove('reveal-active');
            }
        });
    }, observerOptions);

    // Elementos a animar
    const elementsToAnimate = document.querySelectorAll(
        'section, .about-card, .skill-card, .project-card-modern, .game-card, .hw-card'
    );

    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-light');
        observer.observe(el);
    });
});

// Inyección de estilos optimizados para la vista
const style = document.createElement('style');
style.textContent = `
    /* Estado base: muy sutil */
    .reveal-light {
        opacity: 0;
        transform: translateY(20px); /* Movimiento reducido */
        filter: blur(4px); /* Blur muy ligero */
        transition: 
            opacity 1s ease-out, 
            transform 1s ease-out, 
            filter 1s ease-out;
        will-change: transform, opacity; /* Optimización de rendimiento */
    }

    /* Estado activo: entrada elegante */
    .reveal-active {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0px);
    }

    /* Retrasos escalonados suaves para las filas de tarjetas */
    .about-card:nth-child(2), .game-card:nth-child(2) { transition-delay: 0.15s; }
    .about-card:nth-child(3), .game-card:nth-child(3) { transition-delay: 0.3s; }
    .game-card:nth-child(4) { transition-delay: 0.45s; }

    /* Evitar que el efecto se sienta pesado en móviles */
    @media (max-width: 768px) {
        .reveal-light {
            transition-duration: 0.7s;
            transform: translateY(10px);
        }
    }
`;
document.head.appendChild(style);