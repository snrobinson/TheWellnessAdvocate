# The Wellness Advocate — Website

Marketing site for **The Wellness Advocate**, a cash-pay Direct Primary Care
(DPC) practice based in Jacksonville, FL, also offering hormone therapy (BHRT) and
psychiatry & mental health care, telehealth-first across Florida. Provider: Aimee Roberts-Serrato, MSN, APRN,
FNP-C, PMHNP-BC. Built by Robinson Consulting Group.

Hand-authored static site — no framework, no build step, no CMS, no npm
dependencies, no cookies. Analytics is not switched on yet; a cookieless slot
is ready (see "Analytics").

## File map

Pages follow the signed proposal:

```
index.html            Home — hero, what DPC is, the three services, how it works, provider
how-dpc-works.html    How Direct Primary Care Works — the model, why cash-pay,
                      what membership covers (#coverage) and the FAQ (#faq)
membership.html       Membership & Pricing — plans (#plans), how enrollment works
services.html         Short overview of the three services (parent of the Services menu)
primary-care.html     Primary Care
hormone-therapy.html  Hormone Therapy (BHRT) — carries the FTC compliance comment
psychiatry.html       Psychiatry & Mental Health
about.html            About Aimee — bio, education and credentials, care philosophy
new-patients.html     New Patients — choose a plan, enroll, intake forms, first visit,
                      what to bring, reaching the practice between visits
contact.html          Practice details, contact form (backend TODO), booking (#book)
privacy.html          Privacy policy / HIPAA notice / medical disclaimer — placeholders
404.html              Not-found page
faq.html              Redirect only: sends visitors to how-dpc-works.html#faq
sitemap.xml           Every public page, for search engines
robots.txt            PREVIEW: blocks all crawlers until launch (see "Preview: hidden from search")
llms.txt              Plain-language guide to the practice for AI assistants (see below)
partials/             Reusable snippets that are NOT shown on any page (see below)
css/styles.css        The one stylesheet; colors, fonts and spacing live in :root at the top
js/main.js            OptiMantra link addresses, menus, current-page marker, scroll reveals
assets/brand/         Logo files and the social-sharing image (see below)
assets/favicon-32.png, assets/apple-touch-icon.png   Browser and home-screen icons
assets/textures/      grain.svg, grain-light.svg and grain-dark.svg, the faint paper grain (see below)
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
| `og-image.jpg` | Full logo on ivory, 1200×630 | Link previews (Open Graph / Twitter) |
| `mark-dark.webp`, `wordmark-dark.webp`, `logo-dark.webp` | The same three with the navy turned ivory (rose gold unchanged) | Header and footer in dark mode |

- **Colors** are sampled from the logo file: navy `#0A1E3C` (wordmark), rose
  gold `#C08265` (the T, A and "ADVOCATE"), blush and peach from the leaves.
  Brand rose gold is too light for small text (3.0:1), so small rose text uses
  `#94573D` (5.4:1). All text passes WCAG AA.
- **Type** mirrors the logo: *Bodoni Moda* for headings (the high-contrast TWA
  letters), *Cinzel* for small capital labels (the "THE WELLNESS ADVOCATE"
  wordmark), *Jost* for body text. All three load from Google Fonts.
- **Legibility settings.** Bodoni Moda is pinned to a sturdier optical size
  (`font-variation-settings: "opsz"`) with semibold headings, so its thin strokes
  don't vanish on screen. Body text is Jost at weight 450, and small capital
  labels are at least 0.82rem and weight 600. See the `LEGIBILITY` comment in
  `css/styles.css` before making type lighter or smaller.
- **The open rose-gold ring** around portraits echoes the ring in the logo.
- **Texture and depth ("paper, foil and ink").** Light backgrounds carry a
  faint warm paper grain (`assets/textures/grain.svg`, a tiny tiled image).
  Navy bands get soft tonal light, a fine light grain and, on larger screens,
  a faint double rose-gold ring in the upper corner. Cards, buttons and
  floating elements use a three-step shadow scale (`--shadow-1` to
  `--shadow-3` in `:root`). All of it lives in the "Surfaces and depth"
  section of `css/styles.css`; keep it subtle, as the grain should be felt
  rather than seen.

