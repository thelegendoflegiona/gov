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
 *
 * PERFORMANCE CHANGES (2026-06):
 *   [PERF-1] loadActiveBanner() now caches rendered HTML in sessionStorage for
 *            BANNER_CACHE_TTL ms, eliminating a Firestore read on every navigation.
 *   [PERF-2] Firebase preconnect hints are injected into <head> at module load
 *            time, giving the browser ~200–400 ms early warning before the first
 *            Firestore SDK call actually fires.
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
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ─────────────────────────────────────────────
   [PERF-2] INJECT FIREBASE PRECONNECT HINTS
   Runs synchronously at module evaluation — before any Firestore call is made.
   Avoids the extra DNS + TCP + TLS roundtrip on first Firebase request.
───────────────────────────────────────────── */
(function injectFirebasePreconnect() {
  const hints = [
    { rel: 'preconnect',   href: 'https://firestore.googleapis.com', crossorigin: true  },
    { rel: 'dns-prefetch', href: 'https://firestore.googleapis.com', crossorigin: false },
    { rel: 'preconnect',   href: 'https://www.googleapis.com',       crossorigin: true  },
    { rel: 'dns-prefetch', href: 'https://www.googleapis.com',       crossorigin: false },
  ];

  hints.forEach(({ rel, href, crossorigin }) => {
    /* Skip if an identical hint already exists */
    if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel  = rel;
    link.href = href;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
})();

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

  if (p.includes('/citizenship/apply'))  return 'page_apply';
  if (p.includes('/citizenship/status')) return 'page_status';
  if (p.includes('/citizenship'))        return 'page_citizenship';
  if (p.includes('/id/id-card'))         return 'page_id_card';
  if (p.includes('/id/registry'))        return 'page_registry';
  if ((p.includes('/gov') && p.endsWith('/gov/')) || p.endsWith('/gov')) return 'page_gov_home';
  if (p.includes('/isc'))                return 'page_isc';
  if (p.includes('/main'))               return 'page_main';
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

const isNewSession    = !sessionStorage.getItem(SESSION_KEY);
const isNewDailyVisit = !localStorage.getItem(DAILY_KEY);

if (isNewSession)    sessionStorage.setItem(SESSION_KEY, '1');
if (isNewDailyVisit) localStorage.setItem(DAILY_KEY, '1');

/* ─────────────────────────────────────────────
   PAGE VIEW TRACKING
───────────────────────────────────────────── */
async function flushPageView() {
  try {
    const counters = {};
    const daily    = {};

    if (isNewSession) {
      counters[PAGE]            = increment(1);
      counters.total_sessions   = increment(1);
    }

    if (isNewDailyVisit) {
      counters.total_unique_visitors = increment(1);
      daily.unique_visitors          = increment(1);
    }

    daily[`h${hour}`] = increment(1);
    daily[PAGE]       = increment(1);
    daily.total       = increment(1);

    const writes = [
      setDoc(doc(db, 'analytics', `daily_${today}`), daily, { merge: true })
    ];

    if (Object.keys(counters).length > 0) {
      writes.push(setDoc(doc(db, 'analytics', 'counters'), counters, { merge: true }));
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
      setDoc(doc(db, 'analytics', 'counters'),         { [eventName]: increment(1) }, { merge: true }),
      setDoc(doc(db, 'analytics', `daily_${today}`),   { [eventName]: increment(1) }, { merge: true }),
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

  let touched   = false;
  let submitted = false;

  form.addEventListener('focusin',  () => { touched = true; }, { once: true });
  form.addEventListener('submit',   () => { submitted = true; });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && touched && !submitted) {
      trackEvent('form_abandonments');
    }
  });
}

/* ─────────────────────────────────────────────
   [PERF-1] ANNOUNCEMENT BANNER — WITH SESSION CACHE
   Without caching, every page navigation triggers a full Firestore collection
   read (getDocs on 'announcements'). With a 5-minute sessionStorage cache the
   read fires at most once per 5 minutes per session regardless of how many
   pages the user visits.
───────────────────────────────────────────── */
const BANNER_CACHE_KEY = 'lol_banner_v1';
const BANNER_CACHE_TTL = 5 * 60 * 1000; /* 5 minutes in ms */

async function loadActiveBanner() {
  const banner = document.querySelector('.notice-banner');
  if (!banner) return;

  /* ── Try the sessionStorage cache first ── */
  try {
    const raw = sessionStorage.getItem(BANNER_CACHE_KEY);
    if (raw) {
      const { html, stamp } = JSON.parse(raw);
      if (Date.now() - stamp < BANNER_CACHE_TTL) {
        if (html) {
          banner.innerHTML = html;
        } else {
          banner.style.display = 'none';
        }
        return; /* Served from cache — no Firestore round-trip */
      }
    }
  } catch (_) {
    /* Corrupt cache entry — fall through to live fetch */
  }

  /* ── Live Firestore fetch ── */
  try {
    const snap = await getDocs(collection(db, 'announcements'));

    if (snap.empty) {
      banner.style.display = 'none';
      _writeBannerCache('');
      return;
    }

    const docs = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.active === true) docs.push(d);
    });

    if (!docs.length) {
      banner.style.display = 'none';
      _writeBannerCache('');
      return;
    }

    docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const items = docs.map((a) => {
      const type    = String(a.type || 'notice').toUpperCase();
      const body    = a.body || '';
      const linkHTML = a.link
        ? ` — <a href="${a.link}">${a.linkText || 'VIEW'} →</a>`
        : '';
      return `<div class="notice-item">
        <span class="tag">${type}</span>
        <span class="notice-text">${body}${linkHTML}</span>
      </div>`;
    });

    banner.innerHTML = items.join('');
    _writeBannerCache(banner.innerHTML);

  } catch (err) {
    console.error('[stats] Banner load failed:', err);
    banner.style.display = 'none';
  }
}

/**
 * Write banner HTML + timestamp to sessionStorage.
 * Wrapped in try/catch to survive private-browsing or quota-exceeded errors.
 */
function _writeBannerCache(html) {
  try {
    sessionStorage.setItem(
      BANNER_CACHE_KEY,
      JSON.stringify({ html, stamp: Date.now() })
    );
  } catch (_) { /* storage unavailable — degrade gracefully */ }
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
