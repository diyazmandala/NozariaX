# Language Toggle (Indonesian/English) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a navbar toggle that switches all visible site text between Indonesian (default) and English, persisting the choice across visits.

**Architecture:** Every translatable text node in `index.html` gets `data-id="..."` / `data-en="..."` attributes holding both language versions. `script.js` swaps `textContent` across all `[data-id]` elements based on the language picked via two new navbar buttons, and remembers the choice in `localStorage`.

**Tech Stack:** Plain HTML/CSS/JS, no build tools, no frameworks, no package manager, no existing test runner.

## Global Constraints

- No automated test framework exists in this repo — it's static HTML/CSS/JS served directly from files. Every "test" step in this plan is a manual verification: open `index.html` in a browser and check the described behavior (via the `run` skill, `claude-in-chrome` browser tools, or by hand).
- Brand/product names are never translated: NozariaX, Alight Motion, Canva Premium, CapCut Pro, Express VPN, Gemini Pro, HMA VPN, Youtube Premium, Zoom Pro. Person names in testimonials (Rizky Aditya, Siti Nurhaliza, Dimas Prasetyo) are also left as-is.
- Default language is Indonesian (`id`), matching the current site content — if JS fails to load, the page must still read correctly in Indonesian.
- Language choice persists via `localStorage` key `nozariax-lang`, wrapped in `try/catch` so private-browsing/storage-disabled environments don't throw.
- Toggle UI: two text buttons "ID" and "EN" separated by "|", placed in the navbar, active language shown in gold (`#F5D07A`), matching the existing nav color scheme.

---

### Task 1: HTML — data attributes + toggle markup

**Files:**
- Modify: `index.html` (full file rewrite — every section changes)

**Interfaces:**
- Produces: every translatable text node wrapped/attributed with `data-id="<indonesian>"` / `data-en="<english>"`, consumed by Task 3's generic `[data-id]` loop.
- Produces: `<div class="lang-toggle" id="langToggle">` containing two `<button class="lang-btn" data-lang="id">ID</button>` / `<button class="lang-btn" data-lang="en">EN</button>`, with the `id` button carrying `active` initially. Consumed by Task 2 (styling) and Task 3 (click handlers, active-state toggling).
- Produces: `<div class="nav-right">` wrapping the existing `<ul class="nav-links">` and the new `.lang-toggle`, sitting between `.nav-logo` and `.hamburger` in `.nav-container`. Consumed by Task 2 for layout.

- [ ] **Step 1: Rewrite `index.html` with data attributes and toggle markup**

Replace the entire file with:

