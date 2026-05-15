import { setDoc, doc, increment } from "https://...firebase-firestore.js";
// Then call: await trackPageView(db, 'page_apply'); // or page_status, page_id_card, page_registry, page_citizenship
// And on events: await trackEvent(db, 'status_checks'); // or app_submissions, id_card_lookups, id_card_downloads, id_card_prints, registry_searches

async function trackPageView(db, page) {
  if (sessionStorage.getItem('t_'+page)) return;
  sessionStorage.setItem('t_'+page, '1');
  try { await setDoc(doc(db,'analytics','counters'), {[page]:increment(1),total_sessions:increment(1)},{merge:true}); } catch{}
}
async function trackEvent(db, evt) {
  try { await setDoc(doc(db,'analytics','counters'), {[evt]:increment(1)},{merge:true}); } catch{}
}
