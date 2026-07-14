# i18n guide — the English developer overlay

The product ships **Hebrew only**. English exists purely as a **developer aid**
so non-Hebrew-speaking developers can read and understand the system. It is
**not** a user-facing feature.

## How to use it

Add `?lang=en` to any URL:

```
http://localhost:5173/compounding?lang=en    → English
http://localhost:5173/compounding             → Hebrew (default)
```

There is **no on-screen toggle** — activation is URL-only, by design. The
layout stays **RTL in both languages**; only the words change, so the English
view maps 1:1 onto the real Hebrew screen.

## How it works

`resources/js/i18n/overlay.js` runs once at boot (from `app.js`). In Hebrew mode
it's a complete no-op. In English mode it walks the rendered DOM, replaces any
text / `placeholder` / `title` / `aria-label` / `alt` whose Hebrew value matches
a dictionary key, and a `MutationObserver` keeps translating as Vue/Inertia
re-render and navigate. Matching is **whole-value exact** (never substring, which
would corrupt words); interpolated number/unit strings are handled by the
curated regexes in `patterns.js`. Anything not in the dictionary **stays
Hebrew** — the intended silent fallback, so partial coverage is always safe.

Components never import or wrap anything. That's the whole point: it's used
across the entire app with **zero maintenance burden on feature code**.

## Maintaining translations — the one place

All translations live in **`resources/js/i18n/dictionary.js`**, a single flat
map of exact Hebrew source string → English:

```js
export default {
    "הכנת פורמולה": "Formula compounding",
    "שלח לתשלום": "Send for payment",
    // …
};
```

To translate a new screen or feature:

1. Open it with `?lang=en` and note the Hebrew strings still showing (they have
   no entry yet).
2. Add `"exact Hebrew as it appears": "English"` pairs to `dictionary.js`
   (keep the file sorted by key). The Hebrew key must match **exactly** —
   same wording, punctuation, and spacing.
3. Reload with `?lang=en`. Done — it now works everywhere that string appears.

### What to translate

Only what helps a developer **understand the system's functionality** —
actions, states, wizard/flow mechanics, form fields, validation and status
copy. You do **not** need to translate every content or navigation label
(e.g. a section title like "מאמרים"); leaving it Hebrew is fine. Don't chase
100% coverage — chase the functional parts.

### Interpolated strings

Strings assembled at runtime with numbers/units (e.g. `20 × ביום`) can't be a
single dictionary key. Add a narrow regex to `patterns.js` instead — a few are
already there (`×/day`, capsules, grams, ml). Keep each pattern bounded so it
can't touch unrelated text.

## Don't

- Don't add an on-screen language switch — activation is `?lang=en` only.
- Don't wrap strings in components or reach for vue-i18n — this is a dev overlay,
  not end-user i18n. The end-user product is Hebrew.
- Don't flip `dir` — the overlay keeps `dir="rtl"` in English on purpose.
- Don't edit the overlay engine to translate a string — add it to the dictionary.
