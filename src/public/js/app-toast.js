// /public/js/app-toast.js
(() => {
  let timer;

  function ensureToastEl() {
    let el = document.getElementById('appToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'appToast';
      el.className = 'app-toast';
      el.hidden = true;
      el.innerHTML = `
        <i class="app-toast__icon fas fa-check-circle" aria-hidden="true"></i>
        <span class="app-toast__text"></span>
      `;
      document.body.appendChild(el);
    }
    return el;
  }

  window.showToast = function (message, type = 'success', ms = 2500) {
    const el = ensureToastEl();
    const text = el.querySelector('.app-toast__text');
    const icon = el.querySelector('.app-toast__icon');

    el.classList.remove('app-toast--success', 'app-toast--error', 'show');
    el.hidden = false;

    if (type === 'error') {
      el.classList.add('app-toast--error');
      icon.className = 'app-toast__icon fas fa-times-circle';
    } else {
      el.classList.add('app-toast--success');
      icon.className = 'app-toast__icon fas fa-check-circle';
    }

    text.textContent = message;

    // reflow
    void el.offsetWidth;
    el.classList.add('show');

    clearTimeout(timer);
    timer = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => { el.hidden = true; }, 250);
    }, ms);
  };
})();
