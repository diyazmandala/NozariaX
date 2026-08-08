const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburgerBtn.textContent = isOpen ? '✕' : '☰';
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerBtn.textContent = '☰';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

const LANG_STORAGE_KEY = 'nozariax-lang';
const langButtons = document.querySelectorAll('.lang-btn');
const translatableElements = document.querySelectorAll('[data-id]');

function setLanguage(lang) {
    translatableElements.forEach(el => {
        el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id;
    });

    document.documentElement.lang = lang;

    hamburgerBtn.setAttribute('aria-label', lang === 'en' ? 'Open menu' : 'Buka menu');

    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
        // localStorage unavailable (e.g. private browsing) - the chosen
        // language still applies to this page view, it just won't persist.
    }
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

let initialLang = 'id';
try {
    initialLang = localStorage.getItem(LANG_STORAGE_KEY) || 'id';
} catch (e) {
    initialLang = 'id';
}
setLanguage(initialLang);
