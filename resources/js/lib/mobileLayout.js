// Responsive-tier flags.
//
// The app's responsive system works in three tiers, scoped by classes on
// <html> (toggled from JS rather than raw media queries, so components and
// the stylesheet share one source of truth):
//
//   html.tf-mobile   ≤ 760px    phones — app-like shell (bottom tab bar,
//                                focused wizard flow; see app.css)
//   html.tf-tablet   761–1080px tablets / small laptops — tighter grids,
//                                stacked two-pane layouts
//   (neither)        > 1080px   the desktop design as shipped
//
// The tiers are exclusive: exactly one class (or none) is present at a time.
const MOBILE_QUERY = '(max-width: 760px)';
const TABLET_QUERY = '(min-width: 761px) and (max-width: 1080px)';

export function initMobileLayoutFlag() {
    const mobile = window.matchMedia(MOBILE_QUERY);
    const tablet = window.matchMedia(TABLET_QUERY);
    const apply = () => {
        document.documentElement.classList.toggle('tf-mobile', mobile.matches);
        document.documentElement.classList.toggle('tf-tablet', tablet.matches);
    };
    apply();
    mobile.addEventListener('change', apply);
    tablet.addEventListener('change', apply);
}
