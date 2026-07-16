// Shared pure helpers + constant maps for the compounding lab (wizard step 3).
// Ported 1:1 from the prototype's module-level helpers.
import { FORMULA_TYPES, KNOWN_INTERACTIONS } from '@/data/mock';

// ─────────────────────────────────────────────────────────────
// Herb ↔ formula-type compatibility + drug-interaction lookups
// ─────────────────────────────────────────────────────────────
export const isHerbCompatible = (herb, typeId) => {
    const ft = FORMULA_TYPES.find((t) => t.id === typeId);

    if (!ft) {
        return true;
    }

    return ft.compat.includes(herb.category);
};

export const findInteractions = (herbId, medsText) => {
    if (!medsText) {
        return [];
    }

    return KNOWN_INTERACTIONS.filter(
        (k) => k.herbId === herbId && k.drug.test(medsText),
    );
};

/** The first medication name in the patient's meds text that matches a known interaction. */
export const matchedDrug = (herbId, medsText) => {
    const hit = findInteractions(herbId, medsText)[0];

    if (!hit) {
        return null;
    }

    return (medsText && medsText.match(hit.drug)?.[0]) || 'תרופה';
};

export const unitForHerb = (form) =>
    /אבקה|שורש|פירות|פטריה|זרעים|עלים|פרחים|מיובש/.test(form) ? 'g' : 'ml';

// ─────────────────────────────────────────────────────────────
// Ingredient search matching.
// Rule (per spec): match only the START of a word — never the middle — so
// every extra character narrows the result set further. Matching is
// script-aware: a Latin-letter query is tested against the Latin botanical
// name (and the pinyin reading only in Chinese mode), a Hebrew query against
// the Hebrew name, and a Chinese-character query against the Chinese name.
// Tone marks and case are stripped so "ren" matches "Rén".
// ─────────────────────────────────────────────────────────────
export const tfNorm = (s) =>
    (s || '')
        .toString()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip diacritics / pinyin tone marks
        .toLowerCase()
        .trim();

export const herbScript = (query) => {
    const raw = (query || '').trim();

    if (/[֐-׿]/.test(raw)) {
        return 'heb';
    } // Hebrew

    if (/[㐀-鿿]/.test(raw)) {
        return 'cjk';
    } // Chinese characters

    return 'lat'; // Latin letters (incl. pinyin)
};

// The field(s) a query of a given script should be tested against. Pinyin is
// Latin-script, so it is only searchable in Chinese mode — otherwise typing
// "S" in Western mode would surface herbs by their pinyin reading (e.g.
// Withania / "Shuì Qié") alongside the Latin S-names.
export const herbFieldsForScript = (herb, script, allowPinyin) => {
    if (script === 'heb') {
        return [herb.heb];
    }

    if (script === 'cjk') {
        return herb.cn ? [herb.cn.split('·')[0]] : [];
    }

    const fields = [herb.lat];

    if (allowPinyin && herb.cn) {
        fields.push(herb.cn.split('·').pop());
    }

    return fields;
};

// The single field that determines sort order for the current query — the
// herb's displayed primary name in the typed script.
export const herbPrimaryField = (herb, script, isChinese) => {
    if (script === 'heb') {
        return herb.heb;
    }

    if (script === 'cjk') {
        return herb.cn ? herb.cn.split('·')[0] : '';
    }

    return isChinese && herb.cn ? herb.cn.split('·').pop() : herb.lat;
};

export const startsWithToken = (field, q) => {
    const norm = tfNorm(field);

    if (!norm) {
        return false;
    }

    if (norm.startsWith(q)) {
        return true;
    }

    return norm.split(/[\s\-·]+/).some((w) => w && w.startsWith(q));
};

export const herbMatchesQuery = (herb, query, { allowPinyin = true } = {}) => {
    const q = tfNorm(query);

    if (!q) {
        return true;
    }

    const script = herbScript(query);

    return herbFieldsForScript(herb, script, allowPinyin).some((f) =>
        startsWithToken(f, q),
    );
};

// Order matches so that herbs whose PRIMARY name begins with the query lead,
// then alphabetically — so the list tracks the typing exactly.
export const sortHerbsByQuery = (herbs, query, isChinese) => {
    const q = tfNorm(query);

    if (!q) {
        return herbs;
    }

    const script = herbScript(query);

    return herbs.slice().sort((a, b) => {
        const pa = tfNorm(herbPrimaryField(a, script, isChinese));
        const pb = tfNorm(herbPrimaryField(b, script, isChinese));
        const ra = pa.startsWith(q) ? 0 : 1;
        const rb = pb.startsWith(q) ? 0 : 1;

        if (ra !== rb) {
            return ra - rb;
        }

        return pa.localeCompare(pb);
    });
};

