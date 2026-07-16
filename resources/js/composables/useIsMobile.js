// Reactive phone-tier flag — the same 760px breakpoint the stylesheet's
// html.tf-mobile class follows (lib/mobileLayout.js). Use this when a page
// needs to swap COMPOSITION per tier (e.g. the mobile home screen), not just
// styling; CSS remains the tool for everything visual.
import { onBeforeUnmount, ref } from 'vue';

const QUERY = '(max-width: 760px)';

export function useIsMobile() {
    const isMobile = ref(typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
    if (typeof window !== 'undefined') {
        const mq = window.matchMedia(QUERY);
        const onChange = () => { isMobile.value = mq.matches; };
        mq.addEventListener('change', onChange);
        onBeforeUnmount(() => mq.removeEventListener('change', onChange));
    }
    return isMobile;
}
