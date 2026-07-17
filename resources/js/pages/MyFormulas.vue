<script setup>
// רשימת הפורמולות שלי — the practitioner's library of saved formulas.
// Card grid over the savedFormulas store, with search, load-into-lab and
// delete, plus the ready-made system-formula templates below a divider.
import { Head } from '@inertiajs/vue3';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import MyFormulaCard from '@/components/shared/my-formulas/MyFormulaCard.vue';
import SystemFormulaCard from '@/components/shared/my-formulas/SystemFormulaCard.vue';
import Icon from '@/components/ui/Icon.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import { SYSTEM_FORMULAS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { useSavedFormulasStore } from '@/stores/savedFormulas';
import { useWizardStore } from '@/stores/wizard';

// TODO(backend): the Laravel controller can pass the system templates as a
// real prop; the mock default keeps the page working standalone.
const props = defineProps({
    systemFormulas: { type: Array, default: () => SYSTEM_FORMULAS },
});

const wizard = useWizardStore();
const savedFormulas = useSavedFormulasStore();

const search = ref('');
const searchSystem = ref('');
const confirmId = ref(null);
const highlightId = ref(null);

// If we arrived here right after saving a formula, flag its card and let it
// glow for a few seconds, then quietly settle back to the default look.
let highlightTimer = null;
onMounted(() => {
    const id = savedFormulas.consumeHighlight();

    if (!id) {
        return;
    }

    highlightId.value = id;
    highlightTimer = window.setTimeout(() => {
        highlightId.value = null;
    }, 3600);
});
onBeforeUnmount(() => {
    if (highlightTimer) {
        window.clearTimeout(highlightTimer);
    }
});

const goBack = () => visit('home');
const goCompose = () => visit('compounding');

// "טען למעבדה" — park the formula for the wizard, then open the lab.
function handleLoad(formula) {
    wizard.setPendingFormula(formula);
    visit('compounding');
}

function handleDelete(id) {
    savedFormulas.remove(id);
    confirmId.value = null;
}

const filtered = computed(() =>
    savedFormulas.state.list.filter(
        (f) =>
            !search.value ||
            f.name.includes(search.value) ||
            f.summary.includes(search.value),
    ),
);
const filteredSystem = computed(() =>
    props.systemFormulas.filter(
        (f) =>
            !searchSystem.value ||
            f.name.includes(searchSystem.value) ||
            f.summary.includes(searchSystem.value) ||
            (f.description || '').includes(searchSystem.value),
    ),
);
const totalUses = computed(() =>
    savedFormulas.state.list.reduce((s, f) => s + (f.usageCount || 0), 0),
);
</script>

