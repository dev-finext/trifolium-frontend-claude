// ============================================================================
// Trifolium · English overlay — DEVELOPER AID ONLY
// ----------------------------------------------------------------------------
// WHAT THIS IS
//   The product ships in Hebrew. This layer lets non-Hebrew-speaking developers
//   read the whole UI in English to understand the system — it is NOT a
//   user-facing feature. There is deliberately NO on-screen toggle. It is
//   activated by URL only:
//
//       <app>/?lang=en     → English overlay on
//       <app>/             → Hebrew (default, untouched)
//
//   The layout stays RTL in both languages — only the words change — so the
//   English view maps 1:1 onto the real Hebrew screen.
//
// WHY AN OVERLAY (and not vue-i18n / $t everywhere)
//   Because it's a dev aid used across the whole app, the design goal is
//   ZERO maintenance burden on feature code: components never import or wrap
//   anything. Translations live in ONE place — dictionary.js. Add a
//   "Hebrew": "English" pair and it works everywhere, forever. Nothing to wire.
//
// HOW IT WORKS
//   • Hebrew mode: this is a complete no-op. The live app is never touched.
//   • English mode: we walk the rendered DOM and translate, then a
//     MutationObserver keeps translating as Vue/Inertia re-render and navigate.
//       – text nodes whose (trimmed) value is a key in the dictionary
//       – the placeholder / title / aria-label / alt attributes
//       – document.title
//   • Matching is WHOLE-NODE EXACT (never blind substring replacement, which
//     would corrupt words). Interpolated strings that don't match exactly are
//     handled by the curated PATTERNS (units, dosing) in ./patterns.js.
//     Anything with no match is left in Hebrew — the intended silent fallback,
//     which is why partial dictionary coverage is always safe.
//
// MAINTENANCE
//   Translate a new screen/feature by adding pairs to dictionary.js. You only
//   need the strings relevant to understanding the system — not every label.
//   Missing keys simply stay Hebrew. See docs/I18N-GUIDE.md.
// ============================================================================
import DICT from '@/i18n/dictionary.js';
import { PATTERNS } from '@/i18n/patterns.js';

const HEB = /[֐-׿]/;
const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

/** Is the English overlay requested? URL `?lang=en` only. */
export function isEnglishRequested() {
    try {
        return new URLSearchParams(window.location.search).get('lang') === 'en';
    } catch {
        return false;
    }
}

/**
 * Translate a raw string. Returns the translation, or null when we have
 * nothing (caller then leaves the original Hebrew in place).
 */
function translate(raw) {
    if (!raw || !HEB.test(raw)) return null;
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    const key = raw.slice(lead.length, raw.length - trail.length);
    if (key === '') return null;

    // 1) exact whole-value match (also try collapsing internal whitespace —
    //    DOM text often carries newlines/tabs from template indentation).
    if (Object.prototype.hasOwnProperty.call(DICT, key)) return lead + DICT[key] + trail;
    const collapsed = key.replace(/\s+/g, ' ');
    if (collapsed !== key && Object.prototype.hasOwnProperty.call(DICT, collapsed)) {
        return lead + DICT[collapsed] + trail;
    }

    // 2) curated interpolation patterns (units, dosing, …)
    let out = key;
    let hit = false;
    for (const [re, rep] of PATTERNS) {
        const next = out.replace(re, rep);
        if (next !== out) { out = next; hit = true; }
    }
    if (hit) return lead + out + trail;

    return null; // silent Hebrew fallback
}

function handleTextNode(node) {
    const v = node.nodeValue;
    if (!v || !HEB.test(v)) return;
    if (node.parentNode && SKIP_TAGS[node.parentNode.nodeName]) return;
    const t = translate(v);
    if (t !== null && t !== v) node.nodeValue = t;
}

function handleElementAttrs(el) {
    if (!el || el.nodeType !== 1) return;
    for (const a of ATTRS) {
        if (!el.hasAttribute(a)) continue;
        const cur = el.getAttribute(a);
        if (!HEB.test(cur)) continue;
        const t = translate(cur);
        if (t !== null && t !== cur) el.setAttribute(a, t);
    }
}

function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { handleTextNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) handleElementAttrs(root);

    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const batch = [];
    let n;
    while ((n = tw.nextNode())) batch.push(n);
    batch.forEach(handleTextNode);

    if (root.querySelectorAll) {
        root.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(handleElementAttrs);
    }
}

function runFullPass() {
    walk(document.body);
    const t = translate(document.title);
    if (t !== null && t !== document.title) document.title = t;
}

/**
 * Boot the overlay. Safe to call unconditionally from app.js — it returns
 * immediately unless `?lang=en` is present.
 */
export function initEnglishOverlay() {
    if (typeof window === 'undefined' || !isEnglishRequested()) return;

    // Announce the language to assistive tech / the browser. dir stays "rtl".
    document.documentElement.lang = 'en';

    const boot = () => {
        runFullPass();
        // Keep translating as Vue/Inertia mutate the tree (renders, navigation).
        const obs = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === 'characterData') handleTextNode(m.target);
                else if (m.type === 'attributes') handleElementAttrs(m.target);
                else if (m.type === 'childList') m.addedNodes.forEach(walk);
            }
        });
        obs.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ATTRS,
        });
        // Safety re-passes after fonts / late async renders.
        setTimeout(runFullPass, 400);
        setTimeout(runFullPass, 1200);
    };

    if (document.body) boot();
    else document.addEventListener('DOMContentLoaded', boot);
}
