# Language Toggle (Indonesian/English) — Design

Date: 2026-08-08

## Goal

Add a language switcher to the NozariaX single-page site so visitors can
toggle all visible text between Indonesian (default) and English.

## Approach

Use HTML data attributes as the source of truth for translations:
every translatable element carries `data-id="..."` and `data-en="..."`.
`script.js` swaps `textContent` on all `[data-id]` elements based on the
active language. No build step, no separate translation dictionary file —
translations live next to the source text in the markup.

Brand/product names (NozariaX, Alight Motion, Canva Premium, CapCut Pro,
Express VPN, Gemini Pro, HMA VPN, Youtube Premium, Zoom Pro) are not
translated.

## Components

1. **HTML (`index.html`)**
   - Every translatable text node (nav links, hero copy, section headings,
     badges, product descriptions, testimonials, contact copy, footer) gets
     `data-id` / `data-en` attributes holding the Indonesian and English
     strings respectively. Initial rendered text stays Indonesian (matches
     current markup) so nothing changes if JS fails to load.
   - `<title>` also gets `data-id` / `data-en`. It has a normal
     `textContent`, so it's picked up by the same generic `[data-id]` loop
     as every other translatable element — no special-casing needed.
   - A language toggle is added to the navbar: `<span id="langToggle">` or
     two elements `ID | EN`, e.g.:
     ```html
     <div class="lang-toggle" id="langToggle">
         <button class="lang-btn" data-lang="id">ID</button>
         <span class="lang-sep">|</span>
         <button class="lang-btn" data-lang="en">EN</button>
     </div>
     ```
   - `<html lang="id">` stays in markup as the default; JS updates it at
     runtime.

2. **CSS (`style.css`)**
   - `.lang-toggle` styled to sit inline in the navbar next to nav links
     (or next to the hamburger on mobile).
   - `.lang-btn` styled like existing nav text (`#aaaaaa`), with an
     `.active` class using the existing gold gradient/color (`#F5D07A`)
     to mark the currently selected language.
   - Mobile: toggle stays visible in the collapsed navbar (not hidden
     inside the hamburger dropdown), since it's a small persistent control.

3. **JS (`script.js`)**
   - `setLanguage(lang)`:
     - Loops over `document.querySelectorAll('[data-id]')` and sets
       `el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id`.
     - Sets `document.documentElement.lang = lang`.
     - Toggles `.active` class on the two `.lang-btn` elements.
     - Persists choice: `localStorage.setItem('nozariax-lang', lang)`,
       wrapped in `try/catch` so private-browsing/storage-disabled
       environments silently fall back to in-memory only.
   - On script load (top-level, runs before/at DOMContentLoaded since
     `defer` preserves DOM-ready ordering):
     - Read `localStorage.getItem('nozariax-lang')`, fallback to `'id'`
       inside the same `try/catch`.
     - Call `setLanguage(storedLang)` immediately so the page renders in
       the correct language without a visible flash.
   - Click handlers on the two `.lang-btn` elements call
     `setLanguage('id')` / `setLanguage('en')`.

## Data Flow

Page load → read localStorage (or default `'id'`) → `setLanguage()` applies
text + updates toggle UI → user clicks EN/ID → `setLanguage()` re-runs →
DOM updates + localStorage updated → next visit/refresh reads the saved
value and starts in that language.

## Error Handling

- `localStorage` access wrapped in `try/catch`: if unavailable (private
  mode, storage disabled), the toggle still works for the current page
  view, it just won't persist across reloads.
- No other failure modes — this is plain DOM manipulation with no network
  calls or external dependencies.

## Testing

Manual, in-browser (no test framework in this static project):
- Load page fresh → confirm Indonesian by default.
- Click "EN" → confirm every section's text (nav, hero, about, badges,
  produk, testimoni, kontak, footer) switches to English, including the
  browser tab title.
- Refresh the page → confirm it reopens in English (persisted).
- Click "ID" → confirm it switches back and persists.
- Check mobile viewport (hamburger menu) → toggle still visible and
  usable, menu open/close still works.
