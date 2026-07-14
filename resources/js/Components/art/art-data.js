// Shared non-component data for the decorative art components
// (ported from the design handoff's placeholders.jsx + covers.jsx).

// ── Palettes for the placeholder illustrations (placeholders.jsx) ─────
export const PALETTES = {
    herb:   { bg1: '#dfe6d2', bg2: '#a5b495', ink: '#3d5a3a', accent: '#7d4a2a', light: '#f3f0e2' },
    earth:  { bg1: '#e8dfcb', bg2: '#a59478', ink: '#5a4128', accent: '#3d5a3a', light: '#f5ede0' },
    cool:   { bg1: '#dde4e7', bg2: '#8b9aa3', ink: '#2c4a6b', accent: '#3d5a3a', light: '#eaeff1' },
    warm:   { bg1: '#ecd9c4', bg2: '#b89272', ink: '#7a4628', accent: '#5a3a2a', light: '#f4e6d4' },
    green:  { bg1: '#d8e1c8', bg2: '#7e9268', ink: '#2e4527', accent: '#7d4a2a', light: '#ebf0df' },
    slate:  { bg1: '#d0d6d0', bg2: '#7d8a78', ink: '#374538', accent: '#6a503a', light: '#e2e6e0' },
    ink:    { bg1: '#c2caca', bg2: '#5a6b6e', ink: '#1f2e1d', accent: '#a87521', light: '#dde3e3' },
};

// ── Cover palette from a hue (covers.jsx) ─────────────────────────────
// Light covers (events / articles) read dark line-art on tinted paper.
// Video covers run dark so the white play button + duration badge pop.
export function coverPalette(h, dark) {
    if (dark) {
        return {
            bg1: `hsl(${h} 24% 27%)`, bg2: `hsl(${h} 32% 13%)`,
            ink: '#f3efe6', soft: 'rgba(243,239,230,0.62)', accent: '#e6a36b',
        };
    }
    return {
        bg1: `hsl(${h} 40% 94%)`, bg2: `hsl(${h} 32% 84%)`,
        ink: `hsl(${h} 30% 29%)`, soft: `hsl(${h} 20% 50%)`, accent: '#a4572f',
    };
}

// Motif keys, in the source's COVER_MOTIFS declaration order — fallbackFor()
// indexes into this list, so the order must not change.
export const MOTIF_KEYS = [
    'conference', 'adaptogen', 'newherbs', 'webinar', 'welcome',
    'compounding', 'ingredients', 'patients', 'catalog', 'orders',
    'sleep', 'molecule', 'consult', 'coneflower', 'liver', 'safety', 'balance',
];

// ── id → motif + hue (each item personal & topic-specific) ────────────
export const COVER_MAP = {
    // Events / updates
    e1: { m: 'conference',  h: 125 },
    e2: { m: 'adaptogen',   h: 32 },
    e3: { m: 'newherbs',    h: 196 },
    e4: { m: 'webinar',     h: 276 },
    // Tutorial videos (dark)
    v1: { m: 'welcome',     h: 196 },
    v2: { m: 'compounding', h: 150 },
    v3: { m: 'ingredients', h: 122 },
    v4: { m: 'patients',    h: 212 },
    v5: { m: 'catalog',     h: 35 },
    v6: { m: 'orders',      h: 262 },
    // Articles
    a1: { m: 'sleep',       h: 236 },
    a2: { m: 'molecule',    h: 38 },
    a3: { m: 'consult',     h: 188 },
    a4: { m: 'adaptogen',   h: 26 },
    a5: { m: 'coneflower',  h: 322 },
    a6: { m: 'liver',       h: 150 },
    a7: { m: 'safety',      h: 4 },
    a8: { m: 'balance',     h: 288 },
    // Chinese-medicine articles
    c1: { m: 'consult',     h: 8 },
    c2: { m: 'ingredients', h: 20 },
    c3: { m: 'patients',    h: 350 },
    c4: { m: 'balance',     h: 16 },
};

const FALLBACK_HUES = [140, 30, 200, 270, 100, 320, 50, 180];

// Deterministic motif + hue for ids missing from COVER_MAP.
export function fallbackFor(id) {
    let s = 0; const str = String(id || '');
    for (let i = 0; i < str.length; i++) s = (s + str.charCodeAt(i) * (i + 7)) % 360;
    return { m: MOTIF_KEYS[s % MOTIF_KEYS.length], h: FALLBACK_HUES[s % FALLBACK_HUES.length] };
}
