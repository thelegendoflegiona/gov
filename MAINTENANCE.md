# Maintenance Guide

This guide is for future edits to the government and ISC portals.

## Before Editing

1. Confirm the canonical GitHub repository and deployment domain.
2. Work from the repository, not a random exported copy.
3. Preview locally from `C:\` so `/gov/...` and `/isc/...` paths resolve
   correctly.
4. Keep a backup before large visual or data changes.

## Local Preview

```powershell
cd C:\
python -m http.server 8000
```

Open:

```text
http://localhost:8000/gov/
http://localhost:8000/isc/
```

---

## Canonical Design System

All portal pages must conform to these standards before publishing. Do not
deviate without updating this document.

### Topbar — six links in fixed order

| Position | Label | Path |
|----------|-------|------|
| 1 | HUB | /main/ |
| 2 | GOVERNMENT | /gov/ |
| 3 | CITIZENSHIP | /gov/systems/citizenship/ |
| 4 | IDENTITY CARD | /gov/systems/id/ |
| 5 | ARCHIVES | /gov/systems/archives/ |
| 6 | ISC | /isc/ |

All links omit `.html`. Do not add, remove, or reorder links without updating
every page that uses the topbar.

### Footer — three columns in fixed order

| Column | Label | Links |
|--------|-------|-------|
| 1 | Government | Absolute `/gov/#section` anchors for cross-page use; relative `#section` on `gov/index.html` only |
| 2 | Agencies | `/isc/`, `/isc/national/`, `/isc/search/` |
| 3 | Documents | `/gov/systems/id/`, `/gov/systems/archives/`, `/gov/about/` |

### Fonts

Playfair Display, DM Mono, Outfit — loaded via CDN. Do not substitute.

### Colours

Gold accent: `#C9A84C` (`var(--gold)`). Pure dark backgrounds. The ISC portal
uses its own gold `#c6a664` within the classified terminal aesthetic — do not
mix the two palettes across portals.

### Links

All internal links must omit `.html`. All external links opened with
`target="_blank"` must include `rel="noopener noreferrer"`.

### Disclaimer

Every page must include a disclaimer footer stating the site is not affiliated
with Kawaiisho, Mojang, Microsoft, or Minecraft.

### Naming rule BH-2026-0002

Always use "The Legend of Legiona" or "The LoL". Standalone "LoL" is strictly
prohibited on all public-facing content.

---

## Known Open Bugs

- **loadActiveBanner() not wired into public pages.** Announcements created
  through the admin dashboard announcement manager do not surface on public
  `/gov/` pages because `loadActiveBanner()` is not called in public page
  scripts. Fix: import and call `loadActiveBanner()` in the shared assets
  script included on each public page, or wire it directly into each page's
  inline script.

---

## Common Update Tasks

### Add A Legal Document

1. Add the document link or local file.
2. Add a card in `systems/archives/index.html`.
3. Include type, title, tags, date, language, and status.
4. Test search and filter behavior.
5. Update any related pAIz knowledge if needed.

### Add An Announcement

Use the dashboard announcement tools when possible. If editing static content,
keep the announcement short and make sure the link is valid.

Note: until the `loadActiveBanner()` bug is resolved, announcements created
in the dashboard manager will not appear on public pages automatically.

### Update Citizenship Flow

Check all related pages:

- `systems/citizenship/index.html`
- `systems/citizenship/apply.html`
- `systems/citizenship/status.html`
- `systems/dashboard/index.html`
- `systems/id/registry.html`
- `systems/id/id-card.html`

Any change to application fields must be mirrored in Firestore rules and the
dashboard review UI.

### Update Firebase Behavior

1. Review `SECURITY.md`.
2. Confirm Firestore rules before publishing.
3. Test public pages while logged out.
4. Test dashboard pages while logged in as an admin.
5. Confirm unauthorized users cannot write admin collections.

### Update stats.js

`stats.js` auto-detects the page from the URL. It deduplicates views via
`sessionStorage`/`localStorage` and tracks unique daily visitors and hourly
buckets (`h0`–`h23`).

**Critical placement rule:** the `<script>` tag for `stats.js` must be placed
at the bottom of `<body>`, after all other content. Placing it between
`</head>` and `<body>`, or at the top of `<body>`, causes Firebase
initialization conflicts and breaks tracking silently.

### Update ISC Portal

The ISC portal (`/isc/`) uses a unified asset directory at `/isc/assets/`
containing a single `style.css` and shared scripts for all four ISC pages
(index, intel, national, search).

Key behaviors to preserve when editing:

- Firebase email/password authentication gates the entire portal. Do not
  remove or bypass the `onAuthStateChanged` check on any ISC page.
- The citizen registry panel is read-only. ISC users must not be able to
  write to the `citizens` collection.
- Clearance level mapping: citizen → CL-1, senior → CL-2, elder → CL-3,
  founding → CL-F. Update this mapping only after confirming the change in
  the official citizen tier definitions.
- The ISC portal uses the classified terminal aesthetic: dark terminal style,
  gold `#c6a664`, Teko + Fira Code fonts, scanline overlays, viewport frame
  border, staggered animations, live MYT clock. Do not import gov portal
  styles into ISC pages.
- Do not publish ISC group chat content. It is classified and restricted to
  Faiz4224, ItzDynozz, Imii Kun, and Ikan (ikanuwu).

### Update pAIz Chatbot

The pAIz chatbot logic lives in `paiz-engine.js` on the Paiz Corp site:

```text
https://faizzzlol.github.io/PaizCorp/paiz-engine.js
```

Other sites import it via this CDN URL. Do not duplicate the knowledge base
locally. When updating chatbot knowledge, edit `paiz-engine.js` in the Paiz
Corp repository only — the change propagates to all sites on next load.

---

## Quality Checklist

- Main gov pages load through `/gov/`.
- ISC portal loads through `/isc/` and requires login.
- Images load and have useful alt text.
- External links still work and use `rel="noopener noreferrer"`.
- Mobile nav opens and closes on both portals.
- Firebase features fail gracefully if offline.
- No private data is shipped in JSON or static files.
- stats.js `<script>` tag is at the bottom of `<body>` on every page that
  uses it.
- Topbar has exactly six links in the canonical order on every gov page.
- Footer has exactly three columns in the canonical order on every gov page.
- All internal links omit `.html`.
- Disclaimer footer is present on every page.
- No standalone "LoL" usage — always "The LoL" or "The Legend of Legiona".
- README and this guide still match the project structure.
