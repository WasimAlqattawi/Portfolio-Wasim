const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const navLinks = document.querySelectorAll('.side-nav a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const contactForm = document.querySelector('.contact-form');
const animatedItems = document.querySelectorAll(
    'section, .profile-card, .service-card, .about-card article, .timeline-item'
);

const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

updateThemeIcon();

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');

    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = body.classList.contains('dark-mode');

    themeIcon?.classList.toggle('fa-moon', isDark);
    themeIcon?.classList.toggle('fa-sun', !isDark);
}

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        event.preventDefault();
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

const activeSectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${entry.target.id}`
                );
            });
        });
    },
    {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0
    }
);

sections.forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12
    }
);

animatedItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
    revealObserver.observe(item);
});

contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.elements.name?.value.trim();
    const email = contactForm.elements.email?.value.trim();
    const message = contactForm.elements.message?.value.trim();

    if (!name || !email || !message) {
        showToast('Please fill in all fields.');
        return;
    }

    showToast('Message ready. Thanks for reaching out!');
    contactForm.reset();
});

function showToast(message) {
    const oldToast = document.querySelector('.toast-message');
    oldToast?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), {
            once: true
        });
    }, 2600);
}
