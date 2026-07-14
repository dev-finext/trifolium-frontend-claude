// Mobile-layout flag.
//
// The design's entire phone layout is scoped under `html.tf-mobile`
// (see resources/css/app.css) rather than raw media queries, so the class is
// toggled from JS. This helper follows the 760px breakpoint used by the design.
const MOBILE_QUERY = '(max-width: 760px)';

export function initMobileLayoutFlag() {
    const mq = window.matchMedia(MOBILE_QUERY);
    const apply = () => document.documentElement.classList.toggle('tf-mobile', mq.matches);
    apply();
    mq.addEventListener('change', apply);
}
