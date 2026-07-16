// Formula-wizard cross-page state.
//
// The wizard itself lives in Pages/Compounding.vue; this tiny store exposes
// only what the app chrome needs to know about it:
//   - `dirty`      — the in-progress formula has ingredients, so switching the
//                    treatment style (mode) must be confirmed first.
//   - `resetSignal` — bumped by the mode store after a confirmed switch; the
//                    wizard watches it, wipes the formula (keeping the patient)
//                    and restarts on the compose step in the new style.
// A third concern also lives here: `pendingFormula` — a formula handed to the
// wizard from another screen ("טען למעבדה" in My Formulas, edit-in-lab from
// Pending/Order view). The prototype used `window.__tfPendingFormula`; here
// the sender calls `setPendingFormula(...)` and navigates to 'compounding',
// and the wizard consumes it on mount.
import { reactive } from 'vue';

const state = reactive({
    dirty: false,
    resetSignal: 0,
    pendingFormula: null,
});

/** Called by the wizard whenever its ingredient list becomes (non-)empty. */
function setDirty(value) {
    state.dirty = value;
}

/** Ask the wizard to clear its formula and restart in the current mode. */
function bumpResetSignal() {
    state.resetSignal += 1;
}

/** Park a formula for the wizard to preload (then navigate to 'compounding'). */
function setPendingFormula(formula) {
    state.pendingFormula = formula;
}

/** One-shot read: returns the parked formula (or null) and clears it. */
function consumePendingFormula() {
    const pending = state.pendingFormula;
    state.pendingFormula = null;

    return pending;
}

export function useWizardStore() {
    return {
        state,
        setDirty,
        bumpResetSignal,
        setPendingFormula,
        consumePendingFormula,
    };
}
