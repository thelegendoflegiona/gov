# The LoL Government Website

Static source for the public government portal of The Legend of Legiona
(The LoL). The site includes the government home page, Malay translation,
legal archive, citizenship application/status pages, national ID pages,
currency converter, admin dashboard, and shared analytics/banner support.

## Local Preview

The site uses absolute `/gov/...` paths, so serve it from one folder above
`gov`.

```powershell
cd C:\
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/gov/
```

Opening `C:\gov\index.html` directly can work for some static content, but
absolute paths and module scripts are more reliable through a local server.

## File Map

```text
/
  index.html                         Main government landing page
  ms-my.html                         Malay version of the landing page
  404.html                           Custom not-found page
  about/                             Portal explanation and pAIz widget
  assets/                            Shared CSS, images, analytics scripts
  finance/                           TL$ currency converter
  systems/archives/                  Legal archive
  systems/citizenship/               Citizenship info, apply, status pages
  systems/dashboard/                 Firebase-backed admin console
  systems/id/                        National ID portal, registry, card
```

## External Services

This is a static site, but some features depend on external services:

- Firebase Firestore for applications, citizens, announcements, and analytics.
- Firebase Auth for the admin dashboard.
- Formspree for citizenship application email capture.
- Google Drive for legal document hosting.
- External CDNs for fonts, Firebase SDK modules, and selected page assets.

The Firebase web config in frontend files is not a password by itself. The real
security boundary is Firebase Auth plus Firestore security rules. See
`SECURITY.md` before changing dashboard or database behavior.

## Maintenance Notes

- Keep public pages static whenever possible.
- Treat the dashboard as an admin-only surface.
- Keep Google Drive legal document links current with the Legal Archive.
- When adding a new public page, update navigation, footer links, and any
deployment sitemap/redirect rules.
- Prefer shared CSS and small shared JS modules for repeated navigation,
footer, analytics, or banner behavior.

## Publishing

This folder is not currently a local git checkout. To publish changes, connect
it to the canonical GitHub repository or copy these files into the repo used by
the live deployment.

Recommended GitHub Pages preview command after cloning the real repository:

```powershell
cd C:\
python -m http.server 8000
```

Then test the same `/gov/` route before pushing.
