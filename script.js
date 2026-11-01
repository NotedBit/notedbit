document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]") || document.getElementById("primary-nav");
const year = document.querySelector("[data-year]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeNav = () => {
  if (!navToggle || !nav) return;

  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!open));
    navToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("nav-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeNav();
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


/* Functional portfolio navigation: progressive disclosure without frameworks. */
(() => {
  'use strict';
  const isGerman = () => document.documentElement.lang === 'de';
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Featured project cards use native <details>: keyboard, touch and no-JS fallbacks.
  const featured = Array.from(document.querySelectorAll('.studio-project'));
  featured.forEach(card => {
    card.addEventListener('toggle', () => {
      if (card.open) featured.forEach(other => { if (other !== card) other.open = false; });
      else card.querySelectorAll('video').forEach(video => video.pause());
    });
  });

  // WAI-ARIA tab behavior: only one panel shown; left/right/home/end keys supported.
  document.querySelectorAll('[data-studio-tabs]').forEach(root => {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    function activate(tab, focus = false) {
      tabs.forEach(button => {
        const selected = button === tab;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        let next = i;
        if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[next], true);
      });
    });
    const restoreHash = () => {
      if (window.location.hash === '#skills') {
        const tech = tabs.find(t => t.dataset.studioTab === 'stack');
        if (tech) activate(tech);
      }
    };
    restoreHash();
    window.addEventListener('hashchange', restoreHash);
  });

  // Optional case study reading: preserve every heading and its original text.
  // Without JavaScript the full content stays visible. With JS only secondary
  // sections fold away until requested; section anchors remain shareable.
  const caseSections = Array.from(document.querySelectorAll('main > .case-section'));
  if (caseSections.length) {
    const nav = document.createElement('nav');
    nav.className = 'case-jump-nav section-shell';
    nav.setAttribute('aria-label', 'Sections in this case study');
    nav.dataset.ariaLabelDe = 'Abschnitte dieser Fallstudie';
    const list = document.createElement('div');
    list.className = 'case-jump-links';
    nav.appendChild(list);
    caseSections.forEach((section, i) => {
      const head = section.querySelector('.case-section-head');
      const body = section.querySelector('.case-section-body');
      const heading = head?.querySelector('h2');
      if (!head || !body || !heading) return;
      if (!section.id) section.id = `case-part-${i+1}`;
      const entry = document.createElement('a');
      entry.href = `#${section.id}`;
      entry.textContent = heading.textContent.trim();
      if (heading.dataset.de) entry.dataset.de = heading.dataset.de;
      entry.className = 'case-jump-link';
      list.appendChild(entry);

      if (!body.id) body.id = `case-body-${i+1}`;
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'case-collapse-toggle';
      toggle.setAttribute('aria-controls', body.id);
      const text = document.createElement('span');
      const glyph = document.createElement('span');
      glyph.className = 'case-toggle-chevron';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = '⌄';
      toggle.append(text, glyph);
      head.append(toggle);
      const setOpen = open => {
        body.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        text.textContent = isGerman() ? (open ? 'Weniger' : 'Details') : (open ? 'Less' : 'Details');
        toggle.setAttribute('aria-label', isGerman() ? (open ? 'Abschnitt einklappen' : 'Abschnitt aufklappen') : (open ? 'Collapse section' : 'Expand section'));
      };
      setOpen(i === 0 || section.contains(document.getElementById(decodeURIComponent(window.location.hash.slice(1)))));
      toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
      document.addEventListener('notedbit:languagechange', () => setOpen(toggle.getAttribute('aria-expanded') === 'true'));
      entry.addEventListener('click', () => setOpen(true));
      window.addEventListener('hashchange', () => {
        if (window.location.hash.slice(1) === section.id || section.contains(document.getElementById(decodeURIComponent(window.location.hash.slice(1))))) setOpen(true);
      });
    });
    if (list.childElementCount) caseSections[0].before(nav);
  }
})();