When a new logo file arrives, re-cut these files from it (same names and
sizes) and the whole site updates. A simplified small mark for the favicon is
an open question for the client.

## Dark mode

When a visitor's phone or computer is set to dark mode, the site switches to
its own dark design automatically (there is no toggle). It is the same "paper,
foil and ink" idea at night: a deep ink-navy page with a finer light grain,
warm ivory text, rose gold kept as rose gold, the navy bands lifted to a
midnight blue, and ivory buttons with navy lettering. The header and footer
swap to the `-dark` logo files through a `<picture>` element in each page.

- **Where it lives:** the "Dark mode" block at the end of `css/styles.css`.
  Its `:root` block holds every dark color; the rules after it cover the few
  places where the light design uses navy as a background. All text passes
  WCAG AA in both modes.
- **Why it exists:** without it, iPhones running a dark-mode Safari extension
  (Noir, Dark Reader) or Smart Invert repainted the light design themselves,
  turning the header charcoal and hiding the navy wordmark. A site with its own
  dark design is left alone by those tools (`<meta name="darkreader-lock">`
  also asks Dark Reader directly).
- **Testing it:** switch the device to dark mode (on a Mac, System Settings →
  Appearance; in Chrome DevTools, Rendering → "prefers-color-scheme: dark").
- **New logo files:** when the logo is re-cut, re-make the three `-dark.webp`
  files too: the logo's navy pixels turned to ivory (`#F4EFE9`), lighter navy
  washes to pale slate, rose gold and the blush/peach leaves untouched.

## Preview locally

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No install, no build.

## Preview: hidden from search

Until launch the preview asks search engines and AI crawlers to stay away, in
three places:

1. `robots.txt` blocks every crawler (`Disallow: /`). The real launch version,
   which welcomes search engines and names the AI assistants, waits in
   `partials/robots-launch.txt`.
2. Every page has a `<meta name="robots" content="noindex, nofollow">` line
   marked `PREVIEW-ONLY`.
3. `customHttp.yml` sends an `X-Robots-Tag: noindex, nofollow` header, also
   marked `PREVIEW-ONLY`, which covers images, the README and other non-page files.

**At launch, undo all three** (after the BASE_URL swap below):

```
git mv -f partials/robots-launch.txt robots.txt
perl -ni -e 'print unless /PREVIEW-ONLY/' *.html
```

Then delete the two `X-Robots-Tag` lines and their `PREVIEW-ONLY` comment in
`customHttp.yml`, and remove the "Not live yet" comment line at the top of the
new `robots.txt`. Check: `grep -rn "PREVIEW-ONLY" .` should return nothing.

## Changing the domain at launch (BASE_URL)

Search engines and link previews need full web addresses, so one base address
— `BASE_URL` — appears in every page's canonical and social-sharing tags, in
the structured data, in `sitemap.xml` and in `robots.txt`. It is currently
RCG's Amplify preview:

```
https://main.d1bs05hyunugqi.amplifyapp.com
```

When the final domain is chosen, swap it everywhere with one command (put the
real domain in place of `https://www.example.com`, no trailing slash):

```
grep -rl 'https://main.d1bs05hyunugqi.amplifyapp.com' --include='*.html' --include='*.xml' --include='*.txt' . \
  | xargs perl -pi -e 's#https://main\.d1bs05hyunugqi\.amplifyapp\.com#https://www.example.com#g'
```

Then confirm nothing was missed: `grep -rn "amplifyapp" .` should return
nothing. Submit the new `sitemap.xml` address in Google Search Console.

## Editing conventions

- **`[TBD-CLIENT: …]` markers** — every fact not yet confirmed by the client
  (prices, phone, address, hours, licensed states, policies) appears in the
  pages as a literal `[TBD-CLIENT: description]` marker. **`[TBD-RCG: …]`**
  marks items RCG finishes (analytics). Find them all with:
  `grep -rn "TBD-" --include="*.html" --include="*.js" .`
  Nothing should launch while any marker remains.
