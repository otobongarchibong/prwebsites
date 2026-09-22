// UI chrome strings only (nav, search, language switch). Page content
// (hero, features, testimonials, footer) is loaded live from the CMS —
// see home-content.js.
const dict = {
  en: {
    search: 'Search',
    'nav.blog': 'Blog',
    'nav.docs': 'Docs',
    'nav.showcase': 'Showcase',
    'nav.resources': 'Resources ⌄',
  },
  es: {
    search: 'Buscar',
    'nav.blog': 'Blog',
    'nav.docs': 'Documentos',
    'nav.showcase': 'Portafolio',
    'nav.resources': 'Recursos ⌄',
  },
};

function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.innerHTML = dict[lang][el.dataset.i18n]));
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
  if (window.renderHomeContent) window.renderHomeContent(lang);
  try {
    localStorage.setItem('lang', lang);
  } catch {}
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

let saved = 'en';
try {
  saved = localStorage.getItem('lang') || 'en';
} catch {}
window.currentLang = saved;
setLang(saved);
