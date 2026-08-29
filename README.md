# The Wellness Advocate — Website

First-draft marketing site for **The Wellness Advocate**, a cash-pay Direct
Primary Care (DPC) practice in Jacksonville, FL, also offering bioidentical
hormone replacement therapy (BHRT) and psychiatry. Provider: Aimee
Roberts-Serrato, PMHNP-BC, FNP-C. Built by Robinson Consulting Group.

Hand-authored static site — no framework, no build step, no CMS, no npm
dependencies, no analytics, no cookies.

## File map

```
index.html         Home — hero, service cards, how-DPC-works, provider teaser
about.html         Provider bio, credentials, care philosophy
services.html      DPC / BHRT / Psychiatry (anchors: #dpc #bhrt #psychiatry)
membership.html    Membership model, why cash-pay, pricing placeholders, inclusions
faq.html           Ten prospective-patient questions
contact.html       Contact form (backend TODO), practice details, booking section (#book)
privacy.html       Privacy policy / HIPAA notice / medical disclaimer — placeholders
404.html           Not-found page
css/styles.css     The one stylesheet; brand colors live in :root at the top
js/main.js         Booking/portal URLs, mobile nav, aria-current, footer year
assets/            Favicon + headshot placeholder SVGs
amplify.yml        Amplify build spec (no-build static deploy)
customHttp.yml     Amplify security headers (HSTS, CSP, etc.)
```

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
- **Header and footer are identical on all eight pages.** Edit once, then copy
  the whole block (or find-and-replace) across the other pages.
- **Booking + patient portal links** — paste the real OptiMantra URLs into the
  `BOOKING_URL` and `PORTAL_URL` constants at the top of `js/main.js` (one line
  each). Every button/link site-wide updates automatically; until then they fall
  back to `contact.html#book`.
- **Brand colors** — all in the `:root` block at the top of `css/styles.css`;
  swap the values when the final logo is chosen.
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
