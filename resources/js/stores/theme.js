// Light/dark theme (D1). The actual attribute is set on <html> before first
// paint by the inline script in the HTML shell (so there's no flash and the
// mobile stylesheet + tokens are correct immediately). This store mirrors and
// mutates that state at runtime for the toggle.
//
// Resolution order: saved choice (localStorage) → OS preference → light.
import { reactive } from 'vue';

const KEY = 'tf-theme';

function initial() {
    if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'dark' || attr === 'light') return attr;
    }
    return 'light';
}

const state = reactive({ theme: initial() });

function apply(theme) {
    state.theme = theme;
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode */ }
}

function toggle() {
    apply(state.theme === 'dark' ? 'light' : 'dark');
}

export function useThemeStore() {
    return { state, apply, toggle };
}
