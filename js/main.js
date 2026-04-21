// Нативные модальные окна
document.addEventListener('DOMContentLoaded', () => {
    const modalManager = createModalManager();
    modalManager.init();

    // Переключение темы
    initTheme();

    // Spotlight в CTA
    initCtaSpotlight();

    // Динамический хедер
    initDynamicHeader();

    // Мобильное меню
    initMobileMenu();

    // Эффект печатания в hero
    initTypingEffect();
});

// Анимации запускаем после полной загрузки страницы,
// чтобы getBoundingClientRect() вернул реальные размеры с учётом картинок
window.addEventListener('load', () => {
    initScrollAnimations();
});

function createModalManager() {
    let activeModal = null;
    let overlay = null;

    function init() {
        // Создаем оверлей один раз
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);

        // Находим все триггеры модалок
        const triggers = document.querySelectorAll('[data-modal-target]');
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', handleTriggerClick);
        });

        // Закрытие по клику на оверлей
        overlay.addEventListener('click', handleOverlayClick);

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && activeModal) {
                closeModal();
            }
        });
    }

    function handleTriggerClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (modal) {
            openModal(modal);
        }
    }

    function handleOverlayClick(e) {
        // Закрытие только при клике на оверлей, не на модалку
        if (e.target === overlay) {
            closeModal();
        }
    }

    function openModal(modal) {
        // Компенсируем ширину скроллбара, чтобы контент не прыгал
        const scrollbarWidth =
            window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            // Компенсацию держим на html, чтобы не было "двойного" смещения
            // из-за сочетания padding + overflow на разных элементах.
            document.documentElement.style.paddingRight = scrollbarWidth + 'px';
            document.body.style.paddingRight = '';
        }

        // Блокируем скролл
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');

        // Перемещаем модалку в оверлей
        overlay.innerHTML = '';
        overlay.appendChild(modal);
        modal.style.display = 'block';

        // Показываем оверлей
        overlay.classList.add('modal-overlay--active');
        overlay.setAttribute('aria-hidden', 'false');

        // Добавляем хедер с кнопкой закрытия если нет
        if (!modal.querySelector('.modal__header')) {
            const header = document.createElement('div');
            header.className = 'modal__header';
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal__close';
            closeBtn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            closeBtn.setAttribute('aria-label', 'Закрыть');
            closeBtn.addEventListener('click', closeModal);
            header.appendChild(closeBtn);
            modal.insertBefore(header, modal.firstChild);
        }

        // Фокус на первый интерактивный элемент
        const focusable = modal.querySelector('a, button, [tabindex]');
        if (focusable) {
            setTimeout(() => focusable.focus(), 100);
        }

        activeModal = modal;
    }

    function closeModal() {
        if (!activeModal) return;

        // Возвращаем модалку на место
        const originalParent = activeModal.dataset.originalParent
            ? document.querySelector(activeModal.dataset.originalParent)
            : document.body;

        overlay.classList.remove('modal-overlay--active');
        overlay.setAttribute('aria-hidden', 'true');
        activeModal.style.display = 'none';
        originalParent.appendChild(activeModal);

        // Разблокируем скролл и убираем компенсацию
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
        document.documentElement.style.paddingRight = '';
        document.body.style.paddingRight = '';

        activeModal = null;
    }

    return { init };
}

// Spotlight-эффект в CTA
function initCtaSpotlight() {
    const wrapper = document.querySelector('.cta__wrapper');
    if (!wrapper) return;

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        wrapper.style.setProperty('--mouse-x', `${x}%`);
        wrapper.style.setProperty('--mouse-y', `${y}%`);
    });
}

// Переключение темы
function initTheme() {
    const btns = document.querySelectorAll('.theme-toggle');
    if (!btns.length) return;

    function updateLabels() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.querySelectorAll('.mobile-menu__theme-label').forEach(el => {
            el.textContent = isDark ? 'Тёмная тема' : 'Светлая тема';
        });
    }

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            updateLabels();
        });
    });

    updateLabels();
}

// Анимации при скролле
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    // Элементы уже в viewport при загрузке получают задержку по порядку
    let inViewIndex = 0;
    animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transitionDelay = `${inViewIndex * 120}ms`;
            inViewIndex++;
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: '0px 0px -30px 0px',
        },
    );

    animatedElements.forEach((el) => observer.observe(el));
}

// Динамический хедер
function initDynamicHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    // Класс header--scrolled больше не используется, но оставляем
    // на случай если понадобится в будущем
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Мобильное меню
function initMobileMenu() {
    const burger = document.getElementById('burgerBtn');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('menuBackdrop');
    const closeBtn = document.getElementById('mobileMenuClose');
    if (!burger || !menu) return;

    let isOpen = false;

    let scrollY = 0;

    function openMenu() {
        isOpen = true;
        scrollY = window.scrollY;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = scrollbarWidth + 'px';
        }
        menu.classList.add('mobile-menu--active');
        burger.classList.add('burger--active');
        burger.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        isOpen = false;
        menu.classList.remove('mobile-menu--active');
        burger.classList.remove('burger--active');
        burger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.documentElement.style.paddingRight = '';
        window.scrollTo({ top: scrollY, behavior: 'instant' });
    }

    burger.addEventListener('click', () => {
        isOpen ? closeMenu() : openMenu();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // Закрытие при клике на обычную ссылку
    menu.querySelectorAll(
        'a:not([data-modal-target]), button:not([data-modal-target]):not(.theme-toggle)',
    ).forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
}

// Эффект печатания текста
function initTypingEffect() {
    const el = document.getElementById('heroTagline');
    if (!el) return;

    const text =
        'Создаю быстрые, адаптивные и красивые веб-приложения с использованием современных технологий';
    const speed = 60; // мс на символ (замедлено в 2 раза)
    const startDelay = 800;
    const restartDelay = 2500; // задержка перед повторным запуском

    let i = 0;
    let intervalId = null;
    let cursor = null;

    function startTyping() {
        el.textContent = '';
        el.classList.add('typing');

        cursor = document.createElement('span');
        cursor.className = 'typing__cursor';
        cursor.textContent = '|';
        el.appendChild(cursor);

        i = 0;

        intervalId = setInterval(() => {
            if (i < text.length) {
                el.insertBefore(document.createTextNode(text[i]), cursor);
                i++;
            } else {
                clearInterval(intervalId);
                intervalId = null;
                // Пауза и перезапуск
                setTimeout(() => {
                    startTyping();
                }, restartDelay);
            }
        }, speed);
    }

    setTimeout(() => {
        startTyping();
    }, startDelay);
}
