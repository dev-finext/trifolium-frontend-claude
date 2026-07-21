// Volume + dose rules for the compounding lab (wizard step 3).
// Ported verbatim from the prototype's window.VOLUME_RULES / window.DOSE_RULES /
// window.DOSE_UNIT_LABEL globals — the shapes are a contract shared with the
// other wizard steps, so they must not change.

// ─────────────────────────────────────────────────────────────
// VOLUME RULES — per formula type. Drives the unified VolumeSelector.
// ─────────────────────────────────────────────────────────────
export const VOLUME_RULES = {
    tincture: {
        unit: 'ml',
        options: [50, 100, 125, 200, 250, 300, 500, 1000],
        allowOther: false,
        min: 50,
        step: 1,
    },
    decoction: {
        unit: 'ml',
        options: [100, 200, 300, 400, 500, 600],
        allowOther: false,
        min: 100,
        step: 100,
    },
    capsule: {
        unit: 'קפסולות',
        options: [100, 200, 300, 400, 500],
        allowOther: false,
        min: 100,
        step: 100,
    },
    powder: {
        unit: 'גרם',
        options: [100, 150, 200],
        allowOther: false,
        min: 100,
    },
    tea: { unit: 'גרם', options: [100, 150, 200], allowOther: false, min: 100 },
    gel: { unit: 'מ״ל', options: [100], allowOther: false, min: 100 },
    cream: { unit: 'מ״ל', options: [100], allowOther: false, min: 100 },
    eoil: { unit: 'מ״ל', options: [50, 100], allowOther: false, min: 50 },
    ioil: {
        unit: 'מ״ל',
        options: [50, 100, 125, 200, 250, 300, 500, 1000],
        allowOther: false,
        min: 50,
        step: 1,
    },
};

// ─────────────────────────────────────────────────────────────
// DOSE RULES — per formula type. The daily-dose units adapt to the
// preparation form: tincture → drops/ml, capsules → capsules,
// powder/tea → spoons/grams, topicals → applications, etc.
// ─────────────────────────────────────────────────────────────
export const DOSE_UNIT_LABELS = {
    drops: 'טיפות',
    ml: 'מ״ל',
    capsules: 'כמוסות',
    grams: 'גרם',
    spoons: 'כפיות',
    cups: 'כוסות',
    apps: 'מריחות',
};

export const DOSE_RULES = {
    tincture: {
        units: ['drops', 'ml'],
        default: { qty: 20, unit: 'drops', perDay: 3 },
    },
    decoction: {
        units: ['ml', 'cups'],
        default: { qty: 200, unit: 'ml', perDay: 2 },
    },
    capsule: {
        units: ['capsules'],
        default: { qty: 2, unit: 'capsules', perDay: 2 },
    },
    powder: {
        units: ['spoons', 'grams'],
        default: { qty: 1, unit: 'spoons', perDay: 2 },
    },
    tea: {
        units: ['cups', 'spoons', 'grams'],
        default: { qty: 2, unit: 'cups', perDay: 2 },
    },
    gel: { units: ['apps'], default: { qty: 2, unit: 'apps', perDay: 2 } },
    cream: { units: ['apps'], default: { qty: 2, unit: 'apps', perDay: 2 } },
    eoil: { units: ['drops'], default: { qty: 4, unit: 'drops', perDay: 2 } },
    ioil: {
        units: ['apps', 'ml'],
        default: { qty: 1, unit: 'apps', perDay: 2 },
    },
};

/** Hebrew display label for a dose-unit id (falls back to the raw id). */
export const DOSE_UNIT_LABEL = (id) => DOSE_UNIT_LABELS[id] || id || '';
