// Fetches content/home.yaml live from GitHub and renders it into the
// homepage. Same live-from-repo approach as /posts — no build step needed.
// Edits made in /dashboard (the "Homepage" singleton) show up on refresh.
(function () {
  const OWNER = 'otobongarchibong';
  const REPO = 'prwebsites';
  const BRANCH = 'main';
  const RAW_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/content/home.yaml`;

  let data = null;
  let pendingLang = 'en';

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function render(lang) {
    if (!data) {
      pendingLang = lang;
      return;
    }
    const t = (obj, key) => obj[key + '_' + lang] ?? obj[key + '_en'] ?? '';

    const hero = data.hero || {};
    document.getElementById('hero-title').textContent = t(hero, 'title');
    document.getElementById('hero-sub').textContent = t(hero, 'subtitle');
    document.getElementById('cta-primary').textContent = t(hero, 'cta_primary');
    document.getElementById('cta-secondary').textContent = t(hero, 'cta_secondary');
    document.getElementById('cta-tertiary').textContent = t(hero, 'cta_tertiary');

    const featuresEl = document.getElementById('features');
    if (featuresEl) {
      featuresEl.innerHTML = (data.features || [])
        .map(
          (f) => `<article class="card">
        <div class="icon">${esc(f.icon)}</div>
        <h3>${esc(t(f, 'title'))}</h3>
        <p>${esc(t(f, 'description'))}</p>
      </article>`
        )
        .join('');
    }

    const quotesEl = document.getElementById('quotes');
    if (quotesEl) {
      quotesEl.innerHTML = (data.testimonials || [])
        .map(
          (q) => `<article class="quote"><div class="who"><img class="avatar" src="${esc(q.avatar)}" alt="" width="44" height="44" loading="lazy" /><div><b>${esc(q.name)}</b><small>${esc(q.handle)}</small></div></div><p>${esc(t(q, 'quote'))}</p></article>`
        )
        .join('');
    }

    const cta = data.cta || {};
    document.getElementById('cta-heading').textContent = t(cta, 'heading');
    document.getElementById('cta-button').textContent = t(cta, 'button');
    document.getElementById('love-heading').textContent =
      lang === 'es' ? 'A los clientes les encanta Prwebsitedesign' : 'Clients Love Prwebsitedesign';
    document.getElementById('footer-text').textContent = data['footer_' + lang] || data.footer_en || '';
  }

  window.renderHomeContent = render;

  fetch(RAW_URL)
    .then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then((text) => {
      data = jsyaml.load(text);
      render(pendingLang);
    })
    .catch((err) => {
      console.error('Could not load homepage content from CMS:', err);
    });
})();
