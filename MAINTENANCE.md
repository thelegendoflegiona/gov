# Maintenance Guide

This guide is for future edits to the government portal.

## Before Editing

1. Confirm the canonical GitHub repository and deployment domain.
2. Work from the repository, not a random exported copy.
3. Preview locally from `C:\` so `/gov/...` paths resolve correctly.
4. Keep a backup before large visual or data changes.

## Local Preview

```powershell
cd C:\
python -m http.server 8000
```

Open:

```text
http://localhost:8000/gov/
```

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

### Update Citizenship Flow

Check all related pages:

- `systems/citizenship/index.html`
- `systems/citizenship/apply.html`
- `systems/citizenship/status.html`
- `systems/dashboard/index.html`
- `systems/id/registry.html`
- `systems/id/id-card.html`

Any change to application fields should be mirrored in Firestore rules and the
dashboard review UI.

### Update Firebase Behavior

1. Review `SECURITY.md`.
2. Confirm Firestore rules before publishing.
3. Test public pages logged out.
4. Test dashboard pages logged in as an admin.
5. Confirm unauthorized users cannot write admin collections.

## Quality Checklist

- Main pages load through `/gov/`.
- Images load and have useful alt text.
- External links still work.
- Mobile nav opens and closes.
- Firebase features fail gracefully if offline.
- No private data is shipped in JSON or static files.
- README and this guide still match the project.
