# ꟻried Brains™ World — Brand Guidelines & Constraints

This document defines the strict branding, typography, semantic HTML/CSS, and intellectual property constraints for **ꟻried Brains™ World** across the `burn-1.com` codebase and associated media.

---

## 1. Text & Unicode Brand Standards

Always adhere to the exact Unicode styling and character specifications:

* **Primary Glyph:** `ꟻ` (Unicode `U+A7FB` — Latin Epigraphic Letter Reversed F)
* **Standard Title Case:** `ꟻried Brains™ World`
* **All-Caps / Display Format:** `ꟻRIED BRAINS™ WORLD`
* **Campaign Title Format:** `The ꟻried Brains™ Anti-Addiction Campaign`
* **Short / Brand Reference:** `ꟻried Brains™`

---

## 2. Semantic HTML & CSS Implementation

To ensure proper baseline alignment of the trademark symbol (`™`) without altering layout line heights:

### HTML Structures:
```html
<!-- Direct Unicode Implementation -->
<span class="brand-title">
  ꟻried Brains<span class="brand-tm">™</span> World
</span>

<!-- CSS-Flipped Standard 'F' Fallback (if font lacks U+A7FB) -->
<span class="brand-title">
  <span class="flip-f">F</span>ried Brains<span class="brand-tm">™</span> World
</span>
```

### CSS Rules:
```css
/* Brand Title Base */
.brand-title {
  font-family: var(--font-sans, inherit);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-main, #ffffff);
  display: inline-flex;
  align-items: baseline;
}

/* Flipped F Utility (fallback for fonts without U+A7FB) */
.flip-f {
  display: inline-block;
  transform: scaleX(-1);
  margin-right: 1px;
}

/* Superscript TM Symbol */
.brand-tm {
  font-family: var(--font-mono, monospace);
  font-size: 0.55em;
  font-weight: 700;
  color: var(--accent-blue, #38bdf8);
  vertical-align: super;
  line-height: 0;
  margin-left: 2px;
  margin-right: 4px;
}
```

---

## 3. Mandatory Legal & Trademark Notice

All footer sections and documentation for ꟻried Brains™ World must include the standard IP declaration:

```html
<footer class="footer-legal">
  <p>© 2026 Leon R. Darden. All rights reserved.</p>
  <p class="tm-notice">
    ꟻried Brains™ and ꟻried Brains™ World are trademarks of Leon R. Darden.
  </p>
</footer>
```

```css
.tm-notice {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
  margin-top: 0.5rem;
}
```
