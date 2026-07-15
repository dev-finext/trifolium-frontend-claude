<script setup>
// רשימת הפורמולות שלי — the practitioner's library of saved formulas.
// Card grid over the saved-formulas store, with search, load-into-lab and
// delete, plus the ready-made system-formula templates below a divider.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import SearchInput from '@/Components/ui/SearchInput.vue';
import MyFormulaCard from '@/Components/my-formulas/MyFormulaCard.vue';
import SystemFormulaCard from '@/Components/my-formulas/SystemFormulaCard.vue';
import { visit } from '@/lib/routes';
import { useWizardStore } from '@/stores/wizard';
import { useSavedFormulasStore } from '@/stores/saved-formulas';
import { SYSTEM_FORMULAS } from '@/data/mock';

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
    if (!id) return;
    highlightId.value = id;
    highlightTimer = window.setTimeout(() => { highlightId.value = null; }, 3600);
});
onBeforeUnmount(() => {
    if (highlightTimer) window.clearTimeout(highlightTimer);
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

const filtered = computed(() => savedFormulas.state.list.filter(
    (f) => !search.value || f.name.includes(search.value) || f.summary.includes(search.value),
));
const filteredSystem = computed(() => props.systemFormulas.filter(
    (f) => !searchSystem.value
        || f.name.includes(searchSystem.value)
        || f.summary.includes(searchSystem.value)
        || (f.description || '').includes(searchSystem.value),
));
const totalUses = computed(() => savedFormulas.state.list.reduce((s, f) => s + (f.usageCount || 0), 0));
</script>

<template>
    <Head title="הפורמולות שלי" />
    <div class="page" data-screen-label="רשימת הפורמולות שלי">
        <div class="page__inner page__inner--wide">

            <!-- Breadcrumb -->
            <a
                style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); cursor: pointer; margin-bottom: 18px"
                @click="goBack"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Head -->
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 24px">
                <div>
                    <div
                        :style="{
                            fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase',
                            color: 'var(--accent)', fontWeight: 700, marginBottom: '8px',
                        }"
                    >האיזור האישי שלי</div>
                    <h1 class="page-title" style="margin: 0">רשימת הפורמולות שלי</h1>
                    <p class="page-sub" style="margin-top: 6px">
                        <span class="num">{{ savedFormulas.state.list.length }}</span> פורמולות שמורות · נטענו יחד <span class="num">{{ totalUses }}</span> פעמים. טען כל פורמולה ישירות למעבדה.
                    </p>
                </div>
            </div>

            <!-- Search -->
            <div style="display: flex; justify-content: flex-end; margin-bottom: 18px">
                <div style="width: 320px; max-width: 100%">
                    <SearchInput v-model="search" placeholder="חפש לפי שם פורמולה או רכיב …" />
                </div>
            </div>

            <!-- ── הפורמולות שלי section ── -->
            <div style="margin-bottom: 48px">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px">
                    <h2 style="margin: 0; font-size: 14px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3)">הפורמולות שלי</h2>
                    <span class="small muted">({{ filtered.length }})</span>
                </div>

                <div v-if="filtered.length === 0" class="card" style="padding: 48px 24px; text-align: center">
                    <div
                        :style="{
                            width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-sunk)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '14px', color: 'var(--ink-3)',
                        }"
                    ><Icon :name="search ? 'search' : 'clipboard_list'" :size="22" /></div>
                    <div style="font-size: 15px; font-weight: 500; margin-bottom: 6px">
                        {{ search ? 'לא נמצאו פורמולות מתאימות' : 'עדיין אין פורמולות שמורות' }}
                    </div>
                    <div class="small muted" style="margin-bottom: 18px">
                        {{ search ? 'נסה מונח חיפוש אחר' : 'כל פורמולה שתשמור במעבדה תופיע כאן לטעינה מהירה' }}
                    </div>
                    <button class="btn btn--ghost" @click="search ? (search = '') : goCompose()">
                        {{ search ? 'נקה חיפוש' : 'צור פורמולה ראשונה' }}
                    </button>
                </div>
                <div v-else class="formula-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px">
                    <MyFormulaCard
                        v-for="f in filtered"
                        :key="f.id"
                        :saved="f"
                        :highlighted="f.id === highlightId"
                        :confirming="confirmId === f.id"
                        @load="handleLoad(f)"
                        @request-delete="confirmId = f.id"
                        @cancel-delete="confirmId = null"
                        @delete="handleDelete(f.id)"
                    />
                </div>
            </div>

            <!-- ── פורמולות מערכת section ── -->
            <div>
                <!-- Section divider -->
                <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 20px">
                    <div style="flex: 1; height: 1px; background: var(--line)" />
                    <div style="text-align: center; flex-shrink: 0">
                        <div style="display: flex; align-items: center; gap: 8px; justify-content: center">
                            <Icon name="clipboard_list" :size="16" color="oklch(0.54 0.10 240)" />
                            <span style="font-size: 15px; font-weight: 600; color: var(--ink)">פורמולות מערכת</span>
                        </div>
                        <div class="small muted" style="margin-top: 3px">פורמולות מוכנות שנוצרו על ידי צוות טריפוליום · ניתן לערוך הכל</div>
                    </div>
                    <div style="flex: 1; height: 1px; background: var(--line)" />
                </div>

                <!-- System search -->
                <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-end; margin-bottom: 18px">
                    <span class="small muted">({{ filteredSystem.length }})</span>
                    <div style="width: 320px; max-width: 100%">
                        <SearchInput v-model="searchSystem" placeholder="חפש פורמולת מערכת לפי שם או רכיב …" />
                    </div>
                </div>

                <div v-if="filteredSystem.length === 0" class="card" style="padding: 32px 24px; text-align: center">
                    <div class="small muted">לא נמצאו שבלונות מערכת מתאימות לחיפוש</div>
                </div>
                <div v-else class="formula-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 16px">
                    <SystemFormulaCard
                        v-for="f in filteredSystem"
                        :key="f.id"
                        :formula="f"
                        @load="handleLoad(f)"
                    />
                </div>
            </div>

        </div>
    </div>
</template>

<style>
/* Arrival glow for the card that was just saved (see saved-formulas store). */
@keyframes tfSavedGlow {
    0% { box-shadow: 0 0 0 4px var(--accent-tint), 0 0 0 2px var(--accent), 0 12px 30px rgba(20,28,24,0.12); }
    100% { box-shadow: 0 0 0 0 var(--accent-tint), 0 0 0 2px var(--accent), 0 10px 26px rgba(20,28,24,0.09); }
}
.formula-just-saved {
    border-color: var(--accent) !important;
    animation: tfSavedGlow 1.1s ease-out 2 alternate;
    box-shadow: 0 0 0 2px var(--accent), 0 10px 26px rgba(20,28,24,0.09) !important;
}
@media (prefers-reduced-motion: reduce) {
    .formula-just-saved { animation: none; }
}
</style>
