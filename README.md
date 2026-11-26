# Zan Plan Academy (ZPA) — website

A responsive, static education website for **Zan Plan Academy (ZPA)**.

- Motto: **The future is bright**
- Admission focus: **2026/2027 Form Five Admission**
- Location: **Fuoni Migombani, P.O. Box 35**

The layout follows the section flow of the supplied reference recording while using the ZPA crest, student photography and an original warm cream / brown / gold visual system.

## Resume / project status

See [PROJECT-STATUS.md](PROJECT-STATUS.md) for the current state, what is finished, what remains (Netlify admin activation) and a ready-to-paste resume message.

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
assets/content.js          Loads editable JSON from content/ and renders the lists
content/*.json             Editable site content (managed by the admin panel)
admin/                     Decap CMS admin panel (index.html + config.yml)
netlify.toml               Netlify publish directory and admin headers
assets/images/zpa-logo.png ZPA circular crest (transparent)
assets/images/students-hero.jpg / students-academic.jpg
assets/images/gallery-*.jpg  Gallery photos (students, classrooms, laboratories, teachers, campus)
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
- Campus gallery between News and Admissions, with category filters, hover zoom and a full-screen lightbox (next/previous, keyboard arrows)
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

The live details are used throughout the site:

- Phone / WhatsApp: **+255 655 802 650** (`tel:+255655802650`, `https://wa.me/255655802650`)
- Email: **zanplan26@gmail.com**
- Instagram: **https://www.instagram.com/zan_plan_academy/**

The admission enquiry form uses `ADMISSIONS_EMAIL` near the bottom of `assets/app.js` (set to `zanplan26@gmail.com`). It opens the visitor's email app; connect a real backend if you want the form to submit server-side.

If the phone number or email changes, update it in the contact cards and footer in `index.html`, plus `ADMISSIONS_EMAIL` in `assets/app.js`.

### Developer credit

The footer includes a **Web Developer** column alongside Explore, Admissions and Find us:

- Email: **ahmedomarali03@gmail.com**
- Phone / WhatsApp: **+255 774 031 316** (`tel:+255774031316`, `https://wa.me/255774031316`)

Update the `.footer-developer` column in `index.html` if these details change. The WhatsApp link includes a ready-to-send message. On tablets the footer switches to two columns and on very small phones (360px and below) the columns stack.

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
- `gallery-students-group.jpg`, `gallery-classroom.jpg`, `gallery-campus-sign.jpg`, `gallery-science-books.jpg`, `gallery-physics-practical.jpg`, `gallery-computer-lab.jpg`, `gallery-faculty.jpg`, `gallery-study.jpg` and `gallery-physics-students.jpg` for the gallery tiles
- `favicon.png` for the browser icon

Keep the same file names to avoid changing the HTML.

### Gallery

The gallery sits between **News** and **Admissions** (`#gallery`). Each photo is a `<button class="gallery-card">` in `#gallery-grid` with:

- `data-gallery-category` — `Campus`, `Academics` or `Student Life`; used by the filter pills
- `data-gallery-src` — the full image opened in the lightbox
- `data-gallery-title` and `data-gallery-caption` — the lightbox heading and description
- an `<img>` thumbnail plus a `.gallery-gradient` overlay and `.gallery-text` caption

The filter buttons live in `.gallery-filters` (`data-gallery-filter`). To add a category, add a button and matching `data-gallery-category` values.

The grid is three columns on desktop and two on phones. When "All" is active on phones, the first photo becomes a wide feature tile so the rows fill evenly; filtered views show normal cards.

The lightbox is full-screen and supports **next/previous buttons, ← → keys, Escape to close** and a photo counter.

### Admission dialog

The admission requirements and steps are in `#admissions-dialog` in `index.html`. The dialog is opened by every element with `data-open-admissions`.

## Notes

- The form currently uses a `mailto:` fallback so the site works without a server. It is not a stored application form yet.
- Social links point to the official Instagram profile and WhatsApp number.
- The stats, testimonials and faculty profiles are presentational placeholders and should be replaced with verified ZPA information.
- No tracking, analytics or external scripts are included.

## Admin panel (content editing)

The site has a ready-to-activate **Decap CMS** admin panel at `/admin`. Content is stored as JSON in `content/` and rendered by `assets/content.js`, so changes made in the admin appear without editing code.

Editable sections:

- **Contact & admissions** — phone, WhatsApp, email, Instagram, address, hours, requirements and application steps
- **Form Five combinations** — PCM, PCB, CBG, PGM and any new ones
- **Campus gallery** — upload photos, set titles, captions and categories
- **News & announcements** — add or edit updates
- **Faculty & mentors** — names, subjects and descriptions
- **Testimonials** — quotes, names and roles

### Activate the admin (one-time setup, ~10 minutes)

The admin uses Netlify Identity, so it must be hosted on Netlify (the site still deploys from the same GitHub repository and GitHub Pages keeps working too).

1. Create a free account at [netlify.com](https://www.netlify.com) and choose **Add new site → Import an existing project**.
2. Connect GitHub and select `ahmed-git1212/zan_plan_academy`.
3. Build command: leave empty. Publish directory: `.` (already set in `netlify.toml`).
4. After the first deploy, open **Site configuration → Identity** and click **Enable Identity**.
5. Under **Identity → Services**, enable **Git Gateway**.
6. Under **Identity → Registration**, choose **Invite only**, then **Invite users** and enter the admin's email address.
7. The admin accepts the email invite, sets a password, and signs in at `https://<your-site>.netlify.app/admin/`.

Saving in the admin commits to the `main` branch; Netlify and GitHub Pages redeploy automatically.

> The `/admin` page only works on the Netlify URL. Opening it on the GitHub Pages domain will show the login screen but cannot authenticate. Update `site_url` / `display_url` in `admin/config.yml` if you later use a custom domain.

If Netlify Identity is unavailable in your region or account, the alternative is Decap's GitHub backend with an OAuth proxy — the content files and admin collections stay the same.

### Editing content manually

You can still edit the JSON files in `content/` directly. Each section keeps the same shape the admin writes, and `assets/content.js` renders it into the page. Uploaded images go to `assets/images/uploads/`.

## Deploy

Upload the whole folder to any static host (Netlify, Vercel static, GitHub Pages, cPanel, etc.). Keep the `assets/` directory alongside `index.html`.
