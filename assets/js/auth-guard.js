/**
 * auth-guard.js — shared RBAC gate for The Legend of Legiona admin surfaces
 * Used by both thelegendoflegiona/gov (admin dashboard) and thelegendoflegiona/isc (ISC portal)
 *
 * Matches the real Firestore schema: an account is an admin if a doc exists
 * at admins/{uid}. Existing admin docs have no `role` field and are treated
 * as 'super-admin' (full access) — nobody currently admin loses access by
 * adding this script. To scope someone down, set their admins/{uid} doc to
 * { role: "dept-admin" } or { role: "isc-officer" } via the Firebase Console.
 *
 * Same-origin deployment (gov and isc served from the same domain, different
 * paths/repos) means Firebase Auth's session is already shared between them —
 * no token exchange needed. This script just standardizes the role check.
 *
 * USAGE (on any page you want gated):
 *   <script type="module">
 *     import { requireRole } from "https://cdn.jsdelivr.net/gh/thelegendoflegiona/gov@main/assets/js/auth-guard.js";
 *     requireRole(["super-admin", "isc-officer"], { loginPath: "/gov/login/" });
 *   </script>
 *
 * Requires firebase-app already initialized on the page (same config both
 * portals already use) before this runs.
 */

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * Gate the current page behind Firebase auth + a role check against
 * the `admins/{uid}` Firestore doc. Matches adminRole() in firestore.rules:
 * missing `role` field defaults to 'super-admin'.
 *
 * @param {string[]} allowedRoles - roles permitted on this page, e.g. ["super-admin","isc-officer"]
 * @param {object} opts
 * @param {string} opts.loginPath - where to send unauthenticated users, with ?redirect= back here
 * @param {string} [opts.deniedPath] - where to send authenticated-but-wrong-role users (defaults to an inline message)
 * @param {(adminDoc: object) => void} [opts.onAuthorized] - callback once access is confirmed, receives the admin doc
 */
export function requireRole(allowedRoles, opts) {
  const { loginPath, deniedPath, onAuthorized } = opts;
  const auth = getAuth();
  const db = getFirestore();

  document.documentElement.setAttribute("data-auth-checking", "true");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    try {
      const adminSnap = await getDoc(doc(db, "admins", user.uid));

      if (!adminSnap.exists()) {
        denyAccess("This account is not registered as an admin.");
        return;
      }

      const adminData = adminSnap.data();
      const role = adminData.role || "super-admin"; // mirrors adminRole()'s default in firestore.rules

      if (!allowedRoles.includes(role)) {
        denyAccess(`Role "${role}" is not authorized for this portal.`);
        return;
      }

      document.documentElement.removeAttribute("data-auth-checking");
      if (typeof onAuthorized === "function") {
        onAuthorized({ ...adminData, role });
      }
    } catch (err) {
      console.error("auth-guard: admin lookup failed", err);
      denyAccess("Could not verify authorization. Try again.");
    }
  });

  function redirectToLogin() {
    const redirectBack = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `${loginPath}?redirect=${redirectBack}`;
  }

  function denyAccess(reason) {
    if (deniedPath) {
      window.location.href = deniedPath;
      return;
    }
    document.documentElement.removeAttribute("data-auth-checking");
    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;
                  font-family:sans-serif;text-align:center;padding:2rem;background:#0a0a0a;color:#eee;">
        <div>
          <h1 style="font-size:1.25rem;margin-bottom:0.5rem;">Access Denied</h1>
          <p style="opacity:0.7;">${reason}</p>
        </div>
      </div>`;
  }
}

/**
 * Convenience helper: fetch the current user's role without gating the page.
 * Useful for conditionally showing/hiding UI (e.g. "ISC" nav link only for
 * isc-officer/super-admin). Returns null if not signed in or not an admin.
 */
export async function getCurrentRole() {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  if (!user) return null;
  const adminSnap = await getDoc(doc(db, "admins", user.uid));
  if (!adminSnap.exists()) return null;
  return adminSnap.data().role || "super-admin";
}
