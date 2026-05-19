/**
 * stats.js — The Legend of Legiona Analytics + Banner System
 * ----------------------------------------------------------
 * Drop-in module. No per-page config needed.
 *
 * Place before </body>:
 * <script type="module" src="/gov/assets/js/stats.js"></script>
 *
 * Public API:
 *   window.statsTrackEvent('event_name')
 */

import {
  initializeApp,
  getApps
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  increment,
  collection,
  getDocs,
  where,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ─────────────────────────────────────────────
   FIREBASE CONFIG
───────────────────────────────────────────── */
const FB_CONFIG = {
  apiKey:            "AIzaSyAgrLJDO8F6yyVLFubiZdRGiEl5ICRSAdQ",
  authDomain:        "the-legend-of-legiona-the-lol.firebaseapp.com",
  projectId:         "the-legend-of-legiona-the-lol",
  storageBucket:     "the-legend-of-legiona-the-lol.firebasestorage.app",
  messagingSenderId: "29247096448",
  appId:             "1:29247096448:web:370f536ad630c088b94865",
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(FB_CONFIG);

const db = getFirestore(app);

/* ─────────────────────────────────────────────
   PAGE DETECTION
───────────────────────────────────────────── */
function detectPage() {
  const p = location.pathname;

  if (p.includes('/citizenship/apply')) {
    return 'page_apply';
  }

  if (p.includes('/citizenship/status')) {
    return 'page_status';
  }

  if (p.includes('/citizenship')) {
    return 'page_citizenship';
  }

  if (p.includes('/id/id-card')) {
    return 'page_id_card';
  }

  if (p.includes('/id/registry')) {
    return 'page_registry';
  }

  if (
    (p.includes('/gov') && p.endsWith('/gov/')) ||
    p.endsWith('/gov')
  ) {
    return 'page_gov_home';
  }

  if (p.includes('/isc')) {
    return 'page_isc';
  }

  if (p.includes('/main')) {
    return 'page_main';
  }

  return 'page_other';
}

const PAGE  = detectPage();
const today = new Date().toISOString().split('T')[0];
const hour  = new Date().getHours();

/* ─────────────────────────────────────────────
   DEDUPLICATION
───────────────────────────────────────────── */
const SESSION_KEY = `lol_s_${PAGE}`;
const DAILY_KEY   = `lol_uv_${today}`;

const isNewSession =
  !sessionStorage.getItem(SESSION_KEY);

const isNewDailyVisit =
  !localStorage.getItem(DAILY_KEY);

if (isNewSession) {
  sessionStorage.setItem(SESSION_KEY, '1');
}

if (isNewDailyVisit) {
  localStorage.setItem(DAILY_KEY, '1');
}

/* ─────────────────────────────────────────────
   PAGE VIEW TRACKING
───────────────────────────────────────────── */
async function flushPageView() {
  try {
    const counters = {};
    const daily    = {};

    // Session counters
    if (isNewSession) {
      counters[PAGE] = increment(1);
      counters.total_sessions = increment(1);
    }

    // Unique visitor counter
    if (isNewDailyVisit) {
      counters.total_unique_visitors = increment(1);
      daily.unique_visitors = increment(1);
    }

    // Daily traffic
    daily[`h${hour}`] = increment(1);
    daily[PAGE]       = increment(1);
    daily.total       = increment(1);

    const writes = [
      setDoc(
        doc(db, 'analytics', `daily_${today}`),
        daily,
        { merge: true }
      )
    ];

    if (Object.keys(counters).length > 0) {
      writes.push(
        setDoc(
          doc(db, 'analytics', 'counters'),
          counters,
          { merge: true }
        )
      );
    }

    await Promise.all(writes);

  } catch (err) {
    console.error('[stats] Page tracking failed:', err);
  }
}

/* ─────────────────────────────────────────────
   EVENT TRACKER
───────────────────────────────────────────── */
async function trackEvent(eventName) {
  if (!eventName) return;

  try {
    await Promise.all([
      setDoc(
        doc(db, 'analytics', 'counters'),
        {
          [eventName]: increment(1)
        },
        { merge: true }
      ),

      setDoc(
        doc(db, 'analytics', `daily_${today}`),
        {
          [eventName]: increment(1)
        },
        { merge: true }
      )
    ]);

  } catch (err) {
    console.error('[stats] Event tracking failed:', err);
  }
}

/* ─────────────────────────────────────────────
   FORM ABANDONMENT TRACKING
───────────────────────────────────────────── */
function setupAbandonTracking() {
  const form = document.getElementById('citizenForm');

  if (!form) return;

  let touched = false;
  let submitted = false;

  form.addEventListener(
    'focusin',
    () => {
      touched = true;
    },
    { once: true }
  );

  form.addEventListener('submit', () => {
    submitted = true;
  });

  document.addEventListener('visibilitychange', () => {
    const abandoned =
      document.visibilityState === 'hidden' &&
      touched &&
      !submitted;

    if (abandoned) {
      trackEvent('form_abandonments');
    }
  });
}

/* ─────────────────────────────────────────────
   ANNOUNCEMENT BANNER SYSTEM
───────────────────────────────────────────── */
async function loadActiveBanner() {
  const banner = document.querySelector('.notice-banner');

  // No banner element on page
  if (!banner) return;

  try {
    const q = query(
      collection(db, 'announcements'),
      where('active', '==', true),
      orderBy('order', 'asc')
    );

    const snap = await getDocs(q);

    // Hide banner if nothing active
    if (snap.empty) {
      banner.style.display = 'none';
      return;
    }

    const items = [];

    snap.forEach((docSnap) => {
      const a = docSnap.data();

      const type = String(a.type || 'notice')
        .toUpperCase();

      const body = a.body || '';

      const linkHTML = a.link
        ? `
          — <a href="${a.link}">
              ${a.linkText || 'VIEW'} →
            </a>
        `
        : '';

      items.push(`
        <div class="notice-item">
          <span class="tag">${type}</span>
          <span class="notice-text">
            ${body}
            ${linkHTML}
          </span>
        </div>
      `);
    });

    banner.innerHTML = items.join('');

  } catch (err) {
    console.error('[stats] Banner load failed:', err);
    banner.style.display = 'none';
  }
}

/* ─────────────────────────────────────────────
   GLOBAL API
───────────────────────────────────────────── */
window.statsTrackEvent = trackEvent;

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
async function initStats() {
  await flushPageView();

  setupAbandonTracking();

  await loadActiveBanner();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStats);
} else {
  initStats();
}