// ─────────────────────────────────────────────────────────────
// Number formatting
// ─────────────────────────────────────────────────────────────
/** Format a percentage: whole integers only. */
export const fmtPct = (n) => String(Math.round(n));

/** Format a parts amount: one decimal max, integer when whole. */
export const fmtPart = (n) => {
    if (!isFinite(n)) {
        return '0';
    }

    const r = Math.round(n * 10) / 10;

    return Number.isInteger(r) ? String(r) : r.toFixed(1);
};

// ─────────────────────────────────────────────────────────────
// Quantity reflow — the parts model
// ─────────────────────────────────────────────────────────────
// Sync legacy `qty` field on ingredients from pct × formulaVolume.
export const reflowQty = (ingredients, volume) =>
    ingredients.map((i) => ({
        ...i,
        qty: Math.max(0, Math.round(((+i.pct || 0) / 100) * (volume || 0))),
    }));

// Chinese (parts) mode: each ingredient carries a relative `parts` count.
// Derive pct (parts ÷ Σparts) and qty (that fraction × formula volume).
// Volume ÷ Σparts = the physical amount of ONE part.
export const reflowParts = (ingredients, volume) => {
    const sum = ingredients.reduce((s, i) => s + (+i.parts || 0), 0);

    if (sum <= 0) {
        return ingredients.map((i) => ({ ...i, pct: 0, qty: 0 }));
    }

    // Largest-remainder rounding so the displayed percentages sum to exactly 100.
    const raw = ingredients.map((i) => ((+i.parts || 0) / sum) * 100);
    const floor = raw.map((r) => Math.floor(r));
    let remainder = 100 - floor.reduce((s, f) => s + f, 0);
    const order = raw
        .map((r, idx) => ({ idx, frac: r - Math.floor(r) }))
        .sort((a, b) => b.frac - a.frac);
    const pcts = [...floor];

    for (let k = 0; k < order.length && remainder > 0; k++) {
        pcts[order[k].idx] += 1;
        remainder--;
    }

    return ingredients.map((i, idx) => ({
        ...i,
        pct: pcts[idx],
        qty: Math.round(((+i.parts || 0) / sum) * (volume || 0)),
    }));
};

// ─────────────────────────────────────────────────────────────
// Tincture evaporation options (Zone A subsection)
// ─────────────────────────────────────────────────────────────
export const EVAPORATION_OPTIONS = [
    { id: 'none', label: 'ללא נידוף', hint: 'תמצית באלכוהול בלבד' },
    { id: 'glycerin', label: 'גליצרין', hint: 'נושא ניטרלי, מתאים לרגישים' },
    { id: 'honey', label: 'גליצרין + דבש', hint: 'מיתון טעם והרגעת קיבה' },
    { id: 'carob', label: 'גליצרין + חרובים', hint: 'מתיקות עדינה ועשירה' },
    { id: 'molasses', label: 'גליצרין + מולאסה', hint: 'מינרלים ושמרי ברזל' },
];

// Carrier options shown only AFTER the user opts to evaporate.
export const CARRIER_OPTIONS = EVAPORATION_OPTIONS.filter(
    (o) => o.id !== 'none',
);

// Package split (powder / tea): minimum grams (or capsules) per package.
export const MIN_PER_PACKAGE = 10;

// ─────────────────────────────────────────────────────────────
// Per-type "apothecary pigment" palette — one hue per preparation.
// All swatches share lightness + chroma; only the hue changes, so the
// grid reads as one harmonious botanical set. Used ONLY by the formula-
// type cards (the rest of the step keeps the house green).
// ─────────────────────────────────────────────────────────────
export const TYPE_HUE = {
    tincture: 74,
    capsule: 46,
    powder: 96,
    tea: 146,
    decoction: 28,
    gel: 192,
    cream: 14,
    eoil: 300,
    ioil: 122,
};

export const typePig = {
    ink: (id) => `oklch(0.50 0.105 ${TYPE_HUE[id] ?? 146})`,
    inkDeep: (id) => `oklch(0.42 0.095 ${TYPE_HUE[id] ?? 146})`,
    solid: (id) => `oklch(0.585 0.115 ${TYPE_HUE[id] ?? 146})`,
    tint: (id) => `oklch(0.965 0.018 ${TYPE_HUE[id] ?? 146})`,
    tintMid: (id) => `oklch(0.935 0.034 ${TYPE_HUE[id] ?? 146})`,
    tintStrong: (id) => `oklch(0.90 0.052 ${TYPE_HUE[id] ?? 146})`,
    line: (id) => `oklch(0.80 0.055 ${TYPE_HUE[id] ?? 146})`,
};