<template>
    <Head title="הפורמולות שלי" />
    <div class="page" data-screen-label="רשימת הפורמולות שלי">
        <div class="page__inner page__inner--wide">
            <!-- Breadcrumb -->
            <a
                class="mb-[18px] inline-flex cursor-pointer items-center gap-[6px] text-[13px] text-ink-3"
                @click="goBack"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Head -->
            <div
                class="mb-[24px] flex flex-wrap items-start justify-between gap-[20px]"
            >
                <div>
                    <div
                        class="mb-[8px] text-[11px] font-bold tracking-[0.16em] text-accent uppercase"
                    >
                        האיזור האישי שלי
                    </div>
                    <h1 class="page-title m-0">רשימת הפורמולות שלי</h1>
                    <p class="page-sub mt-[6px]">
                        <span class="num">{{
                            savedFormulas.state.list.length
                        }}</span>
                        פורמולות שמורות · נטענו יחד
                        <span class="num">{{ totalUses }}</span> פעמים. טען כל
                        פורמולה ישירות למעבדה.
                    </p>
                </div>
            </div>

            <!-- Search -->
            <div class="mb-[18px] flex justify-end">
                <div class="w-[320px] max-w-full">
                    <SearchInput
                        v-model="search"
                        placeholder="חפש לפי שם פורמולה או רכיב …"
                    />
                </div>
            </div>

            <!-- ── הפורמולות שלי section ── -->
            <div class="mb-[48px]">
                <div class="mb-[16px] flex items-center gap-[10px]">
                    <h2
                        class="m-0 text-[14px] font-bold tracking-[0.08em] text-ink-3 uppercase"
                    >
                        הפורמולות שלי
                    </h2>
                    <span class="small muted">({{ filtered.length }})</span>
                </div>

                <div
                    v-if="filtered.length === 0"
                    class="card px-[24px] py-[48px] text-center"
                >
                    <div
                        class="mb-[14px] inline-flex h-[48px] w-[48px] items-center justify-center rounded-[50%] bg-surface-sunk text-ink-3"
                    >
                        <Icon
                            :name="search ? 'search' : 'clipboard_list'"
                            :size="22"
                        />
                    </div>
                    <div class="mb-[6px] text-[15px] font-medium">
                        {{
                            search
                                ? 'לא נמצאו פורמולות מתאימות'
                                : 'עדיין אין פורמולות שמורות'
                        }}
                    </div>
                    <div class="small muted mb-[18px]">
                        {{
                            search
                                ? 'נסה מונח חיפוש אחר'
                                : 'כל פורמולה שתשמור במעבדה תופיע כאן לטעינה מהירה'
                        }}
                    </div>
                    <button
                        class="btn btn--ghost"
                        @click="search ? (search = '') : goCompose()"
                    >
                        {{ search ? 'נקה חיפוש' : 'צור פורמולה ראשונה' }}
                    </button>
                </div>
                <div
                    v-else
                    class="formula-grid grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-[16px]"
                >
                    <MyFormulaCard
                        v-for="formula in filtered"
                        :key="formula.id"
                        :saved="formula"
                        :highlighted="formula.id === highlightId"
                        :confirming="confirmId === formula.id"
                        @load="handleLoad(formula)"
                        @request-delete="confirmId = formula.id"
                        @cancel-delete="confirmId = null"
                        @delete="handleDelete(formula.id)"
                    />
                </div>
            </div>

            <!-- ── פורמולות מערכת section ── -->
            <div>
                <!-- Section divider -->
                <div class="mb-[20px] flex items-center gap-[18px]">
                    <div class="h-[1px] flex-1 bg-(--line)" />
                    <div class="shrink-0 text-center">
                        <div class="flex items-center justify-center gap-[8px]">
                            <Icon
                                name="clipboard_list"
                                :size="16"
                                color="oklch(0.54 0.10 240)"
                            />
                            <span class="text-[15px] font-semibold text-ink"
                                >פורמולות מערכת</span
                            >
                        </div>
                        <div class="small muted mt-[3px]">
                            פורמולות מוכנות שנוצרו על ידי צוות טריפוליום · ניתן
                            לערוך הכל
                        </div>
                    </div>
                    <div class="h-[1px] flex-1 bg-(--line)" />
                </div>

                <!-- System search -->
                <div class="mb-[18px] flex items-center justify-end gap-[10px]">
                    <span class="small muted"
                        >({{ filteredSystem.length }})</span
                    >
                    <div class="w-[320px] max-w-full">
                        <SearchInput
                            v-model="searchSystem"
                            placeholder="חפש פורמולת מערכת לפי שם או רכיב …"
                        />
                    </div>
                </div>

                <div
                    v-if="filteredSystem.length === 0"
                    class="card px-[24px] py-[32px] text-center"
                >
                    <div class="small muted">
                        לא נמצאו שבלונות מערכת מתאימות לחיפוש
                    </div>
                </div>
                <div
                    v-else
                    class="formula-grid grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-[16px]"
                >
                    <SystemFormulaCard
                        v-for="formula in filteredSystem"
                        :key="formula.id"
                        :formula="formula"
                        @load="handleLoad(formula)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Arrival glow for the card that was just saved (see savedFormulas store). */
@keyframes tfSavedGlow {
    0% {
        box-shadow:
            0 0 0 4px var(--accent-tint),
            0 0 0 2px var(--accent),
            0 12px 30px rgba(20, 28, 24, 0.12);
    }
    100% {
        box-shadow:
            0 0 0 0 var(--accent-tint),
            0 0 0 2px var(--accent),
            0 10px 26px rgba(20, 28, 24, 0.09);
    }
}
.formula-just-saved {
    border-color: var(--accent) !important;
    animation: tfSavedGlow 1.1s ease-out 2 alternate;
    box-shadow:
        0 0 0 2px var(--accent),
        0 10px 26px rgba(20, 28, 24, 0.09) !important;
}
@media (prefers-reduced-motion: reduce) {
    .formula-just-saved {
        animation: none;
    }
}
</style>