- **`<!-- EDIT: … -->` comments** mark every editable region in the HTML.
  `<!-- VERIFY: … -->` marks a fact to confirm with the client.
- **Header and footer are identical on every page** (except the `faq.html`
  redirect). Edit once, then copy the whole block (or find-and-replace) across
  the other pages.
- **OptiMantra links** — paste the real addresses into the four constants at
  the top of `js/main.js` (one line each): `BOOKING_URL` (every "Book a visit"),
  `PORTAL_URL` (every "Patient Portal"), `ENROLL_URL` ("Enroll online") and
  `INTAKE_URL` ("Open intake forms"). Until then the links fall back to
  `contact.html#book`. Also replace the matching visible `[TBD-CLIENT]` text on
  `new-patients.html` and `contact.html`.
- **Telehealth-first.** The practice has no office yet: visits are by telehealth
  across Florida, by appointment with flexible hours, and Aimee is licensed in
  Florida only. Nothing on the site should imply a walk-in location (no address,
  map or office photos), and the structured data marks the practice as a
  `MedicalOrganization` serving Florida, not a clinic location. When an office
  opens, add the address to the Contact page and footer, and switch the home
  page's structured data to `MedicalClinic` with a street address.
- **Prices** (from Aimee, Nov 12, 2026) appear on the Membership page, the How
  DPC Works FAQ and coverage list, the Primary Care, Hormone Therapy and
  Psychiatry pages, the page descriptions, and `llms.txt`. If a price changes,
  search for it (for example `grep -rn '\$179'`) and change every copy.
- **Crisis information** appears in the footer and on the psychiatry,
  contact, new-patients and privacy pages. It is the same block everywhere
  (the 988 Suicide & Crisis Lifeline, 911 or the nearest emergency room, and
  that the site and form are not monitored for urgent messages). If the wording
  ever changes, change every copy the same way.
- **Photos** — each portrait slot has an `EDIT` comment showing the one `<img>`
  line to add. Square photos work best (they are cropped to a circle).
- **Getting around long pages.** The footer block ends with two floating
  buttons that `js/main.js` shows after the first screen of scrolling: "Back
  to top" (its rose-gold ring fills as the page is read) and, on phones only,
  "Book a visit" (hidden while another booking button is on screen). The header (logo and menu) stays pinned at the top of every page; on phones and
  tablets it settles into a slimmer bar once the page is scrolled. The longest pages (`how-dpc-works`, `membership`, `new-patients`)
  have an "On this page" row of links under the heading; if a section is added
  or renamed there, update that row and the section's `id` to match.
- **Section navigator.** On pages with three or more sections, `js/main.js`
  adds a small index that follows the reader: a slim rail on the right edge on
  desktop, a slim bar docked under the header on phones. Its labels come from each section's
  small eyebrow line; to give a section a shorter label, add
  `data-nav-label="..."` to its `<section>` tag. Nothing to maintain otherwise.
- **After editing `css/styles.css` or `js/main.js`**, change the `?v=` date on
  their two lines in every page's `<head>` (for example `?v=20261116` to
  `?v=20261120`), or phones may keep showing the old version:
  `grep -rl '?v=20261116' --include='*.html' . | xargs perl -pi -e 's/\?v=20261116/?v=20261120/g'`
- **No inline styles.** The live site's security policy (`customHttp.yml`)
  blocks `style="…"` attributes and `<style>` tags. Put all styling in
  `css/styles.css`.
- **Avoid long dashes (—) in large headings.** Bodoni Moda draws horizontal
  strokes as hairlines; at heading sizes a dash nearly disappears. Use a period
  or comma instead. Body text is fine.
- **Her name with credentials always includes APRN** — in page titles and in
  visible text, in her order: "Aimee Roberts-Serrato, MSN, APRN, FNP-C, PMHNP-BC".
- **Compliance** — BHRT copy, privacy policy, HIPAA notice, and disclaimers are
  placeholders flagged with `<!-- COMPLIANCE: … -->` comments and must be
  reviewed by the client's attorney/malpractice carrier before launch. No
  testimonials or reviews may be added without a compliance review.

## Florida free / discounted-service notice

