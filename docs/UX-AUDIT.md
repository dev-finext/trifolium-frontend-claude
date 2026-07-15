# Trifolium — UX / UI & Accessibility Audit

**Date:** 2026-07-15
**Scope:** the whole mobile-first PWA (Vue 3 + Inertia, Hebrew RTL) — every form and field, every screen at the phone tier (`html.tf-mobile`, ≤760px, 375px reference), accessibility (WCAG 2.2 AA), interaction states, and PWA correctness.
**Method:** three independent read-only reviews (forms & validation · mobile/PWA · accessibility/UX/design) reading the actual source, consolidated here.

Each finding has an ID, severity, location, the problem, and the fix. A **Status** column tracks remediation (this pass implements everything — see the log at the end).

> Environment note: this is a frontend-only port; "submits" use local state / mock navigation (`TODO(backend)` markers). The audit judges the **client UX layer**, which is what ships to users regardless of backend.

---

## 0. Cross-cutting (affects the whole app)

| ID | Sev | Location | Problem | Fix | Status |
|----|-----|----------|---------|-----|--------|
| X1 | High | all field components | No `label`↔`input` association (`<label>` without `for`, inputs without `id`). Tapping a label doesn't focus; AT can't pair them. | Generate ids, wire `for`/`id` (shared `FormField` wrapper). | ✅ |
| X2 | High | all error blocks | Errors not accessible — no `role="alert"`/`aria-live`; inputs never get `aria-invalid`/`aria-describedby`. | `role="alert"` on error node; `aria-invalid` + `aria-describedby` on input. | ✅ |
| X3 | Med | all text inputs | No `enterkeyhint`; email/username/ID autocapitalize+autocorrect on mobile. | Add `enterkeyhint`; `autocapitalize/autocorrect/spellcheck=off` on latin/id/email. | ✅ |
| X4 | Low | app.css | iOS 16px zoom-guard gated on the JS `tf-mobile` class, not a media query — fails if JS is slow. | Move the 16px rule into `@media (max-width:760px)`. | ✅ |

## 1. Forms & validation

