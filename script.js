const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const navLinks = document.querySelectorAll('.side-nav a[href^="#"]');
const sections = document.querySelectorAll('main section[id]');
const contactForm = document.querySelector('.contact-form');

const animatedItems = document.querySelectorAll(
    '.section-title, .about-text, .about-card article, .services .service-card article, .timeline-item, .work-card, .contact-form'
);

// استعادة المظهر المحفوظ (أو اتباع نظام الجهاز في أول زيارة)
let savedTheme = null;

try {
    savedTheme = localStorage.getItem('portfolio-theme');
} catch (error) {
    // التخزين غير متاح (وضع خاص مثلاً)، نكمل بدونه
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
    body.classList.add('dark-mode');
}

updateThemeIcon();

// زر الوضع الليلي
themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    const isDark = body.classList.contains('dark-mode');
    try {
        localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    } catch (error) {
        // نتجاهل الخطأ
    }
    updateThemeIcon();
});

function updateThemeIcon() {
    const isDark = body.classList.contains('dark-mode');

    themeIcon?.classList.toggle('fa-moon', isDark);
    themeIcon?.classList.toggle('fa-sun', !isDark);
}

// التنقل بين أقسام الصفحة
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

// تحديث الرابط النشط حسب القسم الظاهر
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

sections.forEach((section) => {
    activeSectionObserver.observe(section);
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add('is-visible');
            observer.unobserve(el);

            // بعد انتهاء حركة الظهور ننظف العنصر
            setTimeout(() => {
                el.classList.remove('reveal', 'is-visible');
                el.style.transitionDelay = '';
            }, 1000);
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
// إرسال نموذج التواصل عبر Web3Forms
contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();

    if (!name || !email || !message) {
        showToast('Please fill in all fields.');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: 'db383ecb-d0fa-4185-928b-938a2f12075b',
                subject: `Portfolio message from ${name}`,
                name,
                email,
                message
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast('Message sent! Thank you.');
            contactForm.reset();
        } else {
            showToast('Something went wrong. Please try again.');
        }
    } catch (error) {
        showToast('Network error. Please try again later.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// إظهار رسالة صغيرة على الصفحة
function showToast(message) {
    const oldToast = document.querySelector('.toast-message');
    oldToast?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');

        toast.addEventListener('transitionend', () => {
            toast.remove();
        }, {
            once: true
        });
    }, 2600);
}