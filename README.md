# The Wellness Advocate — Website

Marketing site for **The Wellness Advocate**, a cash-pay Direct Primary Care
(DPC) practice in Jacksonville, FL, also offering bioidentical hormone
replacement therapy (BHRT) and psychiatry. Provider: Aimee Roberts-Serrato,
MSN, APRN, PMHNP-BC, FNP-C. Built by Robinson Consulting Group.

Hand-authored static site — no framework, no build step, no CMS, no npm
dependencies, no analytics, no cookies.

## File map

```
index.html            Home — hero, what DPC is, the three services, how it works, provider
about.html            Provider bio, education and credentials, care philosophy
services.html         DPC / BHRT / Psychiatry (anchors: #dpc #bhrt #psychiatry)
membership.html       How membership works, why cash-pay, plans (#plans), inclusions
faq.html              Ten prospective-patient questions
contact.html          Practice details, contact form (backend TODO), booking (#book)
privacy.html          Privacy policy / HIPAA notice / medical disclaimer — placeholders
404.html              Not-found page
css/styles.css        The one stylesheet; colors, fonts and spacing live in :root at the top
js/main.js            Booking/portal URLs, mobile menu, current-page marker, scroll reveals
assets/brand/         Logo files (see below)
assets/favicon-32.png, assets/apple-touch-icon.png   Browser and home-screen icons
amplify.yml           Amplify build spec (no-build static deploy)
customHttp.yml        Amplify security headers (HSTS, CSP, etc.)
```

## The design system comes from the logo

`assets/brand/logo-original.png` is the client's logo exactly as supplied
(Nov 12, 2026). Everything else is derived from it:

| File | What it is | Used in |
|---|---|---|
| `mark.webp` | TWA monogram with ring and leaves | Header |
| `wordmark.webp` | "THE WELLNESS — ADVOCATE —" | Header |
| `logo.webp` | Full logo | Footer |
| `leaves.webp` | The three watercolor leaves, isolated | Page accents |

- **Colors** are sampled from the logo file: navy `#0A1E3C` (wordmark), rose
  gold `#C08265` (the T, A and "ADVOCATE"), blush and peach from the leaves.
  Brand rose gold is too light for small text (3.0:1), so small rose text uses
  `#94573D` (5.4:1). All text passes WCAG AA.
- **Type** mirrors the logo: *Bodoni Moda* for headings (the high-contrast TWA
  letters), *Cinzel* for small capital labels (the "THE WELLNESS ADVOCATE"
  wordmark), *Jost* for body text. All three load from Google Fonts.
- **The open rose-gold ring** around portraits echoes the ring in the logo.

When a new logo file arrives, re-cut these four files from it (same names and
sizes) and the whole site updates. A simplified small mark for the favicon is
an open question for the client.

## Preview locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No install, no build.

## Editing conventions

- **`[TBD-CLIENT: …]` markers** — every fact not yet confirmed by the client
  (prices, phone, address, hours, licensed states, policies) appears in the
  pages as a literal `[TBD-CLIENT: description]` marker. Find them all with:
  `grep -rn "TBD-CLIENT" --include="*.html" --include="*.js" .`
  Nothing should launch while any marker remains.
- **`<!-- EDIT: … -->` comments** mark every editable region in the HTML.
  `<!-- VERIFY: … -->` marks a fact to confirm with the client.
- **Header and footer are identical on all eight pages.** Edit once, then copy
  the whole block (or find-and-replace) across the other pages.
- **Booking + patient portal links** — paste the real OptiMantra URLs into the
  `BOOKING_URL` and `PORTAL_URL` constants at the top of `js/main.js` (one line
  each). Every button and link updates automatically; until then they fall
  back to `contact.html#book`.
- **Photos** — each portrait slot has an `EDIT` comment showing the one `<img>`
  line to add. Square photos work best (they are cropped to a circle).
- **No inline styles.** The live site's security policy (`customHttp.yml`)
  blocks `style="…"` attributes and `<style>` tags. Put all styling in
  `css/styles.css`.
- **Avoid long dashes (—) in large headings.** Bodoni Moda draws horizontal
  strokes as hairlines; at heading sizes a dash nearly disappears. Use a period
  or comma instead. Body text is fine.
- **Compliance** — BHRT copy, privacy policy, HIPAA notice, and disclaimers are
  placeholders flagged with `<!-- COMPLIANCE: … -->` comments and must be
  reviewed by the client's attorney/malpractice carrier before launch. No
  testimonials or reviews may be added without a compliance review.

## Deploy (AWS Amplify)

The site is served by AWS Amplify Hosting directly from this repo — no build
step (`amplify.yml` is already configured, and `customHttp.yml` adds security
headers at the edge).

**Do not connect Amplify from this (Robinson Consulting Group) account.** After
the repo is transferred to the client's account, connect Amplify there:
Amplify Console → New app → Host web app → connect this repo/branch. Also set
the custom 404 in the Amplify console: Rewrites and redirects → add
`/<*>` → `/404.html` → `404 (Rewrite)`.
