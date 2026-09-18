document.addEventListener("DOMContentLoaded", () => {
    // 1. LÓGICA DE ANIMACIÓN (SCROLL REVEAL SUAVE)
    const isMobile = window.innerWidth <= 768;
    const observerOptions = {
        threshold: isMobile ? 0.02 : 0.08,
        rootMargin: isMobile ? "0px 0px -20px 0px" : "-10px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
            } else {
                // Solo desvanecer al scrollear hacia arriba en pantallas de escritorio
                if (!isMobile) {
                    entry.target.classList.remove('reveal-active');
                }
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(
        'main > section, .project-card-modern, .game-card, .hw-card, .cta-card'
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

    // 5. BOTONES DE COPIAR AL PORTAPAPELES (CTA CONTACTO)
    const copyButtons = document.querySelectorAll('.js-copy-btn');
    const copyToast = document.getElementById('cta-copy-toast');
    let toastTimeout = null;

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy-text');
            if (!textToCopy) return;

            const copyIndicator = btn.querySelector('.cta-copy-indicator');
            const copyIcon = copyIndicator ? copyIndicator.querySelector('i') : null;
            const copyStatus = copyIndicator ? copyIndicator.querySelector('.copy-status') : null;
            const currentLang = localStorage.getItem('preferredLang') || 'es';
            const feedbackText = btn.getAttribute(`data-feedback-${currentLang}`) || (currentLang === 'es' ? '¡Copiado!' : 'Copied!');

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = textToCopy;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                // Efecto visual en botón
                btn.classList.add('is-copied');
                if (copyIcon) {
                    copyIcon.className = 'bi bi-check2';
                }
                if (copyStatus) {
                    copyStatus.textContent = feedbackText;
                }

                // Toast flotante
                if (copyToast) {
                    const toastMsg = copyToast.querySelector('.cta-toast-message');
                    if (toastMsg) {
                        toastMsg.textContent = `${feedbackText} (${textToCopy})`;
                    }
                    copyToast.classList.add('is-visible');
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        copyToast.classList.remove('is-visible');
                    }, 3000);
                }

                // Restaurar estado tras 2.5s
                setTimeout(() => {
                    btn.classList.remove('is-copied');
                    if (copyIcon) {
                        copyIcon.className = 'bi bi-clipboard';
                    }
                    if (copyStatus) {
                        const defaultText = copyStatus.getAttribute(`data-${currentLang}`) || (currentLang === 'es' ? 'Copiar' : 'Copy');
                        copyStatus.textContent = defaultText;
                    }
                }, 2500);

            } catch (err) {
                console.error('Error al copiar al portapapeles:', err);
            }
        });
    });

    // 6. BOTÓN FLOTANTE SCROLL TO TOP
    const scrollTopBtn = document.getElementById('btn-scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                scrollTopBtn.classList.add('is-visible');
            } else {
                scrollTopBtn.classList.remove('is-visible');
            }
        }, { passive: true });
    }

    // 7. SCROLLYTELLING HÍBRIDO (JS + CSS) para "Sobre mí" y "Habilidades Técnicas"
    // JS solo calcula el progreso (0 a 1) y lo expone como variable CSS; todo el
    // dibujado (opacity/transform) lo resuelve el CSS puro con calc().
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollyCards = document.querySelectorAll('.about-card, .skill-card');
    const scrollyBubbles = document.querySelectorAll('.badge-custom');

    if ((scrollyCards.length || scrollyBubbles.length) && !prefersReducedMotion) {
        // Progreso en forma de campana: el elemento llega a su punto máximo (1)
        // cuando su centro coincide con el centro del viewport, y decae hacia 0
        // tanto si sigue subiendo como si sigue bajando (efecto reversible en ambos sentidos).
        const RANGE_RATIO = 0.55; // qué tan lejos del centro puede estar y seguir visible

        const clamp01 = (n) => Math.min(1, Math.max(0, n));

        const getProgress = (el, centerShiftPx = 0) => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = vh / 2 + centerShiftPx;
            const range = vh * RANGE_RATIO;
            const distance = Math.abs(elementCenter - viewportCenter);
            return clamp01(1 - distance / range);
        };

        let rafId = null;

        const updateScrollProgress = () => {
            rafId = null;

            scrollyCards.forEach((el) => {
                el.style.setProperty('--scroll-progress', getProgress(el).toFixed(3));
            });

            // Los "globos" (badges) de cada tarjeta aparecen escalonados: el punto
            // de máxima visibilidad de cada uno se desplaza un poco respecto al anterior.
            scrollyBubbles.forEach((el) => {
                const parent = el.parentElement;
                const indexInGroup = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
                const staggerPx = indexInGroup * 18;
                el.style.setProperty('--scroll-progress', getProgress(el, staggerPx).toFixed(3));
            });
        };

        const requestScrollUpdate = () => {
            if (rafId === null) {
                rafId = requestAnimationFrame(updateScrollProgress);
            }
        };

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        window.addEventListener('resize', requestScrollUpdate, { passive: true });
        updateScrollProgress();
    }
});

// Estilos de animación inyectados
const style = document.createElement('style');
style.textContent = `
    .reveal-light {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform, opacity;
    }
    .reveal-active {
        opacity: 1;
        transform: translateY(0);
    }
    .about-card:nth-child(2), .game-card:nth-child(2) { transition-delay: 0.1s; }
    .about-card:nth-child(3), .game-card:nth-child(3) { transition-delay: 0.2s; }
    .game-card:nth-child(4) { transition-delay: 0.3s; }
    @media (max-width: 768px) {
        .reveal-light {
            transition-duration: 0.5s;
            transform: translateY(16px);
            filter: none !important;
        }
    }
`;
document.head.appendChild(style);