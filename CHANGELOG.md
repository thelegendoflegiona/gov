# Changelog

## Unreleased

- Expanded project README with /isc/ file map, Discord webhook note, pAIz CDN
  reference, GitHub repo URL, and ISC maintenance note.
- Added Discord webhook and serviceAccountKey security rules to SECURITY.md.
- Added ISC portal section to SECURITY.md.
- Added canonical topbar/footer design system spec to MAINTENANCE.md.
- Added ISC portal section to MAINTENANCE.md.
- Added stats.js placement rule and loadActiveBanner open bug to MAINTENANCE.md.
- Added pAIz chatbot update workflow to MAINTENANCE.md.
- Trimmed .gitignore to plain HTML/CSS/JS project; added serviceAccountKey rule.

---

## 2026-06

### Design system consistency audit (June 2026)

- Audited and corrected topbar/footer link structures across all portal pages
  (gov, citizenship, ID, finance, 404) to conform to canonical six-link topbar
  and three-column footer standards.
- Corrected broken nav link: `/gov/systems/id/id/id-card` →
  `/gov/systems/id/id-card`.
- Migrated `finance/index.html` from Paiz Corp green colour scheme to the gov
  portal gold design system.

---

## 2026-05

### Government portal (May 2026)

- Rebuilt `stats.js` from scratch: auto-detects page from URL, deduplicates
  views via `sessionStorage`/`localStorage`, tracks unique daily visitors and
  hourly buckets (h0–h23).
- Fixed critical bug: `stats.js` script tag must be at bottom of `<body>` to
  avoid Firebase initialization conflicts.
- Migrated `apply.html` and `status.html` from static `status.json` to live
  Firestore reads/writes (`applications/{ref}` collection).
- Added IGN duplicate checker to `apply.html`: queries `citizens` collection,
  blocks submission for active/suspended citizens with ID card/renewal links,
  shows dismissible warning for revoked records.

### Admin dashboard (May 2026)

- Built unified Admin Console at `/gov/systems/dashboard/index.html`.
- Features: citizenship application review, NIS ID issuance, citizen records,
  announcements manager, activity log, analytics.
- Added Discord webhook integration with per-event toggles stored in
  `sessionStorage`.
- Added hourly traffic SVG bar chart from Firestore `analytics/daily_YYYY-MM-DD`
  documents.
- Added conversion funnel visualization, bulk application actions, CSV export,
  ID card iframe preview, and citizen change history log.
- Implemented Firebase Auth (`signInWithEmailAndPassword` / `onAuthStateChanged`)
  as the authentication layer.
- Known open bug: announcements created in the manager do not surface on public
  gov pages because `loadActiveBanner()` is not wired into public page scripts.

### ISC portal redesign (May 2026)

- Redesigned ISC section as a classified intelligence terminal: dark terminal
  style, gold `#c6a664` accent, Teko + Fira Code fonts, scanline overlays,
  viewport frame border, staggered animations, live MYT clock.
- Consolidated four pages (index, intel, national, search) under a unified
  `/isc/assets/` directory with a single `style.css`.
- Replaced hardcoded passcode auth with Firebase email/password authentication.
- Integrated citizen registry as a read-only intelligence panel with search,
  status/tier filters, and clearance level mapping
  (citizen → CL-1, senior → CL-2, elder → CL-3, founding → CL-F).

### pAIz chatbot (May 2026)

- Modular refactor to pAIz v5.2: logic separated into `paiz-engine.js` (IIFE
  exposed as `window.PaizEngine`) hosted on the Paiz Corp site.
- Other ecosystem sites import the shared knowledge base via CDN URL
  (`https://faizzzlol.github.io/PaizCorp/paiz-engine.js`) without duplicating
  code.

### Lore fact-checking (May 2026)

- Used WhatsApp chat exports as authoritative source to correct multiple site
  inaccuracies.
- Founding date corrected to 24 Dec 2021 (not 2023).
- TLIO establishment confirmed 8 Nov 2023; ISC rename confirmed 2 Mar 2026.
- TLCC attack method corrected to TNT (not bombing).
- "The Sus" clarified as a 2020 Neverland-era predecessor, not the original
  The LoL group name.
- History page heading corrected from "From Sus Squad to ISC" to
  "From TLIO to ISC".

---

## 2026-03

- ISC intelligence body renamed from TLIO (The Legend Intelligence Operations)
  to ISC (Internal Security Control) on 2 March 2026.

---

## 2023-11

- UltraX2020 resigned and returned power to Faiz4224. Rebuilding period began
  (Nov 2023).
- TLIO established 8 Nov 2023.

---

## 2023-05

- First national election held 6 May 2023. UltraX2020 (PHRTL) won.
- During UltraX2020 era: The LoL City sign was destroyed and the TLCC was
  attacked with TNT.

---

## 2021-12

- WhatsApp group created 24 December 2021 by Faiz4224, ItzDynozz, and
  Imii Kun under the name "The Sus".
- Group later renamed to The Legend of Legiona (The LoL).
