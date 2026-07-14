// Treatment-style mode: Western ↔ Traditional-Chinese.
//
// Mode changes how herbs are named/displayed (see Components/mode/HerbName.vue)
// and some wizard behavior. Switching mid-formula is destructive, so when the
// wizard is dirty the switch is parked in `pendingMode` until the user confirms
// via the modal rendered by AppLayout.
import { computed, reactive } from 'vue';
import { useWizardStore } from '@/stores/wizard';

const STORAGE_KEY = 'trifolium_mode';

function loadPersistedMode() {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'chinese' ? 'chinese' : 'western';
    } catch {
        return 'western';
    }
}

const state = reactive({
    /** 'western' | 'chinese' */
    mode: loadPersistedMode(),
    /** Mode awaiting user confirmation (destructive switch), or null. */
    pendingMode: null,
});

const wizard = useWizardStore();

function setMode(mode) {
    state.mode = mode;
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* private browsing */ }
}

/**
 * Request a mode switch (navbar switch, wizard badge…).
 * Destructive only when a formula is in progress — then we ask first.
 */
function requestMode(newMode) {
    if (newMode === state.mode) return;
    if (wizard.state.dirty) {
        state.pendingMode = newMode;
    } else {
        setMode(newMode);
    }
}

/** Confirm the parked switch: apply it and tell the wizard to reset. */
function confirmPendingMode() {
    if (!state.pendingMode) return;
    setMode(state.pendingMode);
    state.pendingMode = null;
    wizard.bumpResetSignal();
}

function cancelPendingMode() {
    state.pendingMode = null;
}

export function useModeStore() {
    return {
        state,
        /** Convenience computed for templates: `mode.value`. */
        mode: computed(() => state.mode),
        isChinese: computed(() => state.mode === 'chinese'),
        requestMode,
        confirmPendingMode,
        cancelPendingMode,
    };
}
