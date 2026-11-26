# ZPA Website — Project Status & Resume Guide

Last updated: 26 Nov 2026 · Branch `main` · Commit `e666f15` (or later)

## Live links

| What | URL |
|---|---|
| Public site (GitHub Pages) | https://ahmed-git1212.github.io/zan_plan_academy/ |
| GitHub repository | https://github.com/ahmed-git1212/zan_plan_academy |
| Admin panel (needs Netlify setup) | https://<your-site>.netlify.app/admin/ |

Local preview:

```bash
cd /home/calyx/Desktop/zan-plan-academy
python3 -m http.server 8890
# open http://localhost:8890
```

Local preview must be a server (not `file://`) because the page loads JSON content.

## What is finished

- Responsive single-page site (320px → 1440px, no horizontal overflow)
- Hero, stats, pillars, About, Form Five combinations, campus banner, faculty, testimonials, news, gallery, admissions CTA, contact and footer
- Form Five combinations limited to PCM, PCB, CBG, PGM
- Mobile hero uses the student photo as a background
- Real contact details: +255 655 802 650 (call + WhatsApp), zanplan26@gmail.com, Instagram
- Campus gallery with 9 real photos, category filters (All / Campus / Academics / Student Life), hover effects and a full-screen lightbox (arrows, keyboard, counter)
- Footer "Web Developer" column with email, phone and WhatsApp (no personal name shown)
- **Decap CMS admin built** at `/admin` with editable JSON content in `content/`

## Admin status — ACTION REQUIRED

The admin files are built and pushed, but login is **not active yet** because it needs the Netlify account owner (you) to finish setup:

1. Create a free site at [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project** → GitHub → `ahmed-git1212/zan_plan_academy`
2. Build command: **empty** · Publish directory: **`.`**
3. **Site configuration → Identity → Enable Identity**
4. **Identity → Services → Git Gateway → Enable**
5. **Identity → Registration → Invite only** → **Invite users** → school admin email
6. Admin accepts the email, sets a password
7. Log in at `https://<your-site>.netlify.app/admin/`

After that, editing in `/admin` commits to GitHub and both Netlify and GitHub Pages update automatically.

Note: `/admin` will not authenticate on the GitHub Pages domain — it needs the Netlify URL.

## Editable content map

| File | Admin section |
|---|---|
| `content/settings.json` | Contact & admissions (phone, WhatsApp, email, Instagram, address, hours, requirements, steps, developer contacts) |
| `content/combinations.json` | Form Five combinations |
| `content/gallery.json` | Campus gallery photos and captions |
| `content/news.json` | News & announcements |
| `content/faculty.json` | Faculty & mentors |
| `content/testimonials.json` | Testimonials |

Rendered by `assets/content.js`; `assets/app.js` loads afterwards for menu, search, dialogs and gallery interactions.

Uploaded photos go to `assets/images/uploads/`.

## Key files

```
index.html                 Page markup and section shells
assets/styles.css          All styling and responsive rules
assets/app.js              Menu, search/filter, dialogs, gallery lightbox
assets/content.js          Loads content/*.json and renders the editable lists
content/*.json             Editable content
admin/index.html           Decap CMS entry point
admin/config.yml           CMS collections and fields
netlify.toml               Publish directory + noindex for /admin
robots.txt                 Blocks /admin from search engines
```

## Verified before pausing

- 4 combinations, 9 gallery photos, 3 news items, 4 faculty, 3 testimonials render from JSON
- Gallery filters, lightbox arrows/keyboard, combination dialogs and hero search work
- Contact details and admission lists come from `settings.json`
- No console errors, no broken requests, no horizontal overflow at 320–1440px

## Next actions when you resume

1. Finish the Netlify setup above.
2. Send the Netlify site URL so `site_url` / `display_url` in `admin/config.yml` can be updated (optional).
3. Invite the school admin and test one edit (e.g. change a news title) end to end.
4. Optional next features:
   - Custom domain (e.g. `zanplan.ac.tz`)
   - Make the hero/About images editable too
   - Publish the second phone number shown on the signboard (+255 776 020 161)
   - Replace placeholder faculty, testimonials and news with verified information

## Resume message (paste this when starting again)

> Continue the Zan Plan Academy website project at /home/calyx/Desktop/zan-plan-academy. Read PROJECT-STATUS.md first. The public site is live on GitHub Pages and the Decap CMS admin is built; the remaining step is the Netlify Identity + Git Gateway setup, then testing an admin edit.
