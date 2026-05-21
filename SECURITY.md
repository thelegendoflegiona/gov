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

## Firebase Checklist

Before deploying dashboard or application changes, confirm Firestore rules:

- Only authenticated admins can write `citizens`.
- Only authenticated admins can update application status, notes, or issued IDs.
- Public users can create application submissions only with allowed fields.
- Public users cannot write analytics counters in a way that can damage data.
- Public users cannot read private contact fields or admin notes.
- Admin access should use Firebase custom claims or a strict allowlist.

## Frontend Rules

- Do not store secrets in HTML, CSS, JS, or JSON files.
- Firebase web config is allowed in frontend code, but rules must be locked down.
- Do not publish files containing `admin_note`, contact details, test records,
  or moderation notes unless they are intentionally public.
- Use `rel="noopener noreferrer"` on external links opened with `target="_blank"`.
- Avoid rendering untrusted Firestore text with `innerHTML`; prefer
  `textContent` unless the source is trusted and sanitized.

## Admin Dashboard

The dashboard should be treated as a control panel, not just another page.

Recommended safeguards:

- Require Firebase Auth before reading or writing admin collections.
- Validate admin role server-side with Firestore rules.
- Log every status change, ID issuance, suspension, revocation, and announcement
  change.
- Keep destructive actions behind confirmation prompts.
- Keep an export or backup workflow for important records.

## Incident Response

If private data is accidentally published:

1. Remove the file or data from the live site.
2. Rotate any affected service credentials.
3. Review Firebase rules and access logs.
4. Remove sensitive data from repository history if needed.
5. Publish a clean replacement commit.