```html
<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-id="NozariaX — Toko Digital Premium" data-en="NozariaX — Premium Digital Store">NozariaX — Toko Digital Premium</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <script src="script.js" defer></script>
</head>

<body>

    <!-- NAVBAR -->
    <nav>
        <div class="nav-container">
            <span class="nav-logo">NOZARIA<span class="gold">X</span></span>
            <div class="nav-right">
                <ul class="nav-links" id="navLinks">
                    <li><a href="#about" data-id="Tentang" data-en="About">Tentang</a></li>
                    <li><a href="#produk" data-id="Produk" data-en="Products">Produk</a></li>
                    <li><a href="#testimoni" data-id="Testimoni" data-en="Testimonials">Testimoni</a></li>
                    <li><a href="#kontak" data-id="Kontak" data-en="Contact">Kontak</a></li>
                </ul>
                <div class="lang-toggle" id="langToggle">
                    <button type="button" class="lang-btn active" data-lang="id">ID</button>
                    <span class="lang-sep">|</span>
                    <button type="button" class="lang-btn" data-lang="en">EN</button>
                </div>
            </div>
            <button class="hamburger" id="hamburgerBtn" aria-label="Buka menu" aria-expanded="false">☰</button>
        </div>
    </nav>

    <!-- HERO -->
    <section id="hero">
        <div class="hero-content">
            <p class="hero-label" data-id="⭐ Toko Digital Terpercaya" data-en="⭐ Trusted Digital Store">⭐ Toko Digital Terpercaya</p>
            <h1><span data-id="Selamat Datang di" data-en="Welcome to">Selamat Datang di</span><br><span class="gold">NozariaX</span></h1>
            <p class="hero-sub" data-id="Kami hadir sebagai penerus resmi TrustoriaX — menyediakan akun premium berkualitas dengan harga terjangkau dan pelayanan terpercaya." data-en="We are the official successor to TrustoriaX — offering quality premium accounts at affordable prices with trusted service.">Kami hadir sebagai penerus resmi TrustoriaX — menyediakan akun premium berkualitas dengan harga terjangkau dan pelayanan terpercaya.</p>
            <a href="#kontak" class="btn-gold" data-id="Hubungi Kami" data-en="Contact Us">Hubungi Kami</a>
        </div>
    </section>

    <!-- ABOUT -->
    <section id="about">
        <div class="container">
            <h2><span data-id="Tentang" data-en="About">Tentang</span> <span class="gold">NozariaX</span></h2>
            <p data-id="NozariaX adalah toko digital resmi penerus TrustoriaX. Dengan pengalaman dan kepercayaan yang telah dibangun sebelumnya, kami hadir kembali dengan nama baru namun komitmen yang sama — memberikan produk digital premium terbaik untuk kamu." data-en="NozariaX is the official digital store and successor to TrustoriaX. Building on the experience and trust established before, we return under a new name with the same commitment — delivering the best premium digital products for you.">NozariaX adalah toko digital resmi penerus TrustoriaX. Dengan pengalaman dan kepercayaan yang telah dibangun sebelumnya, kami hadir kembali dengan nama baru namun komitmen yang sama — memberikan produk digital premium terbaik untuk kamu.</p>
            <div class="badge-row">
                <div class="badge" data-id="✅ Terpercaya" data-en="✅ Trusted">✅ Terpercaya</div>
                <div class="badge" data-id="⚡ Proses Cepat" data-en="⚡ Fast Process">⚡ Proses Cepat</div>
                <div class="badge" data-id="💎 Kualitas Premium" data-en="💎 Premium Quality">💎 Kualitas Premium</div>
                <div class="badge" data-id="🛡️ Aman & Bergaransi" data-en="🛡️ Safe & Guaranteed">🛡️ Aman & Bergaransi</div>
            </div>
        </div>
    </section>

    <!-- PRODUK -->
    <section id="produk">
        <div class="container">
            <h2><span data-id="Produk" data-en="Our">Produk</span> <span class="gold" data-id="Kami" data-en="Products">Kami</span></h2>
            <div class="product-grid">
                <div class="product-card">
                    <div class="product-icon">🎬</div>
                    <h3>Alight Motion</h3>
                    <p data-id="Aplikasi edit video profesional dengan efek motion keren" data-en="Professional video editing app with cool motion effects">Aplikasi edit video profesional dengan efek motion keren</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">🎨</div>
                    <h3>Canva Premium</h3>
                    <p data-id="Desain grafis unlimited dengan ribuan template premium" data-en="Unlimited graphic design with thousands of premium templates">Desain grafis unlimited dengan ribuan template premium</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">✂️</div>
                    <h3>CapCut Pro</h3>
                    <p data-id="Edit video mudah & keren, no watermark, fitur lengkap" data-en="Easy & cool video editing, no watermark, full features">Edit video mudah & keren, no watermark, fitur lengkap</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">🔒</div>
                    <h3>Express VPN</h3>
                    <p data-id="VPN tercepat & teraman untuk browsing tanpa batas" data-en="The fastest & safest VPN for unlimited browsing">VPN tercepat & teraman untuk browsing tanpa batas</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">🤖</div>
                    <h3>Gemini Pro + 5TB</h3>
                    <p data-id="AI canggih dari Google + penyimpanan cloud 5TB" data-en="Advanced AI from Google + 5TB cloud storage">AI canggih dari Google + penyimpanan cloud 5TB</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">🛡️</div>
                    <h3>HMA VPN</h3>
                    <p data-id="Privasi online terjamin dengan jaringan server global" data-en="Guaranteed online privacy with a global server network">Privasi online terjamin dengan jaringan server global</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">▶️</div>
                    <h3>Youtube Premium</h3>
                    <p data-id="Nonton tanpa iklan, download video, background play" data-en="Ad-free watching, video downloads, background play">Nonton tanpa iklan, download video, background play</p>
                </div>
                <div class="product-card">
                    <div class="product-icon">💼</div>
                    <h3>Zoom Pro</h3>
                    <p data-id="Meeting online profesional tanpa batas waktu" data-en="Professional online meetings with no time limit">Meeting online profesional tanpa batas waktu</p>
                </div>
            </div>
        </div>
    </section>

    <!-- TESTIMONI -->
    <section id="testimoni">
        <div class="container">
            <h2><span data-id="Kata" data-en="Customer">Kata</span> <span class="gold" data-id="Mereka" data-en="Reviews">Mereka</span></h2>
            <p data-id="Ribuan pelanggan telah merasakan pelayanan terpercaya dari NozariaX." data-en="Thousands of customers have experienced NozariaX's trusted service.">Ribuan pelanggan telah merasakan pelayanan terpercaya dari NozariaX.</p>
            <div class="testimonial-grid">
                <div class="testimonial-card">
                    <div class="testimonial-avatar">RA</div>
                    <div class="testimonial-stars">★★★★★</div>
                    <p data-id="&quot;Proses order Alight Motion super cepat, kurang dari 10 menit udah aktif. Harga juga jauh lebih murah dari toko lain!&quot;" data-en="&quot;The Alight Motion order process was super fast, active in under 10 minutes. The price is also way cheaper than other stores!&quot;">"Proses order Alight Motion super cepat, kurang dari 10 menit udah aktif. Harga juga jauh lebih murah dari toko lain!"</p>
                    <h3>Rizky Aditya</h3>
                    <span class="testimonial-role" data-id="Pembeli Alight Motion" data-en="Alight Motion Buyer">Pembeli Alight Motion</span>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-avatar">SN</div>
                    <div class="testimonial-stars">★★★★★</div>
                    <p data-id="&quot;Udah langganan Canva Premium di sini dari jaman TrustoriaX, pindah ke NozariaX pelayanannya tetap ramah dan garansinya jelas.&quot;" data-en="&quot;I've been subscribing to Canva Premium here since the TrustoriaX days — moving to NozariaX, the service is still friendly and the warranty is clear.&quot;">"Udah langganan Canva Premium di sini dari jaman TrustoriaX, pindah ke NozariaX pelayanannya tetap ramah dan garansinya jelas."</p>
                    <h3>Siti Nurhaliza</h3>
                    <span class="testimonial-role" data-id="Pembeli Canva Premium" data-en="Canva Premium Buyer">Pembeli Canva Premium</span>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-avatar">DP</div>
                    <div class="testimonial-stars">★★★★★</div>
                    <p data-id="&quot;CapCut Pro no watermark work perfect, admin fast response pas ada kendala. Recommended banget buat editor pemula kayak aku.&quot;" data-en="&quot;CapCut Pro no watermark works perfectly, admin responds fast whenever there's an issue. Highly recommended for beginner editors like me.&quot;">"CapCut Pro no watermark work perfect, admin fast response pas ada kendala. Recommended banget buat editor pemula kayak aku."</p>
                    <h3>Dimas Prasetyo</h3>
                    <span class="testimonial-role" data-id="Pembeli CapCut Pro" data-en="CapCut Pro Buyer">Pembeli CapCut Pro</span>
                </div>
            </div>
        </div>
    </section>

    <!-- KONTAK -->
    <section id="kontak">
        <div class="container">
            <h2><span data-id="Hubungi" data-en="Contact">Hubungi</span> <span class="gold" data-id="Kami" data-en="Us">Kami</span></h2>
            <p data-id="Untuk pemesanan, pertanyaan, atau info produk — langsung hubungi kami via Telegram!" data-en="For orders, questions, or product info — contact us directly via Telegram!">Untuk pemesanan, pertanyaan, atau info produk — langsung hubungi kami via Telegram!</p>
            <a href="https://t.me/trustoriax" class="btn-gold" target="_blank">💬 Chat via Telegram</a>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <p>© 2025 <span class="gold">NozariaX</span> — <span data-id="Penerus Resmi TrustoriaX" data-en="Official Successor to TrustoriaX">Penerus Resmi TrustoriaX</span></p>
    </footer>

</body>

</html>
```