// Short explanation of each preparation form — shown in the hover tooltip
// behind the small "i" badge on every type card.
export const TYPE_INFO = {
    tincture:
        'תמצית מרוכזת של הצמחים המופקת באלכוהול. נשמרת היטב לאורך זמן, נספגת מהר ונמדדת בטיפות. ניתן לנדף את האלכוהול ולהוסיף נושא.',
    capsule:
        'אבקת צמחים טחונה דק וממולאת בקפסולות. פותרת טעם מר, שומרת על מינון אחיד ונוחה לנטילה ללא הכנה.',
    powder: 'תערובת צמחים טחונה דק לערבוב במים, ביוגורט או בדבש. מאפשרת מינון גמיש וספיגה מהירה.',
    tea: 'תערובת עלים ופרחים יבשים לחליטה במים חמים. עדינה ומתאימה לשתייה יומיומית, למערכת העצבים ולעיכול.',
    decoction:
        'מרתח מסורתי — בישול ארוך של שורשים, קליפות ופירות במים. שיטת ההכנה הקלאסית ברפואה הסינית לפורמולות חזקות.',
    gel: 'בסיס ג׳ל מימי לשימוש מקומי על העור. נספג מהר, אינו שומני ומתאים לאזורים דלקתיים.',
    cream: 'בסיס קרם שומני-מימי לשימוש מקומי. מזין, מספק לחות ומתאים לעור יבש ולטיפול ממושך.',
    eoil: 'תזקיק ארומטי מרוכז של שמנים נדיפים. לשאיפה, לעיסוי בדילול או למפזר ריח — בעל ריכוז גבוה מאוד.',
    ioil: 'צמחים מושרים בשמן נושא (כגון זית או שקדים). לעיסוי ולטיפוח העור, עם ספיגה איטית ועדינה.',
};

// ─────────────────────────────────────────────────────────────
// Preset-formula picker — tab definitions for the three libraries
// (plus the free-pour shelf).
// ─────────────────────────────────────────────────────────────
export const PICKER_TABS = [
    {
        id: 'preset',
        label: 'פורמולה סינית מוכנה',
        editable: false,
        eyebrow: 'ספריית פורמולות קלאסיות',
        title: 'בחר פורמולה מוכנה מראש',
        sub: 'פורמולות קלאסיות עם יחסי בסיס קבועים — ניתן להוסיף רכיבים נוספים, אך לא לשנות את יחסי הבסיס.',
        info: 'פורמולות קלאסיות מוכנות עם יחסי בסיס קבועים. הפורמולה כבר מוכנה — יחסי הבסיס נעולים ואינם ניתנים לשינוי. לאחר הטעינה ניתן רק להוסיף רכיבים נוספים מעל הבסיס.',
    },
    {
        id: 'mine',
        label: 'הפורמולות שלי',
        editable: true,
        eyebrow: 'הספרייה האישית שלך',
        title: 'טען מהפורמולות שלי',
        sub: 'הפורמולות ששמרת — נטענות כנקודת פתיחה הניתנת לעריכה מלאה.',
        info: 'הפורמולות ששמרת בעבר בחשבונך. נטענות כנקודת פתיחה הניתנת לעריכה מלאה — ניתן לשנות רכיבים, מינונים ונפח לפני ההזמנה.',
    },
    {
        id: 'system',
        label: 'פורמולות מערכת',
        editable: true,
        eyebrow: 'תבניות בסיס מובנות',
        title: 'טען מפורמולות המערכת',
        sub: 'תבניות בסיס שהוכנו על־ידי צוות המערכת — נטענות כנקודת פתיחה הניתנת לעריכה.',
        info: 'תבניות בסיס שהוכנו מראש על־ידי צוות המערכת לנוחות המטפלים. נטענות כנקודת פתיחה הניתנת לעריכה מלאה והתאמה אישית.',
    },
    {
        id: 'freepour',
        label: 'פורמולה במזיגה חופשית',
        editable: false,
        kind: 'freepour',
        eyebrow: 'מוצרי המדף — במזיגה אישית',
        title: 'בחר מוצר מדף למזיגה חופשית',
        sub: 'כל מוצרי המדף, נמזגים בנפח לבחירתך. הרכב הבסיס נעול — ניתן להוסיף רכיבים נוספים, אך לא לשנות את הרכב המוצר.',
        info: 'מוצרי המדף המוכנים, זמינים כאן למזיגה חופשית בכל נפח שתבחר. הרכב המוצר נעול ואינו ניתן לשינוי — בדיוק כמו בפורמולה הסינית המוכנה. לאחר הטעינה ניתן רק להוסיף רכיבים נוספים מעל הבסיס.',
    },
];