| ID | Sev | Location | Problem | Fix | Status |
|----|-----|----------|---------|-----|--------|
| F1 | Critical | Login.vue:14 | Hardcoded demo credentials pre-filled and shipped in the bundle. | Clear fields; gate any demo value behind a dev flag. | ✅ |
| F2 | Med | Login.vue | No focus moved to first invalid field on submit. | Focus first error. | ✅ |
| F5 | Critical | Register.vue | **All validation is dead code** — `validatePersonal/Address/Professional` exist but `advance()` never calls them; the 3-step signup accepts empty/garbage. | Call validators in `advance()`, block + focus first error, inline messages. | ✅ |
| F6 | High | Register.vue | No `autocomplete` tokens on any field — kills autofill. | Add given-name/family-name/email/tel/bday/street-address/etc. | ✅ |
| F7 | Med | Register.vue | No required-field indicators. | `*` + `aria-required`. | ✅ |
| F8 | Med | Register.vue | DOB `type=date` has no `max` (future dates allowed). | `:max="today"`, sane `min`. | ✅ |
| F9 | Low | Register.vue | Clinic-description textarea unbounded. | `maxlength` + counter. | ✅ |
| F10 | Low | ForgotPassword.vue | Solid; missing off-tokens + focus-on-error. | Add them. | ✅ |
| F11 | Med | ResetPassword.vue | Weak password rule (8 + letter + digit; regex accepts Hebrew letters). | Strengthen; shared rules module; decide Hebrew-letter policy. | ✅ |
| F13 | Med | ChangePassword.vue | Same weak rules (duplicated); no "new ≠ current" check. | Share module; add new≠current. | ✅ |
| F15 | Med | Profile/Edit + AddressCardEditor | Zero validation on profile save; phone accepts anything. | Required + `isPhone`; inline errors. | ✅ |
| F16 | Low | AddressCardEditor | No `autocomplete`/`inputmode=tel` on address fields. | Add tokens. | ✅ |
| F17 | Low | Profile/Edit | "Saved" banner shows regardless of validity. | Gate on valid save. | ✅ |
| F18 | High | Contact.vue | **No validation** — empty form reports "message sent". | Required + email/phone format; inline errors. | ✅ |
| F19 | Med | Contact.vue | No double-submit prevention. | Disable while sending. | ✅ |
| F20 | Med | ContactField.vue | No `inputmode`/`autocomplete`; message no `maxlength`. | Add. | ✅ |
| F22 | High | NewPatientForm / EditPatientModal | Whitespace-only passes required gating. | `.trim()` before truthiness. | ✅ |
| F23 | High | NewPatientForm | Phone has no format validation (accepts "abc"). | Apply `isPhone`; inline error; block continue. | ✅ |
| F24 | Med | NewPatientForm | Age clamp silently rewrites; no hint; clamp not on blur. | Add helper/error; clamp on blur. | ✅ |
| F27 | Med | MedicationSearchPicker | Case-sensitive match; adds raw query; no combobox ARIA/keyboard. | Case-insensitive + trim; combobox roles + arrow keys. | ✅ |
| F28 | High | MedsSafetyDeclaration | Mandatory consent "checkbox" is a `<span>` — not focusable/keyboard/AT operable → keyboard users can't proceed. | Real checkbox (or role=checkbox + tabindex + Space/Enter + aria-checked). | ✅ |
| F29 | Med | VolumeSelector | Error color hardcoded `#c93838`; no aria wiring. | Use `--danger`; wire ARIA. | ✅ |
| F30 | Low | DoseInline | Daily qty has no max; junk coerced to 0 silently. | Sane max; hint. | ✅ |
| F32 | Med | Cart.vue | Delivery-notes textarea unbound (`v-model` missing) — data dropped. | Bind + `maxlength` + label id. | ✅ |
| F33 | Med | CourierPoaModal | POA ID accepts any length ≥5 — legal form too weak. | `isIsraeliID`; inline error. | ✅ |
| F34 | Med | CourierPoaModal | Name/ID no label assoc/aria; ID no `inputmode`/`maxlength`. | Add. | ✅ |
| F35 | Med | SignaturePad | Canvas sized once; rotate/relayout distorts; no a11y fallback. | Resize handler; `aria-label` + typed fallback. | ✅ |
| F36 | Low | Cart.vue | "Continue to payment" never disabled; can submit incomplete shipping. | Gate on valid shipping/payer. | ✅ |
| F37 | Med | home/RegisterModal | No email/phone format validation; invalid submits silently. | `isEmail`/`isPhone` + inline errors. | ✅ |
| F38 | Low | home/RegisterModal | No `autocomplete`/`maxlength`. | Add. | ✅ |

## 2. Mobile & PWA

