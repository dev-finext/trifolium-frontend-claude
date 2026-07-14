// Shared practitioner shipping-address store — single source of truth for
// both the cart ("משלוח אליי") and the personal-details editor (profile).
//
// The prototype persisted to localStorage and broadcast a `tf:addresses-changed`
// CustomEvent so an open cart re-read the moment the practitioner edited their
// addresses. Here a module-scope ref gives every consumer the same reactive
// list, so `tfSaveAddresses` updating it replaces the event broadcast.
import { ref } from 'vue';

const TF_ADDR_KEY = 'tf:addresses:v1';

// Seed: the practitioner's saved addresses. The first is the primary
// (default) one — mirrors what used to be the single locked address.
export const TF_DEFAULT_ADDRESSES = [
    {
        id: 'addr-clinic',
        label: 'מרפאת שורש',
        name: 'נעמי שגב — מרפאת שורש',
        street: 'הרצל 24, דירה 5',
        city: 'רעננה',
        zip: '4350024',
        phone: '052-481-9230',
        primary: true,
    },
    {
        id: 'addr-home',
        label: 'בית',
        name: 'נעמי שגב',
        street: 'דרך השדות 9',
        city: 'הוד השרון',
        zip: '4524718',
        phone: '052-481-9230',
        primary: false,
    },
];

// TODO(backend): load the practitioner's addresses from the server instead of
// localStorage (e.g. an Inertia shared prop or an addresses endpoint).
export function tfLoadAddresses() {
    try {
        const raw = localStorage.getItem(TF_ADDR_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length) return arr;
        }
    } catch (e) { /* ignore */ }
    return TF_DEFAULT_ADDRESSES.map(a => ({ ...a }));
}

// The one reactive list every consumer shares (cart, profile editor, …).
const addresses = ref(tfLoadAddresses());

// TODO(backend): persist to the server; localStorage stands in until then.
export function tfSaveAddresses(list) {
    // Guarantee exactly one primary.
    const normalized = list.map(a => ({ ...a }));
    if (!normalized.some(a => a.primary) && normalized.length) normalized[0].primary = true;
    try { localStorage.setItem(TF_ADDR_KEY, JSON.stringify(normalized)); } catch (e) { /* ignore */ }
    // Updating the shared ref replaces the prototype's `tf:addresses-changed`
    // CustomEvent — all mounted consumers see the change immediately.
    addresses.value = normalized;
    return normalized;
}

/** Primary (default) address of a list. Accepts a plain array or the ref
 *  returned by useAddresses() — unwrapped defensively so call sites can't
 *  crash on the ref/array seam. */
export const tfPrimaryAddress = (list) => {
    const arr = Array.isArray(list) ? list : (list && Array.isArray(list.value) ? list.value : []);
    return arr.find((a) => a.primary) || arr[0] || null;
};

// Reactive hook — the returned ref updates whenever addresses are saved
// anywhere in the app.
export function useAddresses() {
    return addresses;
}
