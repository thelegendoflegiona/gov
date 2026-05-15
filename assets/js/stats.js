/**
 * stats.js — The Legend of Legiona Analytics
 * Drop-in module. No config needed per-page.
 * Place at bottom of <body> on every page:
 *   <script type="module" src="/gov/assets/js/stats.js"></script>
 *
 * From other scripts, call:
 *   window.statsTrackEvent('event_name')
 */

import { initializeApp, getApps }    from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getFirestore, doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ─────────────────────────────────────────────
   CONFIG — reuses existing Firebase app if
   another script on the page already init'd it
───────────────────────────────────────────── */
const FB_CONFIG = {
  apiKey:            "AIzaSyAgrLJDO8F6yyVLFubiZdRGiEl5ICRSAdQ",
  authDomain:        "the-legend-of-legiona-the-lol.firebaseapp.com",
  projectId:         "the-legend-of-legiona-the-lol",
  storageBucket:     "the-legend-of-legiona-the-lol.firebasestorage.app",
  messagingSenderId: "29247096448",
  appId:             "1:29247096448:web:370f536ad630c088b94865",
};

const _app = getApps().length ? getApps()[0] : initializeApp(FB_CONFIG);
const db   = getFirestore(_app);

/* ─────────────────────────────────────────────
   PAGE DETECTION — auto from URL, no HTML edits
───────────────────────────────────────────── */
function detectPage() {
  const p = location.pathname;
  if (p.includes('/citizenship/apply'))  return 'page_apply';
  if (p.includes('/citizenship/status')) return 'page_status';
  if (p.includes('/citizenship'))        return 'page_citizenship';
  if (p.includes('/id/id-card'))         return 'page_id_card';
  if (p.includes('/id/registry'))        return 'page_registry';
  if (p.includes('/gov') && p.endsWith('/gov/') || p.endsWith('/gov')) return 'page_gov_home';
  if (p.includes('/isc'))                return 'page_isc';
  if (p.includes('/main'))               return 'page_main';
  return 'page_other';
}

const PAGE  = detectPage();
const today = new Date().toISOString().split('T')[0]; // "2026-05-15"
const hour  = new Date().getHours();                   // 0–23

/* ─────────────────────────────────────────────
   DEDUPLICATION
   - isNewSession    → first time on this page this browser session
   - isNewDailyVisit → first visit anywhere on the site today
───────────────────────────────────────────── */
const isNewSession    = !sessionStorage.getItem('lol_s_' + PAGE);
const isNewDailyVisit = !localStorage.getItem('lol_uv_' + today);

if (isNewSession)    sessionStorage.setItem('lol_s_' + PAGE, '1');
if (isNewDailyVisit) localStorage.setItem('lol_uv_' + today, '1');

/* ─────────────────────────────────────────────
   FLUSH PAGE VIEW
   Writes to two Firestore docs:
   analytics/counters   — all-time totals
   analytics/daily_YYYY-MM-DD — daily breakdown with hourly traffic
───────────────────────────────────────────── */
async function flushPageView() {
  try {
    const counters = {};
    if (isNewSession) {
      counters[PAGE]            = increment(1);
      counters['total_sessions'] = increment(1);
    }
    if (isNewDailyVisit) {
      counters['total_unique_visitors'] = increment(1);
    }

    // Daily doc: hourly buckets h0–h23 + per-page hits
    const daily = {
      [`h${hour}`]: increment(1),   // e.g. h14: N — for hourly traffic chart
      [PAGE]:       increment(1),   // page hits today
      'total':      increment(1),   // all hits today
    };
    if (isNewDailyVisit) daily['unique_visitors'] = increment(1);

    const writes = [
      setDoc(doc(db, 'analytics', `daily_${today}`), daily, { merge: true }),
    ];
    if (Object.keys(counters).length) {
      writes.push(setDoc(doc(db, 'analytics', 'counters'), counters, { merge: true }));
    }
    await Promise.all(writes);
  } catch (_) { /* silent — never break the page */ }
}

/* ─────────────────────────────────────────────
   PUBLIC EVENT TRACKER
   Call from any page script:
     window.statsTrackEvent('app_submissions')
     window.statsTrackEvent('status_result_approved')
     window.statsTrackEvent('ign_check_hits')
     etc.
───────────────────────────────────────────── */
async function trackEvent(evt) {
  if (!evt) return;
  try {
    await Promise.all([
      setDoc(doc(db, 'analytics', 'counters'),       { [evt]: increment(1) }, { merge: true }),
      setDoc(doc(db, 'analytics', `daily_${today}`), { [evt]: increment(1) }, { merge: true }),
    ]);
  } catch (_) { /* silent */ }
}

/* ─────────────────────────────────────────────
   FORM ABANDONMENT (apply page only)
   Fires if user touches any field but doesn't submit.
   Uses visibilitychange — more reliable than beforeunload
   for async Firestore writes.
───────────────────────────────────────────── */
function setupAbandonTracking() {
  const form = document.getElementById('citizenForm');
  if (!form) return;

  let touched   = false;
  let submitted = false;

  form.addEventListener('focusin', () => { touched = true; }, { once: true });
  form.addEventListener('submit',  () => { submitted = true; });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && touched && !submitted) {
      trackEvent('form_abandonments');
    }
  });
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.statsTrackEvent = trackEvent;

flushPageView();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAbandonTracking);
} else {
  setupAbandonTracking();
}
