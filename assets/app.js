/* ZPA — navigation, subject search/filtering, dialogs and small interactions. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     Announcement strip
     -------------------------------------------------------------------------- */
  const topNote = $('#top-note');
  let noteDismissed = false;
  try { noteDismissed = sessionStorage.getItem('zpa-note-dismissed') === 'true'; } catch { /* storage unavailable */ }
  if (topNote && noteDismissed) topNote.hidden = true;
  $$('[data-dismiss-note]').forEach((button) => {
    button.addEventListener('click', () => {
      topNote.hidden = true;
      try { sessionStorage.setItem('zpa-note-dismissed', 'true'); } catch { /* storage unavailable */ }
    });
  });

  /* --------------------------------------------------------------------------
     Sticky header, back-to-top and active navigation
     -------------------------------------------------------------------------- */
  const header = $('#site-header');
  const backToTop = $('#back-to-top');
  const navLinks = $$('[data-nav]');
  const navSections = ['home', 'about', 'academics', 'form-five', 'admissions', 'news', 'gallery', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function syncScrollUi() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (backToTop) backToTop.classList.toggle('is-visible', window.scrollY > 520);

    const marker = window.scrollY + (header?.offsetHeight || 70) + 120;
    let active = 'home';
    [...navSections]
      .sort((a, b) => a.offsetTop - b.offsetTop)
      .forEach((section) => {
        if (section.offsetTop <= marker) active = section.id;
      });
    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === active;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', syncScrollUi, { passive: true });
  window.addEventListener('resize', syncScrollUi);
  syncScrollUi();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------------------------- */
  const mobileMenu = $('#mobile-menu');
  const menuOverlay = $('#menu-overlay');
  const navToggle = $('.nav-toggle');

  function setMobileMenu(open) {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.inert = !open;
    menuOverlay.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      const firstLink = $('a', mobileMenu);
      firstLink?.focus({ preventScroll: true });
    } else if (navToggle && document.activeElement && mobileMenu.contains(document.activeElement)) {
      navToggle.focus({ preventScroll: true });
    }
  }

  if (mobileMenu) mobileMenu.inert = true;
  navToggle?.addEventListener('click', () => setMobileMenu(!mobileMenu.classList.contains('is-open')));
  $$('[data-close-menu]').forEach((button) => button.addEventListener('click', () => setMobileMenu(false)));
  menuOverlay?.addEventListener('click', () => setMobileMenu(false));
  $$('a', mobileMenu || document).forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) setMobileMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMobileMenu(false);
  });

  /* --------------------------------------------------------------------------
     Smooth scrolling with sticky-header offset
     -------------------------------------------------------------------------- */
  function scrollToTarget(target) {
    if (!target) return;
    const offset = (header?.offsetHeight || 70) + 14;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash) return;
      if (hash === '#') {
        event.preventDefault();
        return;
      }
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      setMobileMenu(false);
      scrollToTarget(target);
      try { history.replaceState(null, '', hash); } catch { /* file:// or restricted history */ }
    });
  });

  /* --------------------------------------------------------------------------
     Reveal on scroll and counters
     -------------------------------------------------------------------------- */
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const counterElements = $$('[data-count]');
  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    if (!target || reduceMotion) {
      element.textContent = String(target);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counterElements.forEach((element) => counterObserver.observe(element));
  } else {
    counterElements.forEach(animateCounter);
  }

  /* --------------------------------------------------------------------------
     Subject search and category filtering
     -------------------------------------------------------------------------- */
  const programGrid = $('#program-grid');
  const programCards = $$('.program-card', programGrid || document);
  const programSearch = $('#program-search');
  const heroSearch = $('#hero-search');
  const heroSearchForm = $('#hero-search-form');
  const clearSearch = $('#clear-program-search');
  const programCount = $('#program-count');
  const programEmpty = $('#program-empty');
  const resetFilters = $('#reset-program-filters');
  const state = { query: '' };

  function applyProgramFilters() {
    const query = state.query.trim().toLowerCase();
    let visible = 0;

    programCards.forEach((card) => {
      const haystack = [
        card.dataset.keywords || '',
        card.textContent || '',
      ].join(' ').toLowerCase();
      const show = !query || haystack.includes(query);
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (programCount) programCount.textContent = String(visible);
    if (programEmpty) programEmpty.hidden = visible !== 0;
    if (clearSearch) clearSearch.classList.toggle('is-visible', Boolean(query));
  }

  programSearch?.addEventListener('input', () => {
    state.query = programSearch.value;
    applyProgramFilters();
  });

  heroSearchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    state.query = heroSearch?.value || '';
    if (programSearch) programSearch.value = state.query;
    applyProgramFilters();
    const academics = document.getElementById('academics');
    if (academics) scrollToTarget(academics);
  });

  clearSearch?.addEventListener('click', () => {
    state.query = '';
    if (programSearch) programSearch.value = '';
    applyProgramFilters();
    programSearch?.focus();
  });

  resetFilters?.addEventListener('click', () => {
    state.query = '';
    if (programSearch) programSearch.value = '';
    applyProgramFilters();
  });

  applyProgramFilters();

  /* --------------------------------------------------------------------------
     Dialog management
     -------------------------------------------------------------------------- */
  let lastTrigger = null;

  function syncModalLock() {
    document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
  }

  function openDialog(dialog, trigger = null) {
    if (!dialog) return;
    lastTrigger = trigger || document.activeElement;
    dialog.scrollTop = 0;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    syncModalLock();
    const focusable = dialog.querySelector('input, select, textarea, button, a[href]');
    focusable?.focus({ preventScroll: true });
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    syncModalLock();
    if (lastTrigger && document.contains(lastTrigger) && lastTrigger.offsetParent !== null) {
      lastTrigger.focus({ preventScroll: true });
    }
  }

  $$('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener('close', syncModalLock);
  });
  $$('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => closeDialog(button.closest('dialog')));
  });

  const admissionsDialog = $('#admissions-dialog');
  $$('[data-open-admissions]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.closest('#mobile-menu')) setMobileMenu(false);
      const parentDialog = button.closest('dialog');
      if (parentDialog) {
        if (typeof parentDialog.close === 'function') parentDialog.close();
        setTimeout(() => openDialog(admissionsDialog, button), 0);
      } else {
        openDialog(admissionsDialog, button);
      }
      syncModalLock();
    });
  });

  const programDialog = $('#program-dialog');
  const programDialogCategory = $('#program-dialog-category');
  const programDialogTitle = $('#program-dialog-title');
  const programDialogDescription = $('#program-dialog-description');
  const programDialogDetails = $('#program-dialog-details');
  const programDialogCareers = $('#program-dialog-careers');
  const programDialogCombination = $('#program-dialog-combination');

  $$('[data-open-program]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!programDialog) return;
      programDialogCategory.textContent = button.dataset.category || 'Subject';
      programDialogTitle.textContent = button.dataset.title || 'Subject details';
      programDialogDescription.textContent = button.dataset.description || '';
      programDialogDetails.textContent = button.dataset.details || '';
      programDialogCareers.textContent = button.dataset.careers || 'Guidance available from the admissions team';
      programDialogCombination.textContent = button.dataset.combination || 'Speak to us about a suitable combination';
      openDialog(programDialog, button);
    });
  });

  const newsDialog = $('#news-dialog');
  const newsDialogCategory = $('#news-dialog-category');
  const newsDialogTitle = $('#news-dialog-title');
  const newsDialogBody = $('#news-dialog-body');
  $$('[data-open-news]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!newsDialog) return;
      newsDialogCategory.textContent = button.dataset.category || 'News';
      newsDialogTitle.textContent = button.dataset.title || 'Update';
      newsDialogBody.textContent = button.dataset.body || '';
      openDialog(newsDialog, button);
    });
  });

  /* Gallery filtering and lightbox */
  const galleryDialog = $('#gallery-dialog');
  const galleryGrid = $('#gallery-grid');
  const galleryCards = $$('.gallery-card');
  const galleryFilters = $$('.gallery-filter');
  const galleryCount = $('#gallery-count');
  const galleryImage = $('#gallery-image');
  const galleryTitle = $('#gallery-title');
  const galleryCaption = $('#gallery-caption');
  const galleryCounter = $('#gallery-counter');
  const galleryPrev = $('[data-gallery-prev]');
  const galleryNext = $('[data-gallery-next]');
  let galleryIndex = 0;

  const visibleGalleryCards = () => galleryCards.filter((card) => !card.hidden);

  function syncGalleryCounter() {
    const total = visibleGalleryCards().length;
    if (galleryCount) galleryCount.textContent = `${total} photo${total === 1 ? '' : 's'}`;
  }

  function setGalleryPhoto(card) {
    const list = visibleGalleryCards();
    galleryIndex = Math.max(0, list.indexOf(card));
    const image = card.querySelector('img');
    galleryImage.src = card.dataset.gallerySrc;
    galleryImage.alt = image ? image.alt : '';
    galleryTitle.textContent = card.dataset.galleryTitle || 'Campus photo';
    galleryCaption.textContent = card.dataset.galleryCaption || '';
    if (galleryCounter) galleryCounter.textContent = `${galleryIndex + 1} / ${list.length}`;
    const single = list.length < 2;
    if (galleryPrev) galleryPrev.disabled = single;
    if (galleryNext) galleryNext.disabled = single;
  }

  function stepGallery(direction) {
    const list = visibleGalleryCards();
    if (!list.length) return;
    galleryIndex = (galleryIndex + direction + list.length) % list.length;
    setGalleryPhoto(list[galleryIndex]);
  }

  galleryFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.galleryFilter;
      galleryCards.forEach((card) => {
        const show = category === 'All' || card.dataset.galleryCategory === category;
        card.hidden = !show;
        if (show) {
          card.classList.remove('is-entering');
          void card.offsetWidth;
          card.classList.add('is-entering');
        }
      });
      galleryGrid?.classList.toggle('is-all', category === 'All');
      galleryFilters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      syncGalleryCounter();
    });
  });

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!galleryDialog) return;
      setGalleryPhoto(card);
      openDialog(galleryDialog, card);
    });
  });

  galleryPrev?.addEventListener('click', () => stepGallery(-1));
  galleryNext?.addEventListener('click', () => stepGallery(1));

  $('.lightbox-stage')?.addEventListener('click', (event) => {
    if (event.target === event.currentTarget) closeDialog(galleryDialog);
  });

  document.addEventListener('keydown', (event) => {
    if (!galleryDialog?.open) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepGallery(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepGallery(1);
    }
  });

  /* --------------------------------------------------------------------------
     Admission enquiry form (client-side mailto fallback)
     -------------------------------------------------------------------------- */
  const enquiryForm = $('#enquiry-form');
  const enquiryNote = $('#enquiry-note');
  const ADMISSIONS_EMAIL = (window.ZPA_SETTINGS && window.ZPA_SETTINGS.email) || 'zanplan26@gmail.com';

  enquiryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(enquiryForm);
    const name = String(data.get('name') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const stream = String(data.get('stream') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !contact) {
      if (enquiryNote) {
        enquiryNote.hidden = false;
        enquiryNote.textContent = 'Please add your name and a phone number or email so the admissions team can reply.';
      }
      return;
    }

    const subject = `Admission enquiry — ${name} (${stream})`;
    const body = [
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Preferred stream: ${stream}`,
      '',
      message || 'I would like more information about Form Five admission.',
    ].join('\n');

    if (enquiryNote) {
      enquiryNote.hidden = false;
      enquiryNote.textContent = 'Your email app should open with the enquiry ready to send. If it does not, please call or visit the admissions office using the contact details on this page.';
    }
    window.location.href = `mailto:${ADMISSIONS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* --------------------------------------------------------------------------
     Footer year
     -------------------------------------------------------------------------- */
  const year = $('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
