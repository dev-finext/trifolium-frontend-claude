// Shared order model — the row→order builder and the "last opened order"
// hand-off used by the Orders list, the home dashboard and the Order view.
//
// The design prototype exposed these as `window.TF_buildOrderFromRow` and
// `window.__tfLastOrder`; here they are plain module exports. The sender
// (a list row's click handler) calls `setLastOrder(buildOrderFromRow(row))`
// before visiting the 'order' route, and the Order view reads it back with
// `getLastOrder()` — falling back to a realistic order so the page never
// renders empty.

// ⚠️ DEMO DATA — this fallback order is sample content, not part of the app.
// It exists so /orders/:id never renders empty when opened directly without
// a hand-off. In production the Order view fetches the order by id from the
// backend; delete this object (and the fallback branch) then.
export const FALLBACK_ORDER = {
    id: 'TF-2850',
    date: 'היום, 09:42',
    paymentRoute: 'patient',
    status: 'ממתין לתשלום',
    patientLabel: 'יעל ברק',
    formula: {
        name: 'פורמולה להרגעה ושינה',
        typeId: 'tincture',
        typeHeb: 'תמיסה',
        unit: 'מ״ל',
        totalVol: '200 מ״ל',
        ingredients: [
            { heb: 'פסיפלורה', lat: 'Passiflora incarnata', qty: 56, pct: 28 },
            { heb: 'מליסה רפואית', lat: 'Melissa officinalis', qty: 44, pct: 22 },
            { heb: 'אשווגנדה', lat: 'Withania somnifera', qty: 66, pct: 33 },
            { heb: 'לבנדר', lat: 'Lavandula angustifolia', qty: 34, pct: 17 },
        ],
        externalNotes: 'יש לטלטל את הבקבוק היטב לפני כל שימוש. לשמור במקרר. מנה ראשונה: ערב, חצי שעה לפני השינה.',
        internalNotes: 'אריזת זכוכית כהה עם מטפטף שחור. תווית לבנה — הדפס שם הפורמולה ב־14pt.',
    },
    pricing: { base: 280, practitionerDisc: 56, patientDisc: 22, pointsApplied: 0, subtotal: 202, total: 202 },
};

// Deterministic Israeli phone from a name, matching the wizard's style.
export function phoneFromName(name) {
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = (h << 5) - h + name.charCodeAt(i);
    h = Math.abs(h);
    const carriers = ['050', '052', '053', '054', '058'];
    return `${carriers[h % carriers.length]}-${String(100 + (Math.floor(h / 7) % 900))}-${String(1000 + (h % 9000))}`;
}

export const initialsFromName = (name) =>
    (name || '—').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');

// Map a dashboard order's status text → pipeline stage + tone, then build a
// full order object the Order view can render. Shelf/recent orders don't carry
// ingredient detail, so we reuse the fallback formula body with the row's name.
const STATUS_MAP = {
    'ממתין לתשלום': { stage: 1, route: 'patient',       tone: 'amber' },
    'בהכנה':        { stage: 2, route: 'practitioner',  tone: 'amber' },
    'נשלח':         { stage: 3, route: 'practitioner',  tone: 'blue' },
    'הושלם':        { stage: 4, route: 'practitioner',  tone: 'green' },
    'נמסר':         { stage: 4, route: 'practitioner',  tone: 'green' },
    'בוטל':         { stage: -1, route: 'practitioner', tone: 'red', cancelled: true },
};

export function buildOrderFromRow(o) {
    const m = STATUS_MAP[o.status] || { stage: 2, route: 'practitioner', tone: 'amber' };
    const isShelf = o.type === 'מדף';
    return {
        id: o.id,
        date: o.date,
        patientLabel: o.patient,
        paymentRoute: m.route,
        status: o.status,
        stageIndex: m.stage,
        statusTone: m.tone,
        cancelled: !!m.cancelled,
        formula: {
            ...FALLBACK_ORDER.formula,
            name: o.formula,
            typeHeb: isShelf ? 'מוצר מדף' : FALLBACK_ORDER.formula.typeHeb,
        },
        pricing: FALLBACK_ORDER.pricing,
    };
}

// Module-level "last opened order" (replaces window.__tfLastOrder).
// TODO(backend): once orders are fetched by id, the Order view's controller
// prop replaces this client-side hand-off entirely.
let lastOrder = null;

export function setLastOrder(order) {
    lastOrder = order;
}

/** Returns the last order handed off via setLastOrder, or the fallback. */
export function getLastOrder() {
    return lastOrder || FALLBACK_ORDER;
}