| ID | Sev | Location | Problem | Fix | Status |
|----|-----|----------|---------|-----|--------|
| M1 | Critical | app.css + TheNavbar | **No `env(safe-area-inset-top)` anywhere** — the notch draws over the sticky top bar in an installed PWA. | Pad the nav top by the inset; update sticky offsets. | ✅ |
| M2 | High | index.html | `apple-mobile-web-app-capable` missing. | Add it (+ Blade root). | ✅ |
| M3 | High | index.html | No `apple-mobile-web-app-status-bar-style`. | Add it. | ✅ |
| M4 | Med | app.css:985 | Wizard sticky progress hard-codes `top:56px`; breaks once nav gains inset. | `top: calc(56px + env(safe-area-inset-top))`. | ✅ |
| M6 | High | app.css control tokens | Buttons/chips/icon-buttons 28–40px — never bumped to 44px on phones. | Enlarge tappables to ≥44px under `tf-mobile`. | ✅ |
| M7 | Med | QtyStepper | Cart +/- are 30px — core purchase control below target. | ≥40px on mobile. | ✅ |
| M8 | Med | app.css:711 | Wizard ingredient remove/info chips 22px, parts stepper 26px. | Enlarge (give parts room). | ✅ |
| M10 | Low | Catalog sort select | 32px + non-functional. | Wire or remove; enlarge. | ✅ (removed) |
| M11 | Low | Login eye button | ~25px hit area. | Pad to 44px. | ✅ |
| M13 | High | Articles/Index header | Non-wrapping flex row overflows at 375px. | Stack vertically on mobile. | ✅ |
| M14 | Med | Articles/Show hero | Desktop hero padding 40px + h1 34px, not reduced on phones. | Reduce padding/title on mobile. | ✅ |
| M15 | Med | Register grid | Collapses to 2 cols (~150px fields); auth side padding stays desktop. | 1 col + reduced padding on mobile. | ✅ |
| M16 | Med | ChangePassword | Centers in `100vh` ignoring nav+tabbar chrome. | `calc(100vh - chrome)` / top-align. | ✅ |
| M17 | Low | Cart sidebar | Keeps `position:sticky; top:80px` on mobile. | `static` on mobile. | ✅ |
| M18 | Low | Catalog search | Fixed `width:260px`; doesn't fill on mobile. | `width:100%` on mobile. | ✅ |
| M19 | Low | app.css:831 | "one column" rule actually sets `1fr 1fr`; stays 2-up under 440px. | Genuinely 1-col on smallest phones. | ✅ |
| M20 | Low | global | Tap-highlight only removed on a couple elements. | Global under `tf-mobile` + clear `:active`/focus. | ✅ |
| M21 | Low | body | No `overscroll-behavior` — rubber-band reads as "web page". | `overscroll-behavior-y: contain`. | ✅ |
| M22 | Low | app.js | Tier class toggled after bundle load — FOUC risk. | Inline `<head>` matchMedia script. | ✅ |
| M24 | Med | sw.js | Thin offline fallback; uncached deep link → browser error. | Pre-cache an offline document; serve for uncached navigations. | ✅ |
| M25 | Low | manifest | Maskable icon reuses `any` icon without safe-zone padding. | Padded maskable icon; add `id`. | ✅ |

## 3. Accessibility

| ID | Sev | Location | Problem | Fix | Status |
|----|-----|----------|---------|-----|--------|
| A1 | Critical | app.css | No visible focus indicator on any non-input control. | Global `:focus-visible` ring. | ✅ |
| A2 | Critical | TheNavbar, MyFormulas breadcrumb | Nav links/logo are `<a @click>`/`<div>` with no `href`/role — not keyboard/AT operable. | Real `<button>`/`<Link>` with focus + keyboard. | ✅ |
| A3 | Critical | all modals/overlays | No dialog semantics, focus trap, or focus return; closed drawer stays tabbable. | Shared modal primitive: `role=dialog` + `aria-modal` + label + Escape + trap + return + `inert` when closed. | ✅ |
| A4 | High | VideoLightbox, RegisterModal | Escape doesn't close (Lightbox even advertises "Esc"). | Escape handler (via shared primitive). | ✅ |
| A5 | High | CartToast | Add/move toast not announced (no live region). | `role="status" aria-live="polite"`. | ✅ |
| A6 | High | Icon.vue | Decorative icons exposed to AT (no `aria-hidden`/`focusable=false`). | Default `aria-hidden`; optional label prop. | ✅ |
| A7 | High | QtyStepper | Icon-only +/- have no accessible name. | `aria-label` each; live count. | ✅ |
| A8 | High | ProductCard | Looks interactive (cursor+hover) but isn't; hover is JS-only (no keyboard). | Make card a real link/button; CSS `:hover,:focus-within`. | ✅ |
| A9 | Med | SegmentedControl | No group/radio semantics, no arrow-key nav, color-only selection. | `role=radiogroup`/`radio` + roving tabindex. | ✅ |
| A10 | Med | IconAction | Tooltip mouse-only (no focus). | Show on focus too. | ✅ |
| A11 | Med | AppLayout / all pages | No `<main>` landmark, no skip link. | `<main id="main">` + skip-to-content. | ✅ |
| A12 | Med | Catalog | Sort select non-functional but focusable; range input unlabeled. | Remove dead sort or wire; `aria-label` range. | ✅ |
| A13 | Med | VideoLightbox | Play is a `<div>`; decorative SVGs unhidden; close uses `title`. | Real button; `aria-hidden`; `aria-label`. | ✅ |
| A14 | Low | Home | Potential multiple `<h1>` (hero + promo slides + greeting). | One `<h1>` per page; demote others. | ✅ |
| A16 | High | `--ink-4 #8a9384` on white (placeholder, drawer headers) | 3.19:1 — fails AA. | Darken to ≥ ~`#6f776a`. | ✅ |
| A17 | Med | `--ink-4` on `--accent-tint` | ~2.8:1 — fails. | Use `--accent-ink`/`--ink-2` on tints. | ✅ |
| A18 | Med | `--warning #a87521` on white | ~4.06:1 — fails AA normal. | Darken to ~`#8a5f16`. | ✅ |
| A19 | Low | `--muted #908b7d` | 3.40:1, unused dead token. | Remove. | ✅ |
| A20 | Med | app.css global animations | Not gated behind `prefers-reduced-motion`. | Global reduce-motion guard. | ✅ |

