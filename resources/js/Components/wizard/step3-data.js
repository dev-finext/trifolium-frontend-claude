// Step-3-only constant maps + tiny pure helpers that are NOT part of the
// shared wizard contract (wizard-rules.js / wizard-lib.js). Everything here is
// local to the compounding lab's presentation layer.

// Vivid botanical palette — one hue per ingredient. Shared lightness/chroma so
// the set reads as one lively botanical family (matches the bottle layers).
export const INGREDIENT_PALETTE = [
    '#5aad52', '#c9952a', '#4a8ab5', '#c06040', '#8a5090',
    '#3f9d8c', '#b5683f', '#6f8f3a', '#9a4f6b', '#4f7bb0',
];

// Chip tones — "רך וממולא": soft tinted circle, icon in the matching hue.
export const CHIP_TONE = {
    info:   { bg: 'var(--accent-tint)', fg: 'var(--accent)' },
    warn:   { bg: '#f4ecda',            fg: 'var(--warning)' },
    danger: { bg: 'var(--danger-tint)', fg: 'var(--danger)' },
};

// Lighten/darken a #rrggbb hex toward white (amt>0) or black (amt<0).
// Used to shade each bottle liquid layer into a glassy gradient.
export const bottleLighten = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    r = Math.round(r + (t - r) * a);
    g = Math.round(g + (t - g) * a);
    b = Math.round(b + (t - b) * a);
    return `rgb(${r},${g},${b})`;
};

// Wavy crest mask for the top of every liquid layer in the bottle chart.
export const TF_WAVE_URI =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='14'%3E%3Cpath d='M0 8 Q10 1 20 8 T40 8 V14 H0 Z' fill='%23000'/%3E%3C/svg%3E";
