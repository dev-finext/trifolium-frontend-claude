<script setup>
// Herb Info Modal — full-page monograph article (Trifolium blog style).
import { computed, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import {
    HERB_WARNINGS,
    HERB_BLURBS,
    HERB_MONOGRAPH,
    HERB_FAMILY,
    ARTICLE_IMAGE,
} from '@/data/mock';
import { herbPinyin } from '@/lib/herbs';
import { useModeStore } from '@/stores/mode';

const props = defineProps({
    herb: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const { isChinese } = useModeStore();

const pinyin = computed(() => herbPinyin(props.herb));
const warnings = computed(
    () => (HERB_WARNINGS && HERB_WARNINGS[props.herb.id]) || [],
);
const blurb = computed(
    () =>
        (HERB_BLURBS && HERB_BLURBS[props.herb.id]) ||
        'תיאור מקצועי על מקור הצמח, חומרים פעילים ושימוש קליני יוצג כאן עם השלמת הקטלוג.',
);
const uses = computed(() => props.herb.uses || []);
const mono = computed(
    () => (HERB_MONOGRAPH && HERB_MONOGRAPH[props.herb.id]) || {},
);
const family = computed(
    () => (HERB_FAMILY && HERB_FAMILY[props.herb.id]) || '—',
);
const parts = computed(() => mono.value.parts || props.herb.form || '—');

// Build the article sections (fall back to a generic body when no monograph).
const sections = computed(
    () =>
        mono.value.sections || [
            ...(uses.value.length
                ? [
                      {
                          title: 'שימושים עיקריים',
                          body:
                              'הצמח משמש בעיקר במצבים של ' +
                              uses.value.join('، ') +
                              '.',
                      },
                  ]
                : []),
            { title: 'על הצמח', body: blurb.value },
        ],
);

const warningNote = computed(
    () =>
        mono.value.warningNote ||
        (warnings.value.length
            ? 'יש להיוועץ באיש מקצוע לפני שימוש, במיוחד עבור: ' +
              warnings.value.join('، ') +
              '.'
            : null),
);

const chineseName = computed(
    () =>
        'שם סיני:\n' +
        (isChinese.value ? pinyin.value || '—' : props.herb.cn || '—'),
);
const species = computed(
    () => mono.value.species || 'שם בוטני: ' + props.herb.lat,
);

// Tiny rich-text parser: split paragraphs on \n, and **bold** runs within.
function parseRich(text) {
    if (!text) {
        return [];
    }

    return String(text)
        .split('\n')
        .map((line) =>
            line
                .split('**')
                .map((seg, si) => ({ text: seg, bold: si % 2 === 1 })),
        );
}

function onKey(e) {
    if (e.key === 'Escape') {
        emit('close');
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="fixed inset-0 z-[120] flex animate-[tf-fade-in_.15s_ease] items-start justify-center bg-[rgba(20,18,14,0.46)] px-[24px] py-[3vh] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            class="flex max-h-[94vh] w-[min(1040px,100%)] flex-col overflow-hidden rounded-card bg-surface shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <!-- Sticky top bar -->
            <div
                class="flex shrink-0 items-center justify-between border-b border-line bg-surface px-[28px] py-[14px]"
            >
                <button
                    class="inline-flex cursor-pointer items-center gap-[8px] border-none bg-transparent px-[6px] py-[4px] [font-family:inherit] text-[14px] font-semibold text-ink-2"
                    @click="emit('close')"
                >
                    <Icon name="chevron_right" :size="16" />
                    חזור
                </button>
                <button
                    aria-label="סגור"
                    class="tf-herbinfo-close inline-flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[50%] border border-transparent bg-transparent text-ink-2"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="16" />
                </button>
            </div>

            <!-- Scrollable article -->
            <div class="flex-1 overflow-y-auto">
                <div
                    class="mx-auto my-0 max-w-[900px] p-[clamp(28px,4vw,48px)]"
                >
                    <!-- Title -->
                    <h1
                        class="m-0 text-[clamp(26px,3.4vw,36px)] leading-[1.2] font-bold tracking-[-0.01em] text-balance text-accent"
                    >
                        <span
                            v-if="isChinese"
                            class="font-latin [direction:ltr] [unicode-bidi:isolate]"
                            >{{ pinyin }}</span
                        >
                        <span
                            v-else
                            class="[direction:ltr] [unicode-bidi:isolate]"
                            >{{ herb.lat }}</span
                        >
                    </h1>
                    <!-- In Chinese mode the Latin botanical sits small + italic beneath the pinyin title -->
                    <div
                        v-if="isChinese"
                        class="latin mt-[6px] text-[clamp(14px,1.6vw,17px)] text-ink-3 italic [direction:ltr] [unicode-bidi:isolate]"
                    >
                        {{ herb.lat }}
                    </div>

                    <!-- Uses chips -->
                    <div
                        v-if="uses.length > 0"
                        class="mt-[16px] flex flex-wrap gap-[6px]"
                    >
                        <span
                            v-for="(u, i) in uses"
                            :key="i"
                            class="rounded-[999px] border border-accent-tint-strong bg-accent-tint px-[13px] py-[5px] text-[13px] font-semibold text-accent-ink"
                            >{{ u }}</span
                        >
                    </div>

                    <!-- Fact row -->
                    <div
                        class="mx-0 mt-[28px] mb-0 grid grid-cols-[repeat(auto-fit,minmax(138px,1fr))] gap-[20px] border-t border-b border-line px-0 py-[32px]"
                    >
                        <div
                            v-for="fact in [
                                {
                                    key: 'book',
                                    label: 'שמות נוספים',
                                    body: chineseName,
                                },
                                {
                                    key: 'leaf',
                                    label: 'משפחה בוטנית',
                                    body: family,
                                },
                                {
                                    key: 'seeds',
                                    label: 'חלקים בשימוש',
                                    body: parts,
                                },
                                {
                                    key: 'sprout',
                                    label: 'מינים נוספים',
                                    body: species,
                                },
                            ]"
                            :key="fact.key"
                            class="flex flex-col items-center gap-[12px] text-center"
                        >
                            <div
                                class="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[50%] border-[1.5px] border-line-strong text-accent"
                            >
                                <svg
                                    v-if="fact.key === 'sprout'"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M12 21v-8" />
                                    <path
                                        d="M12 13c0-3.3 2.4-5.6 6-5.6 0 3.3-2.4 5.6-6 5.6z"
                                    />
                                    <path
                                        d="M12 15c0-2.8-2.1-4.8-5.2-4.8 0 2.8 2.1 4.8 5.2 4.8z"
                                    />
                                </svg>
                                <svg
                                    v-else-if="fact.key === 'seeds'"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <ellipse
                                        cx="8"
                                        cy="9"
                                        rx="3.4"
                                        ry="2.2"
                                        transform="rotate(-30 8 9)"
                                    />
                                    <ellipse
                                        cx="15.5"
                                        cy="8"
                                        rx="3.4"
                                        ry="2.2"
                                        transform="rotate(25 15.5 8)"
                                    />
                                    <ellipse
                                        cx="11.5"
                                        cy="15.5"
                                        rx="3.4"
                                        ry="2.2"
                                        transform="rotate(-12 11.5 15.5)"
                                    />
                                </svg>
                                <svg
                                    v-else-if="fact.key === 'leaf'"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9h7v7a9 9 0 0 1-9 9z"
                                    />
                                    <path d="M9 16c1.5-4 4-6.5 8-8" />
                                </svg>
                                <svg
                                    v-else
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"
                                    />
                                    <path d="M4 19a2 2 0 0 0 2 2h13" />
                                    <path d="M9 7h6M9 10.5h6" />
                                </svg>
                            </div>
                            <div class="text-[14px] font-bold text-ink">
                                {{ fact.label }}
                            </div>
                            <div
                                class="max-w-[220px] text-[13.5px] leading-[1.65] whitespace-pre-line text-ink-3"
                            >
                                {{ fact.body }}
                            </div>
                        </div>
                    </div>

                    <!-- Plant photo — floated, text wraps around it -->
                    <img
                        :src="ARTICLE_IMAGE"
                        :alt="herb.heb"
                        class="float-left mt-[4px] mr-[30px] mb-[18px] ml-0 aspect-[3/2] w-[clamp(220px,34%,320px)] rounded-card object-cover shadow-[0_8px_26px_rgba(31,46,29,0.16)]"
                    />

                    <!-- Article sections -->
                    <section
                        v-for="(s, i) in sections"
                        :key="i"
                        :class="i === 0 ? 'mt-0' : 'mt-[30px]'"
                    >
                        <h2
                            class="mx-0 mt-0 mb-[12px] text-[clamp(19px,2.2vw,23px)] leading-[1.35] font-bold text-ink"
                        >
                            {{ s.title }}
                        </h2>
                        <p
                            v-for="(para, pi) in parseRich(s.body)"
                            :key="pi"
                            class="mx-0 mb-0 text-[15.5px] leading-[1.85] text-pretty text-ink-2"
                            :class="pi === 0 ? 'mt-0' : 'mt-[12px]'"
                        >
                            <template v-for="(seg, si) in para" :key="si">
                                <strong
                                    v-if="seg.bold"
                                    class="font-bold text-ink"
                                    >{{ seg.text }}</strong
                                >
                                <template v-else>{{ seg.text }}</template>
                            </template>
                        </p>
                    </section>

                    <!-- Warnings -->
                    <section v-if="warningNote" class="mt-[30px]">
                        <h2
                            class="mx-0 mt-0 mb-[12px] inline-flex items-center gap-[9px] text-[clamp(19px,2.2vw,23px)] font-bold text-danger"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M12 3L22 20H2L12 3z"
                                    stroke="var(--danger)"
                                    stroke-width="1.8"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M12 10v5M12 17.5v.4"
                                    stroke="var(--danger)"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                />
                            </svg>
                            אזהרות והתוויות נגד
                        </h2>
                        <div
                            class="rounded-card border border-[rgba(162,58,45,0.22)] bg-[rgba(162,58,45,0.06)] px-[20px] py-[16px]"
                        >
                            <p
                                class="m-0 text-[15px] leading-[1.8] font-semibold text-ink-2"
                            >
                                {{ warningNote }}
                            </p>
                            <div
                                v-if="warnings.length > 0"
                                class="mt-[12px] flex flex-wrap gap-[6px]"
                            >
                                <span
                                    v-for="(w, i) in warnings"
                                    :key="i"
                                    class="rounded-[999px] border border-[rgba(162,58,45,0.3)] bg-surface px-[12px] py-[4px] text-[12.5px] font-semibold text-danger"
                                    >{{ w }}</span
                                >
                            </div>
                        </div>
                    </section>

                    <!-- Disclaimer -->
                    <p
                        class="mt-[28px] border-t border-line pt-[20px] text-[12.5px] leading-[1.75] text-ink-4 italic"
                    >
                        המידע שלהלן נועד לצורכי ידע כללי והרחבת הדעת בלבד, ונערך
                        על ידי צוות בית מרקחת טריפוליום. אין במידע זה משום המלצה
                        לרכישת מוצר או הצהרה לגבי יעילותו. כל שימוש או הסתמכות
                        על המידע הינו באחריות הקורא בלבד, ואינו מהווה תחליף
                        לייעוץ רפואי מקצועי.
                    </p>

                    <!-- Sources -->
                    <section
                        v-if="mono.sources && mono.sources.length > 0"
                        class="mt-[28px]"
                    >
                        <h2
                            class="mx-0 mt-0 mb-[12px] text-[18px] font-bold text-ink"
                        >
                            מקורות
                        </h2>
                        <ol class="m-0 flex flex-col gap-[8px] ps-[20px]">
                            <li
                                v-for="(src, i) in mono.sources"
                                :key="i"
                                class="text-[12.5px] leading-[1.6] text-ink-3"
                            >
                                {{ src }}
                            </li>
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
.tf-herbinfo-close:hover {
    background: var(--surface-sunk) !important;
}
</style>
