<script setup>
// Step 5 — PATH B: Save only (no patient). No pricing, no payment.
// Saves the composed formula to the personal library and routes there.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FormulaSummaryCard from '@/Components/wizard/FormulaSummaryCard.vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import { useSavedFormulasStore } from '@/stores/saved-formulas';
import { visit } from '@/lib/routes';

const props = defineProps({
    formula: { type: Object, required: true },
});

// `submit` kept for API parity with the prototype's onSubmit (unused: the save
// flow routes to the library after the spinner instead of showing a screen).
const emit = defineEmits(['back', 'submit']);

const saved = useSavedFormulasStore();

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
const totalQty = computed(() => props.formula.ingredients.reduce((s, i) => s + i.qty, 0));
const totalVol = computed(() => {
    const f = props.formula;
    if (f.typeId === 'capsule') return `${f.capsuleCount * (f.capsuleMultiPacks ? 2 : 1)} כמוסות`;
    if (f.typeId === 'tincture') return `${f.tinctureVolume} ${ftype.value.unit}`;
    return `${totalQty.value} ${ftype.value.unit}`;
});

const nameError = ref(false);
const saving = ref(false);

function handleSave() {
    const f = props.formula;
    // Guard: a formula may never be saved without a name.
    if (!f.name || !f.name.trim()) {
        nameError.value = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Build a SAVED_FORMULAS-shaped entry from the live formula.
    const summary = f.ingredients
        .map((i) => (HERBS.find((h) => h.id === i.herbId) || {}).heb)
        .filter(Boolean)
        .slice(0, 4)
        .join(' · ');

    const entry = {
        id: 'sf_' + Date.now(),
        name: f.name.trim(),
        summary,
        typeId: f.typeId,
        tinctureVolume: f.tinctureVolume,
        capsuleCount: f.capsuleCount,
        capsuleMultiPacks: f.capsuleMultiPacks,
        ingredients: f.ingredients.map((i) => ({ herbId: i.herbId, qty: i.qty })),
        externalNotes: f.externalNotes,
        lastUsed: 'זה עתה נשמרה',
        usageCount: 0,
    };

    // Prepend + flag for the arrival highlight (replaces mutating window.TFDATA
    // + window.__tfHighlightFormula).
    // TODO(backend): persist via API; `add` becomes a POST call.
    saved.add(entry);

    // Show a brief loading state, then route to the library.
    saving.value = true;
    setTimeout(() => {
        visit('my-formulas');
        window.scrollTo(0, 0);
    }, 700);
}
</script>

<template>
    <div v-if="saving" class="card" style="padding: 72px 32px; text-align: center">
        <div class="tf-save-spinner" style="width: 44px; height: 44px; margin: 0 auto 20px; border: 3px solid var(--line); border-top-color: var(--accent); border-radius: 50%" />
        <div style="font-size: 16px; font-weight: 600">שומר את הפורמולה…</div>
        <p class="muted" style="margin: 6px 0 0; font-size: 13px">מעביר אותך אל הפורמולות שלי</p>
    </div>

    <div v-else class="col gap-24">
        <div>
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 6px">שמירת פורמולה</h2>
            <p class="muted" style="margin: 0; font-size: 14px">
                הפורמולה תישמר בטיוטות. לא תיווצר הזמנה ולא יישלח קישור תשלום.
            </p>
        </div>

        <!-- Missing-name error -->
        <div
            v-if="nameError"
            style="border-inline-start: 3px solid #c0392b; background: #fdf2f2; border-radius: var(--r-card); padding: 14px 18px; display: flex; gap: 12px; align-items: flex-start"
        >
            <Icon name="info" :size="18" color="#c0392b" style="margin-top: 2px" />
            <div style="font-size: 13px; line-height: 1.6; color: #9a2f2f">
                <strong style="font-weight: 700">לא ניתן לשמור פורמולה ללא שם.</strong> חזור לרקיחת הפורמולה והזן שם לפני השמירה.
            </div>
        </div>

        <FormulaSummaryCard :formula="formula" :patient-label="null" :total-vol="totalVol" />

        <!-- Info notice — start accent border -->
        <div
            style="border-inline-start: 3px solid var(--accent); background: var(--accent-tint); border-radius: var(--r-card); padding: 14px 18px; display: flex; gap: 12px; align-items: flex-start"
        >
            <Icon name="info" :size="18" color="var(--accent)" style="margin-top: 2px" />
            <div style="font-size: 13px; line-height: 1.6; color: var(--accent-ink)">
                <strong style="font-weight: 700">שמירה בלבד — ללא יצירת הזמנה.</strong> פורמולה זו תישמר תחת <em>הפורמולות שלי</em>. ניתן לקשר אותה למטופל ולהזמין בכל עת.
            </div>
        </div>

        <div class="col gap-12">
            <button
                class="btn btn--accent"
                style="width: 100%; height: 48px; font-size: 16px; font-weight: 600"
                @click="handleSave"
            >
                <Icon name="save" :size="18" color="#fff" />
                שמור פורמולה
            </button>
            <button class="btn btn--ghost" style="width: 100%" @click="emit('back')">
                <Icon name="arrow_right" :size="16" /> חזור לרקיחת הפורמולה
            </button>
        </div>
    </div>
</template>

<style>
/* Spinner for the brief save state (was an inline <style> in the prototype). */
.tf-save-spinner {
    animation: tf-spin 0.7s linear infinite;
}
@keyframes tf-spin {
    to { transform: rotate(360deg); }
}
</style>
