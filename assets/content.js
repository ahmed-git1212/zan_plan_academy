/*
 * ZPA content loader.
 * Reads the editable JSON files in /content (managed by Decap CMS at /admin)
 * and renders the lists + contact details before loading app.js.
 */
(() => {
  'use strict';

  const ENDPOINTS = {
    settings: 'content/settings.json',
    combinations: 'content/combinations.json',
    gallery: 'content/gallery.json',
    news: 'content/news.json',
    faculty: 'content/faculty.json',
    testimonials: 'content/testimonials.json'
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));

  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${esc(name)}"></use></svg>`;

  async function loadJson(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`${path} responded ${response.status}`);
    return response.json();
  }

  function renderList(selector, items, template) {
    const target = document.querySelector(selector);
    if (!target || !Array.isArray(items)) return;
    target.innerHTML = items.map(template).join('');
  }

  const combinationCard = (item) => `
    <article class="program-card reveal" data-category="Sciences" data-keywords="${esc(item.keywords)}">
      <div class="program-card-top">
        <span class="subject-icon">${icon(item.icon || 'atom')}</span>
        <span class="program-category">${esc(item.code)}</span>
      </div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <div class="program-meta"><span>Form Five</span><span>Science combination</span></div>
      <button class="program-link" type="button" data-open-program
        data-title="${esc(`${item.code} — ${item.title}`)}"
        data-category="Science combination"
        data-description="${esc(item.description)}"
        data-details="${esc(item.details)}"
        data-careers="${esc(item.careers)}"
        data-combination="${esc(item.subjects)}">
        View combination details ${icon('arrow-right')}
      </button>
    </article>`;

  const galleryCard = (item) => `
    <button class="gallery-card" type="button"
      data-gallery-category="${esc(item.category)}"
      data-gallery-src="${esc(item.image)}"
      data-gallery-title="${esc(item.title)}"
      data-gallery-caption="${esc(item.description)}"
      aria-label="View larger photo: ${esc(item.title)}">
      <img src="${esc(item.image)}" alt="${esc(item.alt)}" width="1000" height="667" loading="lazy">
      <span class="gallery-gradient" aria-hidden="true"></span>
      <span class="gallery-text">
        <strong>${esc(item.title)}</strong>
        <small>${esc(item.subtitle)}</small>
      </span>
    </button>`;

  const newsCard = (item) => `
    <article class="news-card reveal">
      <div class="news-thumb news-thumb-${esc(item.theme || 'a')}">
        ${icon(item.icon || 'graduation')}
        <span>${esc(item.category)}</span>
      </div>
      <div class="news-body">
        <p class="news-date">${icon('calendar')} ${esc(item.date)}</p>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.summary)}</p>
        <button class="text-button" type="button" data-open-news
          data-title="${esc(item.title)}"
          data-category="${esc(item.category)}"
          data-body="${esc(item.body)}">
          Read update ${icon('arrow-right')}
        </button>
      </div>
    </article>`;

  const facultyCard = (item) => `
    <article class="faculty-card reveal">
      <span class="faculty-avatar avatar-${esc(item.avatar || 'a')}">${esc(item.initials)}</span>
      <span class="faculty-tag">${esc(item.subject)}</span>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.description)}</p>
    </article>`;

  const testimonialCard = (item) => `
    <article class="testimonial-card reveal">
      <div class="stars" aria-label="5 out of 5 stars">${icon('star').repeat(5)}</div>
      <svg class="quote-icon" aria-hidden="true"><use href="#i-quote"></use></svg>
      <blockquote>“${esc(item.quote)}”</blockquote>
      <footer>
        <span class="person-avatar">${esc(item.initials)}</span>
        <span><strong>${esc(item.name)}</strong><small>${esc(item.role)}</small></span>
      </footer>
    </article>`;

  function applySettings(settings) {
    window.ZPA_SETTINGS = settings;

    const one = (selector) => document.querySelector(selector);
    const setText = (selector, value) => {
      const element = one(selector);
      if (element && value != null) element.textContent = value;
    };
    const setHref = (selector, value) => {
      const element = one(selector);
      if (element && value) element.href = value;
    };
    const digits = (value) => String(value || '').replace(/\D/g, '');
    const whatsapp = (number, message) => `https://wa.me/${digits(number)}?text=${encodeURIComponent(message || '')}`;

    setText('[data-contact="phone"]', settings.phone_display);
    setHref('[data-contact="phone"]', `tel:${settings.phone_number}`);
    setText('[data-contact="hours"]', settings.office_hours);
    setHref('[data-contact="call"]', `tel:${settings.phone_number}`);
    setHref('[data-contact="whatsapp"]', whatsapp(settings.whatsapp_number, settings.whatsapp_message));

    setText('[data-contact="email"]', settings.email);
    setHref('[data-contact="email"]', `mailto:${settings.email}`);
    setHref('[data-contact="email-link"]', `mailto:${settings.email}`);

    setText('[data-contact="address"]', settings.address);
    setText('[data-contact="po-box"]', settings.po_box);
    setText('[data-contact="city"]', settings.city);

    setText('[data-contact="footer-phone"]', settings.phone_display);
    setHref('[data-contact="footer-phone"]', `tel:${settings.phone_number}`);
    setText('[data-contact="footer-email"]', settings.email);
    setHref('[data-contact="footer-email"]', `mailto:${settings.email}`);
    setHref('[data-contact="instagram"]', settings.instagram_url);
    setHref('[data-contact="whatsapp-social"]', whatsapp(settings.whatsapp_number, settings.whatsapp_message));

    setHref('[data-contact="dev-email"]', `mailto:${settings.developer_email}`);
    setText('[data-contact-text="dev-email"]', settings.developer_email);
    setHref('[data-contact="dev-phone"]', `tel:${settings.developer_phone_number}`);
    setText('[data-contact-text="dev-phone"]', settings.developer_phone_display);
    setHref('[data-contact="dev-whatsapp"]', whatsapp(settings.developer_whatsapp_number, settings.developer_whatsapp_message));

    const requirements = one('#admission-requirements');
    if (requirements && Array.isArray(settings.admission_requirements)) {
      requirements.innerHTML = settings.admission_requirements
        .map((item) => `<li>${icon('check')} ${esc(item)}</li>`)
        .join('');
    }

    const steps = one('#admission-steps');
    if (steps && Array.isArray(settings.admission_steps)) {
      steps.innerHTML = settings.admission_steps
        .map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span> ${esc(item)}</li>`)
        .join('');
    }
  }

  function loadApp() {
    if (document.querySelector('script[data-zpa-app]')) return;
    const script = document.createElement('script');
    script.src = 'assets/app.js';
    script.dataset.zpaApp = 'true';
    document.body.appendChild(script);
  }

  (async () => {
    const [settings, combinations, gallery, news, faculty, testimonials] = await Promise.all(
      Object.values(ENDPOINTS).map((path) => loadJson(path).catch((error) => {
        console.warn('[ZPA content]', error.message);
        return null;
      }))
    );

    if (settings) applySettings(settings);

    if (combinations) renderList('#program-grid', combinations.items, combinationCard);

    if (gallery) {
      renderList('#gallery-grid', gallery.items, galleryCard);
      const count = document.querySelector('#gallery-count');
      const total = Array.isArray(gallery.items) ? gallery.items.length : 0;
      if (count) count.textContent = `${total} photo${total === 1 ? '' : 's'}`;
    }

    if (news) renderList('.news-grid', news.items, newsCard);
    if (faculty) renderList('.faculty-grid', faculty.items, facultyCard);
    if (testimonials) renderList('.testimonial-grid', testimonials.items, testimonialCard);

    loadApp();
  })();
})();
