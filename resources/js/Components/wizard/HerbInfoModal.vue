<script setup>
// Herb Info Modal — full-page monograph article (Trifolium blog style).
import { computed, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { useModeStore } from '@/stores/mode';
import { herbPinyin } from '@/lib/herbs';
import { HERB_WARNINGS, HERB_BLURBS, HERB_MONOGRAPH, HERB_FAMILY, ARTICLE_IMAGE } from '@/data/mock';

const props = defineProps({
    herb: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const { isChinese } = useModeStore();

const pinyin = computed(() => herbPinyin(props.herb));
const warnings = computed(() => (HERB_WARNINGS && HERB_WARNINGS[props.herb.id]) || []);
const blurb = computed(() =>
    (HERB_BLURBS && HERB_BLURBS[props.herb.id]) ||
    'תיאור מקצועי על מקור הצמח, חומרים פעילים ושימוש קליני יוצג כאן עם השלמת הקטלוג.'
);
const uses = computed(() => props.herb.uses || []);
const mono = computed(() => (HERB_MONOGRAPH && HERB_MONOGRAPH[props.herb.id]) || {});
const family = computed(() => (HERB_FAMILY && HERB_FAMILY[props.herb.id]) || '—');
const parts = computed(() => mono.value.parts || props.herb.form || '—');

// Build the article sections (fall back to a generic body when no monograph).
const sections = computed(() => mono.value.sections || [
    ...(uses.value.length ? [{ title: 'שימושים עיקריים', body: 'הצמח משמש בעיקר במצבים של ' + uses.value.join('، ') + '.' }] : []),
    { title: 'על הצמח', body: blurb.value },
]);

const warningNote = computed(() => mono.value.warningNote || (
    warnings.value.length ? 'יש להיוועץ באיש מקצוע לפני שימוש, במיוחד עבור: ' + warnings.value.join('، ') + '.' : null
));

const chineseName = computed(() => 'שם סיני:\n' + (isChinese.value ? (pinyin.value || '—') : (props.herb.cn || '—')));
const species = computed(() => mono.value.species || ('שם בוטני: ' + props.herb.lat));

// Tiny rich-text parser: split paragraphs on \n, and **bold** runs within.
function parseRich(text) {
    if (!text) return [];
    return String(text).split('\n').map((line) =>
        line.split('**').map((seg, si) => ({ text: seg, bold: si % 2 === 1 }))
    );
}

function onKey(e) { if (e.key === 'Escape') emit('close'); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 18, 14, 0.46)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '3vh 24px',
            backdropFilter: 'blur(2px)',
            animation: 'tf-fade-in .15s ease',
        }"
        @click="emit('close')"
    >
        <div
            :style="{
                background: 'var(--surface)',
                borderRadius: 'var(--r-card)',
                width: 'min(1040px, 100%)',
                maxHeight: '94vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                overflow: 'hidden',
            }"
            @click.stop
        >
            <!-- Sticky top bar -->
            <div
                :style="{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 28px',
                    borderBottom: '1px solid var(--line)',
                    flexShrink: 0,
                    background: 'var(--surface)',
                }"
            >
                <button
                    style="border: none; background: transparent; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit; font-size: 14px; font-weight: 600; color: var(--ink-2); padding: 4px 6px"
                    @click="emit('close')"
                >
                    <Icon name="chevron_right" :size="16" />
                    חזור
                </button>
                <button
                    aria-label="סגור"
                    class="tf-herbinfo-close"
                    style="width: 36px; height: 36px; border: 1px solid transparent; border-radius: 50%; background: transparent; color: var(--ink-2); cursor: pointer; display: inline-flex; align-items: center; justify-content: center"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="16" />
                </button>
            </div>

            <!-- Scrollable article -->
            <div style="flex: 1; overflow-y: auto">
                <div style="padding: clamp(28px, 4vw, 48px); max-width: 900px; margin: 0 auto">

                    <!-- Title -->
                    <h1
                        :style="{
                            margin: 0,
                            fontSize: 'clamp(26px, 3.4vw, 36px)',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'var(--accent)',
                            letterSpacing: '-0.01em',
                            textWrap: 'balance',
                        }"
                    >
                        <span v-if="isChinese" style="direction: ltr; unicode-bidi: isolate; font-family: var(--font-latin)">{{ pinyin }}</span>
                        <span v-else style="direction: ltr; unicode-bidi: isolate">{{ herb.lat }}</span>
                    </h1>
                    <!-- In Chinese mode the Latin botanical sits small + italic beneath the pinyin title -->
                    <div
                        v-if="isChinese"
                        class="latin"
                        :style="{
                            marginTop: '6px',
                            fontSize: 'clamp(14px, 1.6vw, 17px)',
                            fontStyle: 'italic',
                            color: 'var(--ink-3)',
                            direction: 'ltr',
                            unicodeBidi: 'isolate',
                        }"
                    >{{ herb.lat }}</div>

                    <!-- Uses chips -->
                    <div v-if="uses.length > 0" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px">
                        <span
                            v-for="(u, i) in uses" :key="i"
                            style="font-size: 13px; padding: 5px 13px; border-radius: 999px; background: var(--accent-tint); color: var(--accent-ink); border: 1px solid var(--accent-tint-strong); font-weight: 600"
                        >{{ u }}</span>
                    </div>

                    <!-- Fact row -->
                    <div
                        :style="{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(138px, 1fr))',
                            gap: '20px',
                            padding: '32px 0',
                            margin: '28px 0 0',
                            borderTop: '1px solid var(--line)',
                            borderBottom: '1px solid var(--line)',
                        }"
                    >
                        <div v-for="fact in [
                            { key: 'book', label: 'שמות נוספים', body: chineseName },
                            { key: 'leaf', label: 'משפחה בוטנית', body: family },
                            { key: 'seeds', label: 'חלקים בשימוש', body: parts },
                            { key: 'sprout', label: 'מינים נוספים', body: species },
                        ]" :key="fact.key" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px">
                            <div style="width: 64px; height: 64px; border-radius: 50%; border: 1.5px solid var(--line-strong); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0">
                                <svg v-if="fact.key === 'sprout'" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 21v-8" />
                                    <path d="M12 13c0-3.3 2.4-5.6 6-5.6 0 3.3-2.4 5.6-6 5.6z" />
                                    <path d="M12 15c0-2.8-2.1-4.8-5.2-4.8 0 2.8 2.1 4.8 5.2 4.8z" />
                                </svg>
                                <svg v-else-if="fact.key === 'seeds'" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                    <ellipse cx="8" cy="9" rx="3.4" ry="2.2" transform="rotate(-30 8 9)" />
                                    <ellipse cx="15.5" cy="8" rx="3.4" ry="2.2" transform="rotate(25 15.5 8)" />
                                    <ellipse cx="11.5" cy="15.5" rx="3.4" ry="2.2" transform="rotate(-12 11.5 15.5)" />
                                </svg>
                                <svg v-else-if="fact.key === 'leaf'" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9h7v7a9 9 0 0 1-9 9z" />
                                    <path d="M9 16c1.5-4 4-6.5 8-8" />
                                </svg>
                                <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
                                    <path d="M4 19a2 2 0 0 0 2 2h13" />
                                    <path d="M9 7h6M9 10.5h6" />
                                </svg>
                            </div>
                            <div style="font-size: 14px; font-weight: 700; color: var(--ink)">{{ fact.label }}</div>
                            <div style="font-size: 13.5px; line-height: 1.65; color: var(--ink-3); white-space: pre-line; max-width: 220px">{{ fact.body }}</div>
                        </div>
                    </div>

                    <!-- Plant photo — floated, text wraps around it -->
                    <img
                        :src="ARTICLE_IMAGE"
                        :alt="herb.heb"
                        :style="{
                            float: 'left',
                            width: 'clamp(220px, 34%, 320px)',
                            aspectRatio: '3 / 2',
                            objectFit: 'cover',
                            borderRadius: 'var(--r-card)',
                            margin: '4px 30px 18px 0',
                            boxShadow: '0 8px 26px rgba(31,46,29,0.16)',
                        }"
                    />

                    <!-- Article sections -->
                    <section v-for="(s, i) in sections" :key="i" :style="{ marginTop: i === 0 ? '0' : '30px' }">
                        <h2 :style="{ margin: '0 0 12px', fontSize: 'clamp(19px, 2.2vw, 23px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35 }">{{ s.title }}</h2>
                        <p
                            v-for="(para, pi) in parseRich(s.body)" :key="pi"
                            :style="{ margin: pi === 0 ? '0 0 0' : '12px 0 0', fontSize: '15.5px', lineHeight: 1.85, color: 'var(--ink-2)', textWrap: 'pretty' }"
                        >
                            <template v-for="(seg, si) in para" :key="si">
                                <strong v-if="seg.bold" style="color: var(--ink); font-weight: 700">{{ seg.text }}</strong>
                                <template v-else>{{ seg.text }}</template>
                            </template>
                        </p>
                    </section>

                    <!-- Warnings -->
                    <section v-if="warningNote" style="margin-top: 30px">
                        <h2 style="margin: 0 0 12px; font-size: clamp(19px, 2.2vw, 23px); font-weight: 700; color: var(--danger); display: inline-flex; align-items: center; gap: 9px">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 3L22 20H2L12 3z" stroke="var(--danger)" stroke-width="1.8" stroke-linejoin="round" />
                                <path d="M12 10v5M12 17.5v.4" stroke="var(--danger)" stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                            אזהרות והתוויות נגד
                        </h2>
                        <div style="background: rgba(162, 58, 45, 0.06); border: 1px solid rgba(162, 58, 45, 0.22); border-radius: var(--r-card); padding: 16px 20px">
                            <p style="margin: 0; font-size: 15px; line-height: 1.8; color: var(--ink-2); font-weight: 600">{{ warningNote }}</p>
                            <div v-if="warnings.length > 0" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px">
                                <span
                                    v-for="(w, i) in warnings" :key="i"
                                    style="font-size: 12.5px; padding: 4px 12px; border-radius: 999px; background: var(--surface); color: var(--danger); border: 1px solid rgba(162, 58, 45, 0.3); font-weight: 600"
                                >{{ w }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Disclaimer -->
                    <p style="margin-top: 28px; font-size: 12.5px; line-height: 1.75; color: var(--ink-4); font-style: italic; border-top: 1px solid var(--line); padding-top: 20px">
                        המידע שלהלן נועד לצורכי ידע כללי והרחבת הדעת בלבד, ונערך על ידי צוות בית מרקחת טריפוליום.
                        אין במידע זה משום המלצה לרכישת מוצר או הצהרה לגבי יעילותו. כל שימוש או הסתמכות על המידע
                        הינו באחריות הקורא בלבד, ואינו מהווה תחליף לייעוץ רפואי מקצועי.
                    </p>

                    <!-- Sources -->
                    <section v-if="mono.sources && mono.sources.length > 0" style="margin-top: 28px">
                        <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 700; color: var(--ink)">מקורות</h2>
                        <ol style="margin: 0; padding-inline-start: 20px; display: flex; flex-direction: column; gap: 8px">
                            <li v-for="(src, i) in mono.sources" :key="i" style="font-size: 12.5px; line-height: 1.6; color: var(--ink-3)">{{ src }}</li>
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-fade-in { from { opacity: 0; } to { opacity: 1; } }
.tf-herbinfo-close:hover { background: var(--surface-sunk) !important; }
</style>
