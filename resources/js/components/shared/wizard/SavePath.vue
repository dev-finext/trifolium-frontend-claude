<script setup>
// Step 5 — PATH B: Save only (no patient). No pricing, no payment.
// Saves the composed formula to the personal library and routes there.
import { computed, ref } from 'vue';
import FormulaSummaryCard from '@/components/shared/wizard/FormulaSummaryCard.vue';
import Icon from '@/components/ui/Icon.vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { useSavedFormulasStore } from '@/stores/savedFormulas';

const props = defineProps({
    formula: { type: Object, required: true },
});

// `submit` kept for API parity with the prototype's onSubmit (unused: the save
// flow routes to the library after the spinner instead of showing a screen).
const emit = defineEmits(['back', 'submit']);

const saved = useSavedFormulasStore();

const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === props.formula.typeId),
);
const totalQty = computed(() =>
    props.formula.ingredients.reduce((s, i) => s + i.qty, 0),
);
const totalVol = computed(() => {
    const f = props.formula;

    if (f.typeId === 'capsule') {
        return `${f.capsuleCount * (f.capsuleMultiPacks ? 2 : 1)} כמוסות`;
    }

    if (f.typeId === 'tincture') {
        return `${f.tinctureVolume} ${ftype.value.unit}`;
    }

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
        ingredients: f.ingredients.map((i) => ({
            herbId: i.herbId,
            qty: i.qty,
        })),
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
    <div v-if="saving" class="card px-[32px] py-[72px] text-center">
        <div
            class="tf-save-spinner mx-auto mt-0 mb-[20px] h-[44px] w-[44px] rounded-full border-[3px] border-line border-t-accent"
        />
        <div class="text-[16px] font-semibold">שומר את הפורמולה…</div>
        <p class="muted mx-0 mt-[6px] mb-0 text-[13px]">
            מעביר אותך אל הפורמולות שלי
        </p>
    </div>

    <div v-else class="col gap-[24px]">
        <div>
            <h2 class="m-0 mb-[6px] text-[20px] font-semibold">
                שמירת פורמולה
            </h2>
            <p class="muted m-0 text-[14px]">
                הפורמולה תישמר בטיוטות. לא תיווצר הזמנה ולא יישלח קישור תשלום.
            </p>
        </div>

        <!-- Missing-name error -->
        <div
            v-if="nameError"
            class="flex items-start gap-[12px] rounded-card border-s-[3px] border-s-[#c0392b] bg-[#fdf2f2] px-[18px] py-[14px]"
        >
            <Icon name="info" :size="18" color="#c0392b" class="mt-[2px]" />
            <div class="text-[13px] leading-[1.6] text-[#9a2f2f]">
                <strong class="font-bold">לא ניתן לשמור פורמולה ללא שם.</strong>
                חזור לרקיחת הפורמולה והזן שם לפני השמירה.
            </div>
        </div>

        <FormulaSummaryCard
            :formula="formula"
            :patient-label="null"
            :total-vol="totalVol"
        />

        <!-- Info notice — start accent border -->
        <div
            class="flex items-start gap-[12px] rounded-card border-s-[3px] border-s-accent bg-accent-tint px-[18px] py-[14px]"
        >
            <Icon
                name="info"
                :size="18"
                color="var(--accent)"
                class="mt-[2px]"
            />
            <div class="text-[13px] leading-[1.6] text-accent-ink">
                <strong class="font-bold">שמירה בלבד — ללא יצירת הזמנה.</strong>
                פורמולה זו תישמר תחת <em>הפורמולות שלי</em>. ניתן לקשר אותה
                למטופל ולהזמין בכל עת.
            </div>
        </div>

        <div class="col gap-[12px]">
            <button
                class="btn btn--accent h-[48px] w-full text-[16px] font-semibold"
                @click="handleSave"
            >
                <Icon name="save" :size="18" color="#fff" />
                שמור פורמולה
            </button>
            <button class="btn btn--ghost w-full" @click="emit('back')">
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
    to {
        transform: rotate(360deg);
    }
}
</style>
