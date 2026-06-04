# The LoL Government Website

Static source for the public government portal of The Legend of Legiona
(The LoL). The site includes the government home page, Malay translation,
legal archive, citizenship application/status pages, national ID pages,
currency converter, admin dashboard, ISC intelligence portal, and shared
analytics/banner support.

## Local Preview

The site uses absolute `/gov/...` and `/isc/...` paths, so serve it from one
folder above both directories.

```powershell
cd C:\
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/gov/
http://localhost:8000/isc/
```

Opening files directly can work for some static content, but absolute paths
and module scripts are more reliable through a local server.

## File Map

```text
/
  gov/
    index.html                         Main government landing page
    ms-my.html                         Malay version of the landing page
    404.html                           Custom not-found page
    about/                             Portal explanation and pAIz widget
    assets/                            Shared CSS, images, stats.js, banner scripts
    finance/                           TL$ currency converter
    systems/archives/                  Legal archive
    systems/citizenship/               Citizenship info, apply, status pages
    systems/dashboard/                 Firebase-backed admin console
    systems/id/                        National ID portal, registry, card

  isc/
    index.html                         ISC portal landing (Firebase auth gated)
    intel/                             Intelligence panel
    national/                          National security section
    search/                            Citizen registry search (read-only)
    assets/                            Shared ISC CSS (style.css) and scripts

  main/                                Hub / navigation landing
```

## External Services

This is a static site, but some features depend on external services:

- Firebase Firestore for applications, citizens, announcements, and analytics.
- Firebase Auth for the admin dashboard and ISC portal (email/password).
- Formspree for citizenship application email capture.
- Google Drive for legal document hosting.
- Discord webhooks for admin event notifications — stored in `sessionStorage`
  at runtime only, never in source files or the repository.
- External CDNs for fonts, Firebase SDK modules, and selected page assets.
- pAIz chatbot engine hosted at
  `https://faizzzlol.github.io/PaizCorp/paiz-engine.js` and shared across
  the ecosystem via CDN import; do not duplicate the knowledge base locally.

The Firebase web config in frontend files is not a password by itself. The real
security boundary is Firebase Auth plus Firestore security rules. See
`SECURITY.md` before changing dashboard or database behavior.

## Maintenance Notes

- Keep public pages static whenever possible.
- Treat the dashboard as an admin-only surface.
- Treat the ISC portal as a classified surface — it is auth-gated separately
  from the main dashboard via Firebase email/password.
- Keep Google Drive legal document links current with the Legal Archive.
- When adding a new public page, update navigation, footer links, and any
  deployment sitemap/redirect rules.
- Prefer shared CSS and small shared JS modules for repeated navigation,
  footer, analytics, or banner behavior.
- The ISC portal uses its own asset directory (`/isc/assets/`). Do not mix
  ISC styles or scripts with gov assets.

## Publishing

The canonical repository is:

```text
https://github.com/faizzzlol/faizzzlol.github.io
```

The live site is served via GitHub Pages. To publish, commit to the canonical
repository and push. GitHub Pages will rebuild automatically.

Recommended local test command before committing:

```powershell
cd C:\
python -m http.server 8000
```

Test both `/gov/` and `/isc/` routes before pushing.