`partials/florida-free-service-notice.html` holds the statement required by
section 456.062, Florida Statutes, in capital letters, ready to paste. It is
**not shown on any page**. Add it only to a page or ad that offers a free,
discounted-fee or reduced-fee service, examination or treatment (a free
consultation, a discounted first visit, a promotional membership price). The
comment in that file explains placement; confirm with counsel before any
promotion goes live.

## Search engines and AI assistants (SEO and GEO)

The site is set up to be found and quoted accurately by search engines and by
AI assistants (ChatGPT, Claude, Perplexity, Google's AI answers), which is
sometimes called GEO, generative engine optimization.

- **Structured data.** Every page's `<head>` has a `<script type="application/ld+json">`
  block describing the page, the practice (`MedicalOrganization`, since there is no office yet) and Aimee (`Person`,
  with her degrees and board certifications), all linked together. The
  How DPC Works page also lists the FAQ (`FAQPage`). **If you change an FAQ
  question or answer on that page, change the copy in its structured data the
  same way** (an `EDIT` comment marks it). The home page's block has a note on
  adding the address, phone, hours and official profile links once confirmed.
- **`llms.txt`** is a short Markdown summary of the practice and its pages,
  written for AI assistants. Keep its facts in step with the site, and add
  pricing or the address there once they are final.
- **`robots.txt`** blocks every crawler while the site is a private preview. The
  launch version (`partials/robots-launch.txt`) allows every crawler and names the
  AI ones explicitly. To keep
  the site out of AI *training* while staying visible in AI *answers*, follow
  the comment in that file.
- **`sitemap.xml`** carries a `lastmod` date; update it when pages change.
- All of these use BASE_URL, so the launch command above updates them too.

## Launch: listings must match the site

Mismatched details across a practice's own site and its directory listings were
the most common credibility problem on similar practices' sites (different prices,
spellings of the provider's name, or addresses in different places). At launch,
and whenever a fact changes, make every listing say exactly what the site says.
Aimee approves or creates each listing, since they are her accounts.

- **Copy these from the site, word for word:** practice name; "Aimee
  Roberts-Serrato, MSN, APRN, FNP-C, PMHNP-BC"; the tagline; prices; "Telehealth
  across Florida" and "Services are available to patients located in Florida";
  the practice phone, email and domain once final.
- **Never list an office address.** The practice is telehealth-first with no
  office. Where a directory requires a location, use a service area (Florida)
  or leave it blank, never a street address.
- **Likely listings:** Google Business Profile (as a service-area business),
  the DPC Frontier mapper, Hint Connect, Psychology Today (for psychiatry),
  and any insurer-free or self-pay directories she chooses.
- **After each listing is live:** add its URL to the `sameAs` list in the
  structured data (the home page's block has a note), and to `llms.txt` if
  it's useful there.
- **Each time a price or policy changes:** update the site first, then every
  listing, then `llms.txt` and the FAQ structured data.

## Analytics

Not switched on. Each page's `<head>` has a commented-out slot marked
`[TBD-RCG: analytics provider and token]`, planned as cookieless, aggregate
visit counts with no personal or health information. To switch it on:

1. In every page, move the script line out of the ANALYTICS comment and fill in
   the provider's script address and token.
2. Add the provider's domain to `script-src` and `connect-src` in
   `customHttp.yml`, or the browser will block it.
3. Replace the `[TBD-RCG]` analytics paragraph on `privacy.html` with the final
   disclosure.

## Deploy (AWS Amplify)

The site is served by AWS Amplify Hosting directly from this repo — no build
step (`amplify.yml` is already configured, and `customHttp.yml` adds security
headers at the edge).

**Do not connect Amplify from this (Robinson Consulting Group) account.** After
the repo is transferred to the client's account, connect Amplify there:
Amplify Console → New app → Host web app → connect this repo/branch. Then add
these in Rewrites and redirects, in this order:

1. `/faq.html` → `/how-dpc-works.html` → `301 (Redirect - Permanent)` (the FAQ
   moved; `faq.html` also redirects in the browser as a fallback)
2. `/<*>` → `/404.html` → `404 (Rewrite)` (custom not-found page)
