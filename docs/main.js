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

    // 3. VIDEO POPUP PARA TARJETAS ESPECIFICAS
    const videoCards = document.querySelectorAll('.js-video-card');
    const videoPopup = document.getElementById('video-popup');
    const videoPlayer = document.getElementById('video-popup-player');
    const videoPopupTitle = document.getElementById('video-popup-title');
    const videoCloseBtn = document.getElementById('video-popup-close');

    if (videoCards.length && videoPopup && videoPlayer && videoPopupTitle && videoCloseBtn) {
        const closeVideoPopup = () => {
            videoPlayer.pause();
            videoPlayer.removeAttribute('src');
            videoPlayer.load();
            videoPopup.classList.remove('is-open');
            videoPopup.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        const openVideoPopup = (src, title) => {
            if (!src) return;
            videoPopupTitle.textContent = title || 'Video';
            videoPlayer.src = src;
            videoPopup.classList.add('is-open');
            videoPopup.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            videoPlayer.play().catch(() => {
                // Si autoplay es bloqueado, el usuario puede iniciar manualmente.
            });
        };

        videoCards.forEach(card => {
            const triggerBtn = card.querySelector('.game-play-btn');
            if (!triggerBtn) return;

            triggerBtn.addEventListener('click', () => {
                const src = card.getAttribute('data-video-src');
                const title = card.getAttribute('data-video-title');
                openVideoPopup(src, title);
            });
        });

        videoCloseBtn.addEventListener('click', closeVideoPopup);

        videoPopup.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.hasAttribute('data-close-video')) {
                closeVideoPopup();
            }
        });

        videoPlayer.addEventListener('ended', closeVideoPopup);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && videoPopup.classList.contains('is-open')) {
                closeVideoPopup();
            }
        });
    }

    // 4. GALERIA DE CAPTURAS PARA PROYECTOS PRIVADOS
    const galleryTriggers = document.querySelectorAll('.project-gallery-trigger');
    const galleryPopup = document.getElementById('gallery-popup');
    const galleryTitle = document.getElementById('gallery-popup-title');
    const galleryImage = document.getElementById('gallery-popup-image');
    const galleryIndicators = document.getElementById('gallery-popup-indicators');
    const galleryCloseBtn = document.getElementById('gallery-popup-close');
    const galleryPreviousBtn = document.getElementById('gallery-popup-previous');
    const galleryNextBtn = document.getElementById('gallery-popup-next');
    let galleryImages = [];
    let currentGalleryImage = 0;
    let galleryTrigger = null;

    if (galleryTriggers.length && galleryPopup && galleryTitle && galleryImage && galleryIndicators && galleryCloseBtn && galleryPreviousBtn && galleryNextBtn) {
        const updateGallery = () => {
            const imageNumber = currentGalleryImage + 1;
            galleryImage.src = galleryImages[currentGalleryImage];
            galleryImage.alt = `${galleryTitle.textContent} - captura ${imageNumber}`;
            galleryIndicators.querySelectorAll('.gallery-indicator').forEach((indicator, index) => {
                indicator.classList.toggle('is-active', index === currentGalleryImage);
                indicator.setAttribute('aria-current', index === currentGalleryImage ? 'true' : 'false');
            });
        };

        const closeGallery = () => {
            galleryPopup.classList.remove('is-open');
            galleryPopup.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            galleryImage.removeAttribute('src');
            galleryTrigger?.focus();
        };

        const changeGalleryImage = (direction) => {
            currentGalleryImage = (currentGalleryImage + direction + galleryImages.length) % galleryImages.length;
            updateGallery();
        };

        galleryTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                galleryImages = trigger.dataset.galleryImages.split('|').filter(Boolean);
                if (!galleryImages.length) return;

                galleryTitle.textContent = trigger.dataset.galleryTitle || 'Galería';
                currentGalleryImage = 0;
                galleryTrigger = trigger;
                galleryIndicators.replaceChildren(...galleryImages.map((_, index) => {
                    const indicator = document.createElement('button');
                    indicator.type = 'button';
                    indicator.className = 'gallery-indicator';
                    indicator.setAttribute('aria-label', `Ver captura ${index + 1}`);
                    indicator.addEventListener('click', () => {
                        currentGalleryImage = index;
                        updateGallery();
                    });
                    return indicator;
                }));
                updateGallery();
                galleryPopup.classList.add('is-open');
                galleryPopup.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                galleryCloseBtn.focus();
            });
        });

        galleryCloseBtn.addEventListener('click', closeGallery);
        galleryPreviousBtn.addEventListener('click', () => changeGalleryImage(-1));
        galleryNextBtn.addEventListener('click', () => changeGalleryImage(1));
        galleryPopup.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.hasAttribute('data-close-gallery')) {
                closeGallery();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!galleryPopup.classList.contains('is-open')) return;
            if (event.key === 'Escape') closeGallery();
            if (event.key === 'ArrowLeft') changeGalleryImage(-1);
            if (event.key === 'ArrowRight') changeGalleryImage(1);
        });
    }
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