- [ ] **Step 2: Verify markup by hand**

Open `index.html` directly in a browser (double-click the file, or use the `run` skill / a local static server). Confirm:
- Page still reads entirely in Indonesian, identical in wording to before the edit.
- "ID | EN" text appears in the navbar next to the nav links (unstyled at this point — that's expected, Task 2 styles it).
- No layout break: nav-links and hamburger still present and working.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Add data-id/data-en translation attributes and language toggle markup"
```

---

### Task 2: CSS — style the language toggle

**Files:**
- Modify: `style.css`

**Interfaces:**
- Consumes: `.nav-right`, `.lang-toggle`, `.lang-btn`, `.lang-sep` elements produced by Task 1.
- Produces: `.lang-btn.active` visual state (gold), consumed by Task 3 which toggles this class via JS.

- [ ] **Step 1: Add navbar layout and toggle styles**

In `style.css`, right after the `.nav-links a:hover { color: #F5D07A; }` block (currently lines 62-64) and before the `.hamburger` block, insert:

```css
.nav-right {
    display: flex;
    align-items: center;
    gap: 30px;
}

.lang-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
}

.lang-btn {
    background: none;
    border: none;
    color: #aaaaaa;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    padding: 4px;
    transition: color 0.3s;
}

.lang-btn:hover {
    color: #F5D07A;
}

.lang-btn.active {
    color: #F5D07A;
}

.lang-sep {
    color: #555555;
    font-size: 0.85rem;
}
```

- [ ] **Step 2: Tighten spacing on mobile**

Inside the existing `@media (max-width: 640px) { ... }` block (currently starting at line 77), right after the `.hamburger { display: block; }` rule, add:

```css
    .nav-right {
        gap: 12px;
    }
```

- [ ] **Step 3: Verify styling by hand**

Open `index.html` in a browser at both desktop width and a mobile width (~375px, e.g. via browser dev tools device toolbar):
- Desktop: "ID | EN" sits inline with the nav links, "ID" shown in gold (active), "EN" in muted gray, separated by a thin "|".
- Mobile: hamburger still toggles the nav-links dropdown; "ID | EN" stays visible next to the hamburger icon at all times (not hidden inside the dropdown).
- Hovering "EN" turns it gold on hover (desktop).

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "Style the language toggle buttons"
```

---

### Task 3: JS — language switching logic

**Files:**
- Modify: `script.js` (full file rewrite)

**Interfaces:**
- Consumes: `document.querySelectorAll('[data-id]')` elements from Task 1 (reads `.dataset.id` / `.dataset.en`), `.lang-btn` elements with `data-lang="id"|"en"` from Task 1, `.active` CSS class from Task 2.
- Produces: `setLanguage(lang)` function (module-local, not exported — this is a plain script, not a module) that other tasks/future work can extend if more languages are ever needed.

- [ ] **Step 1: Rewrite `script.js` with language switching logic**

Replace the entire file with:

```js
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    hamburgerBtn.textContent = isOpen ? '✕' : '☰';
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerBtn.textContent = '☰';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

const LANG_STORAGE_KEY = 'nozariax-lang';
const langButtons = document.querySelectorAll('.lang-btn');
const translatableElements = document.querySelectorAll('[data-id]');

function setLanguage(lang) {
    translatableElements.forEach(el => {
        el.textContent = lang === 'en' ? el.dataset.en : el.dataset.id;
    });

    document.documentElement.lang = lang;

    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
        // localStorage unavailable (e.g. private browsing) - the chosen
        // language still applies to this page view, it just won't persist.
    }
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

let initialLang = 'id';
try {
    initialLang = localStorage.getItem(LANG_STORAGE_KEY) || 'id';
} catch (e) {
    initialLang = 'id';
}
setLanguage(initialLang);
```

- [ ] **Step 2: Verify switching behaves correctly**

Open `index.html` in a browser:
- Page loads in Indonesian, "ID" shown active in the toggle.
- Click "EN": every section's text switches to English — nav links, hero label/heading/subtext/button, about heading/paragraph/badges, product descriptions (product names like "Alight Motion" stay unchanged), testimonial intro/quotes/roles, contact heading/paragraph, footer tagline, and the browser tab title.
- "EN" button is now shown gold/active, "ID" muted.
- Click "ID": everything switches back to Indonesian, "ID" active again.
- Hamburger menu (mobile width) still opens/closes and still auto-closes on nav link click, independent of language.

- [ ] **Step 3: Verify persistence**

With "EN" selected, refresh the page. Confirm it reloads directly in English with "EN" marked active (no Indonesian flash). Switch back to "ID", refresh again, confirm it reloads in Indonesian.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Implement language switching with localStorage persistence"
```

---

### Task 4: Full manual QA pass

**Files:**
- None (verification only, no code changes expected unless a bug is found)

**Interfaces:**
- Consumes: the finished feature from Tasks 1-3.

- [ ] **Step 1: Run the full checklist from the design spec**

Open `index.html` in a browser and walk through `docs/superpowers/specs/2026-08-08-language-toggle-design.md`'s Testing section end to end:
- Fresh load → Indonesian by default.
- Click "EN" → every section switches (re-check each one listed in Task 3 Step 2, including the `<title>` tag visible in the browser tab).
- Refresh → stays English.
- Click "ID" → switches back and persists on refresh.
- Resize to a mobile width and re-check the hamburger menu + language toggle both work together (open menu, switch language while menu is open, close menu).

- [ ] **Step 2: Fix any issues found**

If any element didn't switch language (missing `data-id`/`data-en`) or the toggle/layout looks broken at some width, fix it directly in `index.html`/`style.css`/`script.js` and re-run Step 1.

- [ ] **Step 3: Commit any fixes**

Only if Step 2 required changes:

```bash
git add index.html style.css script.js
git commit -m "Fix language toggle issues found in QA pass"
```
