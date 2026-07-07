/**
 * partials.js
 * Loads the canonical topbar and footer from /gov/assets/partials/ so every
 * page stays in sync automatically instead of hand-copying the same markup.
 *
 * IMPORTANT: the `.notice-banner` div is intentionally NOT part of the
 * fetched topbar partial — it stays as static markup on every page, right
 * after the `#topbar-placeholder` div. stats.js's loadActiveBanner() runs on
 * DOMContentLoaded and does `document.querySelector('.notice-banner')`; if
 * that element only existed inside a partial that hasn't finished fetching
 * yet, the banner would silently fail to render on a slow connection. Keep
 * `<div class="notice-banner"></div>` in the page HTML itself.
 *
 * Usage on a page:
 *   <div id="topbar-placeholder"></div>
 *   <div class="notice-banner"></div>
 *   <script src="/gov/assets/js/partials.js"></script>
 *   ... page content ...
 *   <div id="footer-placeholder"></div>
 *
 * Edit the actual topbar/footer markup in assets/partials/*.html — never
 * inline it back into individual pages. See MAINTENANCE.md.
 */

async function loadPartial(url, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return false;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    mount.outerHTML = await res.text();
    return true;
  } catch (err) {
    // Fails closed: on a broken fetch the placeholder div is simply left
    // empty rather than breaking the rest of the page.
    console.warn(`[partials] failed to load ${url}:`, err);
    return false;
  }
}

function markActiveTopbarLink() {
  const path = window.location.pathname;
  const links = Array.from(document.querySelectorAll('#topbar .topbar-inner a'));
  if (!links.length) return;

  // Longest href first, so a specific match (e.g. /gov/systems/id/) wins
  // over a shorter generic one (e.g. /gov/) that would otherwise also match.
  const sorted = links.slice().sort(
    (a, b) => b.getAttribute('href').length - a.getAttribute('href').length
  );

  let matched = null;
  for (const a of sorted) {
    const href = a.getAttribute('href');
    const isHomeLink = href === '/gov/';
    const isMatch = isHomeLink
      ? (path === '/gov/' || path === '/gov/index.html' || path === '/gov/ms-my.html')
      : path.startsWith(href);
    if (isMatch) {
      matched = a;
      break;
    }
  }

  links.forEach((a) => a.classList.remove('active'));
  if (matched) matched.classList.add('active');
}

(async function initPartials() {
  const topbarLoaded = await loadPartial('/gov/assets/partials/topbar.html', 'topbar-placeholder');
  if (topbarLoaded) markActiveTopbarLink();

  await loadPartial('/gov/assets/partials/footer.html', 'footer-placeholder');

  document.dispatchEvent(new CustomEvent('partials:loaded'));
})();
