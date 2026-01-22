document.addEventListener("DOMContentLoaded", () => {
    // 1. LÓGICA DE ANIMACIÓN (SCROLL REVEAL)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            } else {
                entry.target.classList.remove('reveal-active');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        'section, .about-card, .skill-card, .project-card-modern, .game-card, .hw-card'
    );

    elementsToAnimate.forEach(el => {
        el.classList.add('reveal-light');
        observer.observe(el);
    });

    // 2. LÓGICA DE IDIOMA
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    const langTexts = document.querySelectorAll('.lang-text');

    function changeLanguage(lang) {
        langTexts.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            // CAMBIAMOS textContent por innerHTML para que respete el <span> del degradado
            if(text) el.innerHTML = text; 
        });

        if (lang === 'es') {
            btnEs.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnEs.classList.remove('active');
        }
        localStorage.setItem('preferredLang', lang);
    }

    btnEs.addEventListener('click', () => changeLanguage('es'));
    btnEn.addEventListener('click', () => changeLanguage('en'));

    // Cargar idioma preferido
    const savedLang = localStorage.getItem('preferredLang') || 'es';
    changeLanguage(savedLang);
});

// Estilos de animación inyectados
const style = document.createElement('style');
style.textContent = `
    .reveal-light {
        opacity: 0;
        transform: translateY(20px);
        filter: blur(4px);
        transition: opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out;
        will-change: transform, opacity;
    }
    .reveal-active {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0px);
    }
    .about-card:nth-child(2), .game-card:nth-child(2) { transition-delay: 0.15s; }
    .about-card:nth-child(3), .game-card:nth-child(3) { transition-delay: 0.3s; }
    .game-card:nth-child(4) { transition-delay: 0.45s; }
    @media (max-width: 768px) {
        .reveal-light { transition-duration: 0.7s; transform: translateY(10px); }
    }
`;
document.head.appendChild(style);