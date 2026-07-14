// Decorative art components — barrel export.
// Ported from the design handoff's placeholders.jsx and covers.jsx.
// Usage: import { HeroIllustration, ItemCover } from '@/Components/art';

// Placeholder illustrations (placeholders.jsx)
export { default as HeroIllustration } from './HeroIllustration.vue';
export { default as ChineseHeroIllustration } from './ChineseHeroIllustration.vue';
export { default as EventIllustration } from './EventIllustration.vue';
export { default as ArticleIllustration } from './ArticleIllustration.vue';
export { default as VideoIllustration } from './VideoIllustration.vue';
export { default as ProductIllustration } from './ProductIllustration.vue';

// Per-item cover art (covers.jsx)
export { default as ItemCover } from './ItemCover.vue';
export { default as CoverMotif } from './CoverMotif.vue';

// SVG helper fragments (render a <g>; must live inside an <svg>)
export { default as Sprig } from './Sprig.vue';
export { default as Chrysanthemum } from './Chrysanthemum.vue';
export { default as Goji } from './Goji.vue';
export { default as AstragalusSlice } from './AstragalusSlice.vue';
export { default as CvLeaf } from './CvLeaf.vue';
export { default as CvSprig } from './CvSprig.vue';
export { default as CvBloom } from './CvBloom.vue';
export { default as CvCornerSprigs } from './CvCornerSprigs.vue';

// Shared non-component data
export { PALETTES, coverPalette, COVER_MAP, MOTIF_KEYS, fallbackFor } from './art-data.js';
