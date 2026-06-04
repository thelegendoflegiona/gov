# Security Notes

This project is a static frontend with Firebase-backed dynamic features. Do not
rely on hidden buttons, hidden pages, or frontend checks for security. Anything
shipped to the browser can be read by users.

## Public vs Private

Public-safe data:

- Published announcements
- Public legal archive metadata
- Public citizen ID verification fields
- Public application status fields intended for applicants

Private or admin-only data:

- Applicant contact details
- Admin notes
- Internal review reasons
- Dashboard analytics controls
- Citizen status mutation controls
- Announcement create/edit/delete controls
- ISC intelligence records and clearance level data
- ISC group chat content (restricted to Faiz4224, ItzDynozz, Imii Kun, Ikan)

## Firebase Checklist

Before deploying dashboard or application changes, confirm Firestore rules:

- Only authenticated admins can write `citizens`.
- Only authenticated admins can update application status, notes, or issued IDs.
- Public users can create application submissions only with allowed fields.
- Public users cannot write analytics counters in a way that can damage data.
- Public users cannot read private contact fields or admin notes.
- Admin access should use Firebase custom claims or a strict allowlist.
- The ISC portal uses a separate Firebase email/password auth surface. Apply
  the same Firestore rule coverage to ISC-accessible collections as to the
  main dashboard. Confirm ISC users cannot write to citizen or application
  records unless explicitly permitted.

## Frontend Rules

- Do not store secrets in HTML, CSS, JS, or JSON files.
- Firebase web config is allowed in frontend code, but rules must be locked
  down on the Firestore side.
- Do not publish files containing `admin_note`, contact details, test records,
  or moderation notes unless they are intentionally public.
- Use `rel="noopener noreferrer"` on external links opened with
  `target="_blank"`.
- Avoid rendering untrusted Firestore text with `innerHTML`; prefer
  `textContent` unless the source is trusted and sanitized.
- **Discord webhook URLs are sensitive.** A leaked webhook allows anyone to
  post to the connected channel without authentication. Webhook URLs must
  never be stored in source files, hardcoded in any page script, or committed
  to the repository. Store them in `sessionStorage` at runtime only and clear
  them on session end.
- **Never commit `serviceAccountKey.json`** or any Firebase Admin SDK
  credential file. If one is ever generated locally, add it to `.gitignore`
  immediately before touching anything else. If it is accidentally committed,
  follow the Incident Response steps below.

## Admin Dashboard

The dashboard should be treated as a control panel, not just another page.

Recommended safeguards:

- Require Firebase Auth before reading or writing admin collections.
- Validate admin role server-side with Firestore rules.
- Log every status change, ID issuance, suspension, revocation, and
  announcement change.
- Keep destructive actions behind confirmation prompts.
- Keep an export or backup workflow for important records.

## ISC Portal

The ISC portal (`/isc/`) is a classified intelligence surface, separate from
the main government portal and its dashboard.

- ISC content must not be accessible to unauthenticated users. Firebase Auth
  (email/password) gates the portal independently of the main dashboard.
- ISC group chat content is classified and must not appear on any public page.
  Access is restricted to Faiz4224, ItzDynozz, Imii Kun, and Ikan (ikanuwu).
- The citizen registry inside the ISC portal is read-only. Clearance level
  mapping (citizen → CL-1, senior → CL-2, elder → CL-3, founding → CL-F)
  must not be writable by ISC portal users.
- Assets live in `/isc/assets/` and must not be mixed with gov assets.

## Incident Response

If private data is accidentally published:

1. Remove the file or data from the live site immediately.
2. Rotate any affected service credentials — Firebase keys, Discord webhook
   URLs, and Formspree endpoint IDs.
3. Review Firebase rules and access logs.
4. Remove sensitive data from repository history using `git filter-branch` or
   BFG Repo-Cleaner if needed.
5. Publish a clean replacement commit.
