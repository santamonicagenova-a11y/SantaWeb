/*!
 * Cursor Follower – Santamonica (variante admin, tema scuro/ambra)
 * v2026.09.05.01
 * Adattato da cursor-follower.js (HANDOVER v2026.06.05.01, mai deployato):
 * stesso meccanismo, colore riportato su var(--rust)/ambra per restare
 * leggibile sullo sfondo scuro di menu-admin.html (niente mix-blend-mode,
 * che sul dark theme risultava invisibile).
 * A11y: rispetta prefers-reduced-motion. Disabilitato su touch/mobile.
 * Inclusione: <script defer src="/cursor-follower-admin.js"></script>
 */
(function () {
  'use strict';

  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function init() {
    if (document.getElementById('cursor-follower')) return;

    var style = document.createElement('style');
    style.id = 'cursor-follower-style';
    style.textContent =
      '#cursor-follower{' +
        'position:fixed;width:24px;height:24px;' +
        'border:2.5px solid rgba(214,155,74,.65);border-radius:50%;' +
        'pointer-events:none;left:0;top:0;' +
        'transform:translate3d(-50%,-50%,0);' +
        'transition:left .12s ease-out,top .12s ease-out,opacity .2s ease;' +
        'z-index:9999;opacity:0;' +
        'will-change:left,top;' +
      '}' +
      '#cursor-follower.cf-visible{opacity:1;}' +
      '#cursor-follower.cf-active{' +
        'border-color:rgba(214,155,74,.9);' +
        'box-shadow:0 0 8px rgba(214,155,74,.35);' +
      '}';
    document.head.appendChild(style);

    var follower = document.createElement('div');
    follower.id = 'cursor-follower';
    follower.setAttribute('aria-hidden', 'true');
    document.body.appendChild(follower);

    var firstMove = true;

    document.addEventListener('mousemove', function (e) {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
      if (firstMove) { follower.classList.add('cf-visible'); firstMove = false; }
      var t = e.target;
      var interactive = t.tagName === 'A' || t.tagName === 'BUTTON' ||
                        (t.closest && t.closest('a,button,[role="button"],input,select,textarea'));
      follower.classList.toggle('cf-active', !!interactive);
    }, { passive: true });

    document.addEventListener('mouseleave', function () { follower.classList.remove('cf-visible'); });
    document.addEventListener('mouseenter', function () { follower.classList.add('cf-visible'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
