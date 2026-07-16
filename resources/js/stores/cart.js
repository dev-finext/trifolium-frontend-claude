// Cart + on-hold ("הזמנות בהמתנה") state.
//
// The design prototype broadcast `tf:addToCart` / `tf:moveToPending` window
// events; this store is the typed replacement — import it anywhere an item
// can be added to the cart (catalog, wizard) or parked on hold.
//
// INTEGRATION NOTE: state is client-side and seeded from mock data. When the
// Laravel backend owns the cart, keep this module's API and swap the bodies
// for Inertia form submissions / API calls — callers won't change.
import { reactive } from 'vue';
import { CART_ITEMS, PENDING_ORDERS } from '@/data/mock';

const state = reactive({
    /** Cart lines. Shelf products merge by id; formulas are always separate lines. */
    items: CART_ITEMS.map((x) => ({ ...x })),
    /** Orders parked on hold (reason + tone per line). */
    pendingItems: PENDING_ORDERS.map((x) => ({ ...x })),
    /** Bottom-center confirmation toast: { title, name, actionLabel, target } | null. */
    toast: null,
});

let toastTimer = null;
const TOAST_DURATION_MS = 3600;

function showToast(toast) {
    state.toast = toast;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        state.toast = null;
    }, TOAST_DURATION_MS);
}

/**
 * Add an item to the cart. Shelf items with the same id merge (qty bumped);
 * formula items (kind === 'formula') always append as a new line.
 */
function addToCart(incoming) {
    if (!incoming) {
        return;
    }

    const existing = state.items.find((x) => x.id === incoming.id);

    if (existing) {
        existing.qty += incoming.qty || 1;
    } else {
        state.items.push(incoming);
    }

    showToast({
        title:
            incoming.kind === 'formula'
                ? 'הפורמולה נוספה לסל'
                : 'המוצר נוסף לסל',
        name: incoming.name,
        actionLabel: 'צפה בסל',
        target: 'cart',
    });
}

/** Move a cart line to the on-hold list (deduplicated by id). */
function moveToPending(item) {
    if (!item) {
        return;
    }

    if (!state.pendingItems.some((x) => x.id === item.id)) {
        state.pendingItems.unshift({
            heldAt: 'הרגע',
            reason: item.reason || 'ממתין לתשלום',
            reasonTone: item.reasonTone || 'amber',
            ...item,
        });
    }

    showToast({
        title: 'הועבר להזמנות בהמתנה',
        name: item.name,
        actionLabel: 'צפה בהמתנה',
        target: 'pending',
    });
}

// U1 · Undo-able removal. Removing a cart line is destructive with no confirm;
// instead we remove immediately and offer "ביטול" in the toast for a few
// seconds. Restores to the original position if undone.
let lastRemoved = null; // { item, index }
function removeFromCart(item) {
    const i = state.items.indexOf(item);

    if (i === -1) {
        return;
    }

    lastRemoved = { item, index: i };
    state.items.splice(i, 1);
    showToast({
        title: 'הפריט הוסר מהסל',
        name: item.name,
        actionLabel: 'ביטול',
        action: 'undo',
    });
}
function undoRemove() {
    if (!lastRemoved) {
        return;
    }

    const { item, index } = lastRemoved;
    state.items.splice(Math.min(index, state.items.length), 0, item);
    lastRemoved = null;
    dismissToast();
}

function dismissToast() {
    clearTimeout(toastTimer);
    state.toast = null;
}

/**
 * Cart store singleton. `state` is intentionally mutable — pages that own a
 * list view (Cart, Pending) edit lines in place, mirroring the prototype.
 */
export function useCartStore() {
    return {
        state,
        addToCart,
        moveToPending,
        removeFromCart,
        undoRemove,
        showToast,
        dismissToast,
    };
}
