// Reactive `window.matchMedia` flag for a CSS media query. Use when a component
// must swap COMPOSITION per breakpoint (e.g. bento ↔ carousel); CSS remains the
// tool for everything purely visual. Mirrors useIsMobile, but for any query.
//
// Tiers (see lib/mobileLayout.js): mobile ≤760 · tablet 761–1080 · desktop >1080.
import { onBeforeUnmount, ref } from 'vue';

export function useMediaQuery(query) {
    const matches = ref(
        typeof window !== 'undefined' && window.matchMedia(query).matches,
    );

    if (typeof window !== 'undefined') {
        const mq = window.matchMedia(query);
        const onChange = () => {
            matches.value = mq.matches;
        };
        mq.addEventListener('change', onChange);
        onBeforeUnmount(() => mq.removeEventListener('change', onChange));
    }

    return matches;
}
