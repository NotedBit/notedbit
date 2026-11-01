// Lightweight archive filter. All entries remain visible if JavaScript is disabled.
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const query = document.getElementById('project-search');
    const records = [...document.querySelectorAll('.archive-record')];
    const groups = [...document.querySelectorAll('.archive-group')];
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const feedback = document.querySelector('[data-result-count]');
    if (!query || !records.length) return;
    let category = 'all';
    const update = () => {
      const q = query.value.toLocaleLowerCase().trim();
      let count = 0;
      records.forEach(record => {
        const show = (category === 'all' || record.dataset.category === category) && (!q || (record.dataset.search || '').includes(q));
        record.hidden = !show;
        if (show) count++;
      });
      groups.forEach(group => group.hidden = !group.querySelector('.archive-record:not([hidden])'));
      const de = document.documentElement.lang === 'de';
      if (feedback) feedback.textContent = de ? `${count} Einträge angezeigt` : `${count} entries shown`;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.filter;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      update();
    }));
    query.addEventListener('input', update);
    document.addEventListener('notedbit:languagechange', update);
    update();
  });
})();
