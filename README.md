# Zan Plan Academy (ZPA) — website

A responsive, static education website for **Zan Plan Academy (ZPA)**.

- Motto: **The future is bright**
- Admission focus: **2026/2027 Form Five Admission**
- Location: **Fuoni Migombani, P.O. Box 35**

The layout follows the section flow of the supplied reference recording while using the ZPA crest, student photography and an original warm cream / brown / gold visual system.

## Run locally

No build step or dependencies are required.

```bash
cd /home/calyx/Desktop/zan-plan-academy
python3 -m http.server 8890
```

Open http://localhost:8890.

You can also open `index.html` directly, though a local server is recommended for the cleanest browser behaviour.

## Structure

```
index.html                 All sections, navigation and dialogs
assets/styles.css          Design tokens, layout, components and responsive rules
assets/app.js              Mobile menu, search/filter, dialogs and scroll behaviour
assets/images/zpa-logo.png ZPA circular crest (transparent)
assets/images/students-hero.jpg / students-academic.jpg
assets/images/gallery-*.jpg  Gallery photos (duo, books, female, male, crest)
assets/images/favicon.png
assets/fonts/              Poppins body font
```

## What is included

- Sticky header with Home, About, Academics, Form Five, Admissions, News, Gallery and Contact navigation
- Mobile off-canvas menu with keyboard/Escape support
- Hero with the 2026/2027 Form Five message, interactive subject search, student photo and programme badge
- Animated stats bar
- Four core pillars
- About ZPA split section with Fuoni Migombani location card
- Four Form Five combinations (PCM, PCB, CBG, PGM) with live search and combination-detail dialogs
- Campus/learning banner
- Faculty/mentor cards
- Student and parent testimonials
- News/announcement cards with update dialogs
- Campus gallery between News and Admissions, with a photo lightbox
- Admissions CTA and admission-information dialog
- Contact cards and complete footer
- Print-friendly, reduced-motion-friendly and keyboard-accessible interactions
- Fully responsive from 320px phones up to wide desktops: single-column card stacks, collapsible navigation, wrapped toolbar controls and scaled type at small widths

## Customise the content

### Colours and typography

Edit the CSS variables at the top of `assets/styles.css`:

```css
:root {
  --brown: #4b2d17;
  --gold: #b9822e;
  --cream: #fbf4e7;
  --ivory: #fffdf8;
  ...
}
```

Poppins is loaded locally from `assets/fonts/`. The display serif is the system Georgia stack.

### Phone, email and social links

Search for these placeholders in `index.html`:

- `+255 777 000 000`
- `admissions@zanplan.ac.tz`
- `info@zanplan.ac.tz`
- `href="#"` in the footer social links

The admission enquiry form also uses `ADMISSIONS_EMAIL` near the bottom of `assets/app.js`. It opens the visitor's email app; connect a real backend if you want the form to submit server-side.

### Faculty, testimonials and news

Replace the names, roles, quotes, dates and text directly in `index.html`. The faculty avatars currently use initials and CSS gradients; swap in `<img>` elements when staff photographs are available.

### Combination cards

The `#program-grid` currently lists the four available Form Five combinations — **PCM**, **PCB**, **CBG** and **PGM**. Each card carries:

- `data-category` — kept for future filtering
- `data-keywords` — extra search terms (codes, subjects, careers)
- `data-title`, `data-description`, `data-details`, `data-careers`, `data-combination` — used by the combination dialog

Duplicate a card to add another combination. Update the number in `#program-count` (currently `4`) if you want the starting figure to match; the search script recalculates it whenever a search is active.

### Images

The supplied ZPA crest and student photographs are in `assets/images/`. The crest has been masked to a transparent circle. Replace:

- `zpa-logo.png` for the crest
- `students-hero.jpg` for the hero photo. On phones (760px and below) this image is also used as the hero background behind the headline, so the students are visible without scrolling; at wider sizes it shows inside the framed hero card.
- `students-academic.jpg` for the About and campus sections
- `gallery-duo.jpg`, `gallery-books.jpg`, `gallery-female.jpg`, `gallery-male.jpg` for the gallery tiles
- `gallery-crest.jpg` for the close-up crest image (available if you want to add a fifth tile)
- `favicon.png` for the browser icon

Keep the same file names to avoid changing the HTML.

### Gallery

The gallery sits between **News** and **Admissions** (`#gallery`). Each tile is a `<button>` in `.gallery-grid` with:

- an `<img>` for the thumbnail
- `data-gallery-src` — the photo opened in the lightbox
- `data-gallery-title` and `data-gallery-caption` — the lightbox heading and description

The first tile spans two columns and two rows; the second spans two columns. To add a photo, duplicate a tile and keep the same pattern (the grid flows into further rows automatically).

### Admission dialog

The admission requirements and steps are in `#admissions-dialog` in `index.html`. The dialog is opened by every element with `data-open-admissions`.

## Notes

- The form currently uses a `mailto:` fallback so the site works without a server. It is not a stored application form yet.
- Social links are placeholders (`href="#"`).
- The stats, testimonials and faculty profiles are presentational placeholders and should be replaced with verified ZPA information.
- No tracking, analytics or external scripts are included.

## Planned: admin page

A future admin area should let the academy team update the site **without editing code**. Planned areas:

- Add, edit or hide Form Five combinations (currently PCM, PCB, CBG and PGM)
- Update admission requirements, dates and contact details
- Publish news items and announcements
- Edit faculty profiles and testimonials
- Choose which images appear in the hero and About sections

Until that exists, content changes are made directly in `index.html` and `assets/app.js` as described above.

## Deploy

Upload the whole folder to any static host (Netlify, Vercel static, GitHub Pages, cPanel, etc.). Keep the `assets/` directory alongside `index.html`.
