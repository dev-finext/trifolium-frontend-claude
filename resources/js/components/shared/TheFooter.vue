<script setup>
// Footer — site-wide. Brand + multi-column nav, quick-contact strip, and a
// slim compliance strip fixed to the viewport bottom (body reserves 44px for it).
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';

// Columns: links with a `route` navigate; the rest are placeholders for
// destinations that are not part of the current scope.
const FOOTER_COLS = [
    {
        title: 'הפלטפורמה',
        links: [
            { label: 'ראשי', route: 'home' },
            { label: 'מוצרי מדף', route: 'catalog' },
            { label: 'הכנת פורמולה', route: 'compounding' },
            { label: 'מאמרים מקצועיים', route: 'articles' },
        ],
    },
    {
        title: 'מקצועיים',
        links: [
            { label: 'מאגר צמחים' },
            { label: 'אינטראקציות וטיפוסי קונסטיטוציה' },
            { label: 'הדרכות וובינרים' },
            { label: 'שאלות נפוצות' },
        ],
    },
    {
        title: 'תמיכה',
        links: [
            { label: 'יצירת קשר', route: 'contact' },
            { label: 'מרכז עזרה' },
            { label: 'דיווח על תקלה' },
            { label: 'הצעות לשיפור' },
        ],
    },
];

const SOCIAL_LINKS = [
    { icon: 'whatsapp', label: 'ווטסאפ' },
    { icon: 'phone', label: 'טלפון' },
    { icon: 'mail', label: 'מייל' },
    { icon: 'globe', label: 'אתר' },
];

// Shared utility-class strings (formerly inline style objects).
const socialBtnClass =
    'inline-flex items-center justify-center w-[32px] h-[32px] bg-surface border border-line rounded-control transition-all duration-150 ease-[ease] cursor-pointer';

const certBadgeClass =
    'py-[4px] px-[10px] text-[10px] tracking-[0.08em] bg-bg border border-line rounded-pill';

const dotClass = 'text-[12px] text-[rgba(255,255,255,0.32)]';

const complianceLinkClass =
    'pb-[1px] no-underline text-[rgba(255,255,255,0.85)] border-b border-b-[rgba(255,255,255,0.25)] cursor-pointer';

function onLink(link, event) {
    event.preventDefault();

    if (link.route) {
        visit(link.route);
    }
}
</script>

<template>
    <footer
        class="mt-[80px] border-t border-line bg-surface font-heb text-ink-2"
    >
        <!-- MAIN — brand + nav columns -->
        <div
            class="mx-auto my-0 grid max-w-[1200px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-[48px] px-[24px] pt-[56px] pb-[40px]"
        >
            <!-- Brand block -->
            <div>
                <div
                    class="mb-[16px] font-[Cormorant_Garamond,Times_New_Roman,serif] text-[32px] leading-[1] font-medium tracking-[0.02em] text-accent"
                >
                    Trifolium
                </div>
                <p
                    class="m-0 mb-[20px] max-w-[320px] text-[13px] leading-[1.65] font-light [text-wrap:pretty] text-ink-3"
                >
                    בית המרקחת הדיגיטלי — פלטפורמה מקצועית לרקיחת פורמולות צמחים
                    אישיות עבור מטופלים.
                </p>
                <div class="flex gap-[8px]">
                    <a
                        v-for="s in SOCIAL_LINKS"
                        :key="s.icon"
                        href="#"
                        :aria-label="s.label"
                        :class="socialBtnClass"
                    >
                        <Icon :name="s.icon" :size="15" color="var(--ink-3)" />
                    </a>
                </div>
            </div>

            <!-- Nav columns -->
            <div v-for="col in FOOTER_COLS" :key="col.title">
                <div
                    class="mb-[16px] font-latin text-[11px] font-semibold tracking-[0.12em] text-ink-3 uppercase"
                >
                    {{ col.title }}
                </div>
                <ul class="m-0 flex list-none flex-col gap-[10px] p-0">
                    <li v-for="(link, i) in col.links" :key="i">
                        <a
                            href="#"
                            class="tf-footer-link cursor-pointer text-[13px] text-ink-2 transition-[color] duration-150"
                            @click="onLink(link, $event)"
                        >
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Divider -->
        <div class="mx-auto my-0 max-w-[1200px] px-[24px] py-0">
            <div class="h-[1px] bg-line" />
        </div>

        <!-- CONTACT STRIP — quick contact + certifications -->
        <div
            class="mx-auto my-0 flex max-w-[1200px] flex-wrap items-center justify-between gap-[24px] p-[24px]"
        >
            <div class="flex flex-wrap items-center gap-[28px]">
                <div class="flex items-center gap-[8px] text-[13px] text-ink-2">
                    <Icon name="phone" :size="14" color="var(--accent)" />
                    <span class="num" dir="ltr">03-555-0142</span>
                </div>
                <div class="flex items-center gap-[8px] text-[13px] text-ink-2">
                    <Icon name="mail" :size="14" color="var(--accent)" />
                    <span class="latin">support@trifolium.co.il</span>
                </div>
                <div class="flex items-center gap-[8px] text-[13px] text-ink-3">
                    <Icon name="clock" :size="14" color="var(--ink-3)" />
                    <span>א׳–ה׳ 09:00–18:00</span>
                </div>
            </div>

            <div
                class="flex items-center gap-[10px] font-latin text-[11px] font-semibold tracking-[0.06em] text-ink-3 uppercase"
            >
                <span :class="certBadgeClass">ISO 9001</span>
                <span :class="certBadgeClass">GMP</span>
                <span :class="certBadgeClass">משרד הבריאות</span>
            </div>
        </div>

        <!-- COMPLIANCE STRIP — slim, fixed to viewport bottom -->
        <div
            id="site-compliance-strip"
            class="fixed right-0 bottom-0 left-0 z-[30] border-t border-t-[rgba(255,255,255,0.08)] bg-[rgb(61,90,58)] text-[rgba(255,255,255,0.78)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
        >
            <div
                class="mx-auto my-0 flex max-w-[1200px] flex-wrap items-center justify-center gap-x-[10px] gap-y-[2px] px-[24px] py-[8px] text-[11px] leading-[1.5] [text-wrap:pretty]"
            >
                <span>כל הזכויות שמורות © <span class="num">2026</span></span>
                <span :class="dotClass">•</span>
                <span
                    >פועל באישור משרד הבריאות ואגף הרוקחות. רוקח אחראי אמיל אבו
                    חמאד מס׳ רשיון <span class="num">6400</span></span
                >
                <span :class="dotClass">•</span>
                <span>ט.ל.ח</span>
                <span :class="dotClass">•</span>
                <a
                    href="#"
                    :class="complianceLinkClass"
                    @click.prevent="visit('terms')"
                    >תקנון האתר</a
                >
                <span :class="dotClass">•</span>
                <a
                    href="#"
                    :class="complianceLinkClass"
                    @click.prevent="visit('accessibility')"
                    >הצהרת נגישות</a
                >
            </div>
        </div>
    </footer>
</template>

<style>
.tf-footer-link:hover {
    color: var(--accent) !important;
}
</style>
