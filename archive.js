// In-page project archive: category controls, searchable accessible details and lazy demos.
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('project-search');
    const records = Array.from(document.querySelectorAll('.archive-record'));
    const groups = Array.from(document.querySelectorAll('.archive-group'));
    const filters = Array.from(document.querySelectorAll('[data-filter]'));
    const feedback = document.querySelector('[data-result-count]');
    if (!search || !records.length) return;
    let category = 'all';
    const archiveMain = document.getElementById('project-groups');
    const views = Array.from(document.querySelectorAll('[data-archive-view]'));
    const bulkButtons = Array.from(document.querySelectorAll('[data-archive-expand]'));
    // Preserve each item's original category container so category tabs can restore it.
    const originalParents = new Map(records.map(record => [record, record.parentElement]));
    const chronologicalRecords = [...records].sort((a, b) =>
      Number(b.dataset.sortYear || 0) - Number(a.dataset.sortYear || 0));
    const chronologicalSection = document.createElement('section');
    chronologicalSection.className = 'archive-all-section';
    chronologicalSection.setAttribute('aria-label', 'All projects, newest documented work first');
    const chronologicalList = document.createElement('div');
    chronologicalList.className = 'archive-records archive-all-records';
    chronologicalSection.append(chronologicalList);
    if (archiveMain) archiveMain.insertBefore(chronologicalSection, archiveMain.firstChild);
    let placement = null;
    function placeRecords() {
      const newPlacement = category === 'all' ? 'all' : 'categories';
      if (placement === newPlacement) return;
      if (newPlacement === 'all') {
        chronologicalRecords.forEach(record => chronologicalList.appendChild(record));
      } else {
        records.forEach(record => originalParents.get(record).appendChild(record));
      }
      chronologicalSection.hidden = newPlacement !== 'all';
      placement = newPlacement;
    }

    function update() {
      placeRecords();
      const q = search.value.trim().toLocaleLowerCase();
      let shown = 0;
      for (const record of records) {
        const searchable = (record.dataset.search || '').toLocaleLowerCase();
        const visible = (category === 'all' || record.dataset.category === category) && (!q || searchable.includes(q));
        record.hidden = !visible;
        if (!visible && record.open) record.open = false;
        if (visible) shown++;
      }
      for (const group of groups) {
        group.hidden = category === 'all' || !group.querySelector('.archive-record:not([hidden])');
      }
      if (archiveMain) archiveMain.classList.toggle('is-all-view', category === 'all');
      for (const button of filters) {
        button.setAttribute('aria-pressed', String(button.dataset.filter === category));
      }
      const de = document.documentElement.lang === 'de';
      if (feedback) feedback.textContent = de
        ? (shown === 1 ? '1 Projekt angezeigt' : `${shown} Projekte angezeigt`)
        : (shown === 1 ? '1 project shown' : `${shown} projects shown`);
    }

    function selectCategory(value) {
      if (!filters.some(b => b.dataset.filter === value)) return;
      category = value;
      update();
    }

    filters.forEach((button, i) => {
      button.addEventListener('click', () => selectCategory(button.dataset.filter));
      // Segmented control supports arrow, Home and End for keyboard users.
      button.addEventListener('keydown', event => {
        let next = i;
        if (event.key === 'ArrowRight') next = (i + 1) % filters.length;
        else if (event.key === 'ArrowLeft') next = (i - 1 + filters.length) % filters.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = filters.length - 1;
        else return;
        event.preventDefault();
        filters[next].focus();
        selectCategory(filters[next].dataset.filter);
      });
    });
    views.forEach(button => {
      button.addEventListener('click', () => {
        const cardMode = button.dataset.archiveView === 'cards';
        if (archiveMain) archiveMain.classList.toggle('is-card-view', cardMode);
        views.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      });
    });
    let bulkExpanding = false;
    bulkButtons.forEach(button => {
      button.addEventListener('click', () => {
        const opening = button.dataset.archiveExpand === 'all';
        bulkExpanding = opening;
        records.forEach(record => {
          if (!opening || !record.hidden) record.open = opening;
        });
        window.setTimeout(() => { bulkExpanding = false; }, 0);
      });
    });
    search.addEventListener('input', update);
    document.addEventListener('notedbit:languagechange', update);

    records.forEach(record => {
      record.addEventListener('toggle', () => {
        if (!record.open) {
          const video = record.querySelector('video');
          if (video) video.pause();
          // Stop a loaded game when its project closes or its category is hidden.
          const game = record.querySelector('.archive-game');
          const frame = game?.querySelector('.archive-game-frame');
          const iframe = frame?.querySelector('iframe');
          const button = game?.querySelector('[data-game-toggle]');
          if (frame) frame.hidden = true;
          if (iframe) iframe.removeAttribute('src');
          if (button) {
            button.setAttribute('aria-expanded', 'false');
            const label = button.querySelector('[data-de]');
            if (label) {
              label.dataset.de = 'Spiel hier laden';
              label.textContent = document.documentElement.lang === 'de' ? 'Spiel hier laden' : 'Load game here';
            }
          }
          return;
        }
        // One expanded project at a time, even where details[name] is unsupported.
        if (!bulkExpanding) records.forEach(other => {
          if (other !== record && other.open) other.open = false;
        });
        // A shareable link without navigating away.
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#' + encodeURIComponent(record.id));
        }
      });
    });

    // Embed the already-published browser game only when requested.
    document.querySelectorAll('[data-game-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const container = button.closest('.archive-game');
        const frame = container?.querySelector('.archive-game-frame');
        const iframe = frame?.querySelector('iframe[data-game-src]');
        if (!frame || !iframe) return;
        const opening = frame.hidden;
        frame.hidden = !opening;
        button.setAttribute('aria-expanded', String(opening));
        const de = document.documentElement.lang === 'de';
        // Keep buttons bilingual without putting translated text in a live label.
        const label = button.querySelector('[data-de]');
        if (label) {
          label.dataset.de = opening ? 'Spiel verbergen' : 'Spiel hier laden';
          label.textContent = opening ? (de ? 'Spiel verbergen' : 'Hide game') : (de ? 'Spiel hier laden' : 'Load game here');
        }
        if (opening && !iframe.hasAttribute('src')) iframe.src = iframe.dataset.gameSrc;
        if (!opening && iframe.contentWindow) {
          // Remove the iframe source so a running game does not keep consuming CPU.
          iframe.removeAttribute('src');
        }
      });
    });

    // The homepage can link directly to a specific expanded project (#video etc.).
    function openHash() {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const target = records.find(r => r.id === hash);
      if (!target) return;
      category = target.dataset.category;
      search.value = '';
      update();
      target.open = true;
      window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
    }

    update();
    openHash();
    window.addEventListener('hashchange', openHash);
  });
})();
