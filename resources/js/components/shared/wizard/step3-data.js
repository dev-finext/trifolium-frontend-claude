// Step-3-only constant maps + tiny pure helpers that are NOT part of the
// shared wizard contract (wizard-rules.js / wizard-lib.js). Everything here is
// local to the compounding lab's presentation layer.

// Vivid botanical palette — one hue per ingredient. Shared lightness/chroma so
// the set reads as one lively botanical family (matches the bottle layers).
export const INGREDIENT_PALETTE = [
    '#5aad52',
    '#c9952a',
    '#4a8ab5',
    '#c06040',
    '#8a5090',
    '#3f9d8c',
    '#b5683f',
    '#6f8f3a',
    '#9a4f6b',
    '#4f7bb0',
];

// Chip tones — "רך וממולא": soft tinted circle, icon in the matching hue.
export const CHIP_TONE = {
    info: { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
    warn: { bg: '#f4ecda', fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-tint)', fg: 'var(--danger)' },
};

// Lighten/darken a #rrggbb hex toward white (amt>0) or black (amt<0).
