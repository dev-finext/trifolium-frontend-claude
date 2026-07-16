// Saved-formulas library ("הפורמולות שלי") — client-side state.
//
// The prototype mutated window.TFDATA.SAVED_FORMULAS and passed a
// window.__tfHighlightFormula flag so the library screen could glow the card
// that was just saved. This store is the typed replacement.
//
// TODO(backend): persist via API — `add`/`remove` become POST/DELETE calls and
// `list` comes from Inertia props; the highlight flow stays client-side.
import { reactive } from 'vue';
import { SAVED_FORMULAS } from '@/data/mock';

const state = reactive({
    list: SAVED_FORMULAS.map((f) => ({ ...f })),
    /** Formula id to briefly highlight when the library opens (or null). */
    highlightId: null,
});

/** Prepend a freshly-saved formula and flag it for the arrival highlight. */
function add(saved) {
    state.list.unshift(saved);
    state.highlightId = saved.id;
}

function remove(id) {
    state.list = state.list.filter((f) => f.id !== id);
}

/** One-shot read of the highlight flag (clears it). */
function consumeHighlight() {
    const id = state.highlightId;
    state.highlightId = null;

    return id;
}

export function useSavedFormulasStore() {
    return { state, add, remove, consumeHighlight };
}