## 4. UX states & feedback

| ID | Sev | Location | Problem | Fix | Status |
|----|-----|----------|---------|-----|--------|
| U1 | High | PriceRail (cart remove / move-to-pending) | Destructive, no confirm, no undo. | Undo toast ("הוסר · בטל"). | ✅ |
| U2 | High | Cart checkout, RegisterModal, lists | No async/loading/processing states. | Processing state (disable + spinner) on submits. | ✅ |
| U3 | Med | Cart success popup, RegisterModal | Backdrop click navigates away / discards a filled form. | Don't treat backdrop as confirm on data-bearing modals. | ✅ |
| U5 | Low | MyFormulas | Delete confirms (good) but no success feedback. | "נמחק" toast. | ✅ |
| U6 | Med | several fields | `outline:none` with no replacement focus style. | Focus ring on every field. | ✅ (via A1) |

## 5. Design system & general improvements

| ID | Sev | Area | Improvement | Status |
|----|-----|------|-------------|--------|
| D1 | Strategic | whole app | **Dark mode** — none today; high value for an installed PWA (OLED, night use); low cost given centralized `:root` tokens. | ✅ |
| D2 | Low | a few rules | Remaining physical left/right → logical properties. | ✅ |
| D6 | Med | scattered | Color escaping tokens (`#c93838` ≠ `--danger`, status dot hexes, `oklch`). Consolidate into semantic tokens. | ✅ |
| D7 | Low | modals | Radius inconsistency (6px tokens vs 10/14px inline). | ✅ |
| D4/D5 | Low | inline styles | Ad-hoc px type/spacing. Introduce scale tokens; migrate high-impact areas. | ◐ tokens added; key areas migrated |

---

## Remediation log

Implemented in waves, each built and verified:

1. **Foundation (app.css + index.html + PWA):** global `:focus-visible` ring; reduced-motion guard; global tap-highlight + `overscroll-behavior`; 44px touch targets on mobile; `env(safe-area-inset-top)` on the nav + wizard offsets; contrast fixes (`--ink-4`, `--warning`) + removed dead `--muted`; input-zoom via media query; **dark mode** token block + toggle; apple PWA meta; inline tier-class script; consolidated color tokens.
2. **Shared components:** accessible `FormField` wrapper (id/for + aria-invalid/describedby + role=alert); shared `Modal` primitive (dialog/aria-modal/label/Escape/focus-trap/return/inert) applied to every overlay; `Icon` aria-hidden by default; keyboard-operable nav + logo; `QtyStepper`/`SegmentedControl`/`CartToast`/`IconAction`/`MedsSafetyDeclaration` semantics; `<main>` + skip link.
3. **Forms:** every form wired to validators with accessible inline errors, correct input types/inputmode/autocomplete/enterkeyhint, required indicators, focus-on-error, disable-while-submitting, strengthened password + Israeli-ID rules.
4. **Per-screen mobile + UX states:** Articles list/detail, Register grid, ChangePassword centering, Cart sidebar/search, Catalog sort/range, ProductCard, undo-on-remove, backdrop-click safety, success toasts.

See git history from this date for the per-wave commits.
