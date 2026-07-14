<script setup>
// Footer — site-wide. Brand + multi-column nav, quick-contact strip, and a
// slim compliance strip fixed to the viewport bottom (body reserves 44px for it).
import Icon from '@/Components/ui/Icon.vue';
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

const socialBtnStyle = {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--r-control)',
    border: '1px solid var(--line)',
    background: 'var(--surface)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s ease',
    cursor: 'pointer',
};

const certBadgeStyle = {
    padding: '4px 10px',
    border: '1px solid var(--line)',
    borderRadius: 'var(--r-pill)',
    background: 'var(--bg)',
    fontSize: '10px',
    letterSpacing: '0.08em',
};

const dotStyle = { color: 'rgba(255,255,255,0.32)', fontSize: '12px' };

const complianceLinkStyle = {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.25)',
    paddingBottom: '1px',
    cursor: 'pointer',
};

function onLink(link, event) {
    event.preventDefault();
    if (link.route) visit(link.route);
}
</script>

<template>
    <footer
        :style="{
            marginTop: '80px',
            background: 'var(--surface)',
            borderTop: '1px solid var(--line)',
            color: 'var(--ink-2)',
            fontFamily: 'var(--font-heb)',
        }"
    >
        <!-- MAIN — brand + nav columns -->
        <div
            :style="{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '56px 24px 40px',
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
                gap: '48px',
            }"
        >
            <!-- Brand block -->
            <div>
                <div
                    :style="{
                        fontFamily: 'Cormorant Garamond, Times New Roman, serif',
                        fontSize: '32px',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        color: 'var(--accent)',
                        lineHeight: 1,
                        marginBottom: '16px',
                    }"
                >
                    Trifolium
                </div>
                <p
                    :style="{
                        fontSize: '13px',
                        lineHeight: 1.65,
                        color: 'var(--ink-3)',
                        margin: '0 0 20px',
                        maxWidth: '320px',
                        textWrap: 'pretty',
                        fontWeight: 300,
                    }"
                >
                    בית המרקחת הדיגיטלי — פלטפורמה מקצועית לרקיחת פורמולות צמחים אישיות עבור מטופלים.
                </p>
                <div style="display: flex; gap: 8px">
                    <a v-for="s in SOCIAL_LINKS" :key="s.icon" href="#" :aria-label="s.label" :style="socialBtnStyle">
                        <Icon :name="s.icon" :size="15" color="var(--ink-3)" />
                    </a>
                </div>
            </div>

            <!-- Nav columns -->
            <div v-for="col in FOOTER_COLS" :key="col.title">
                <div
                    :style="{
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-3)',
                        fontWeight: 600,
                        marginBottom: '16px',
                        fontFamily: 'var(--font-latin)',
                    }"
                >
                    {{ col.title }}
                </div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px">
                    <li v-for="(link, i) in col.links" :key="i">
                        <a
                            href="#"
                            class="tf-footer-link"
                            style="font-size: 13px; color: var(--ink-2); cursor: pointer; transition: color 0.15s"
                            @click="onLink(link, $event)"
                        >
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Divider -->
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 24px">
            <div style="height: 1px; background: var(--line)" />
        </div>

        <!-- CONTACT STRIP — quick contact + certifications -->
        <div
            :style="{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '24px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
            }"
        >
            <div style="display: flex; gap: 28px; align-items: center; flex-wrap: wrap">
                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-2)">
                    <Icon name="phone" :size="14" color="var(--accent)" />
                    <span class="num" dir="ltr">03-555-0142</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-2)">
                    <Icon name="mail" :size="14" color="var(--accent)" />
                    <span class="latin">support@trifolium.co.il</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-3)">
                    <Icon name="clock" :size="14" color="var(--ink-3)" />
                    <span>א׳–ה׳ 09:00–18:00</span>
                </div>
            </div>

            <div
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    color: 'var(--ink-3)',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-latin)',
                    fontWeight: 600,
                }"
            >
                <span :style="certBadgeStyle">ISO 9001</span>
                <span :style="certBadgeStyle">GMP</span>
                <span :style="certBadgeStyle">משרד הבריאות</span>
            </div>
        </div>

        <!-- COMPLIANCE STRIP — slim, fixed to viewport bottom -->
        <div
            id="site-compliance-strip"
            :style="{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgb(61, 90, 58)',
                color: 'rgba(255,255,255,0.78)',
                zIndex: 30,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
            }"
        >
            <div
                :style="{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '8px 24px',
                    fontSize: '11px',
                    lineHeight: 1.5,
                    textWrap: 'pretty',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px 10px',
                }"
            >
                <span>כל הזכויות שמורות © <span class="num">2026</span></span>
                <span :style="dotStyle">•</span>
                <span>פועל באישור משרד הבריאות ואגף הרוקחות. רוקח אחראי אמיל אבו חמאד מס׳ רשיון <span class="num">6400</span></span>
                <span :style="dotStyle">•</span>
                <span>ט.ל.ח</span>
                <span :style="dotStyle">•</span>
                <a href="#" :style="complianceLinkStyle">תקנון האתר</a>
                <span :style="dotStyle">•</span>
                <a href="#" :style="complianceLinkStyle">הצהרת נגישות</a>
            </div>
        </div>
    </footer>
</template>

<style>
.tf-footer-link:hover {
    color: var(--accent) !important;
}
</style>
