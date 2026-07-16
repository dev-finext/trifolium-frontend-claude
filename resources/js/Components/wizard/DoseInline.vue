<script setup>
// Inline daily dose — compact strip directly below the formula summary.
// Units follow the formula type via DOSE_RULES.
import { ref, computed, watch } from 'vue';
import { DOSE_RULES, DOSE_UNIT_LABELS } from '@/Components/wizard/wizard-rules';

const props = defineProps({
    formula: { type: Object, required: true },
    // Patch function supplied by WizardStep3 → emit('patch', …).
    setF: { type: Function, required: true },
});

const rules = computed(() => DOSE_RULES[props.formula.typeId] || DOSE_RULES.tincture);
const dose = computed(() => props.formula.dose || rules.value.default);
const setDose = (patch) => props.setF({ dose: { ...dose.value, ...patch } });

// When the preparation form changes, the dose unit must follow. If the current
// unit is no longer valid for the new type, reset to the type's default.
watch(() => props.formula.typeId, () => {
    if (!rules.value.units.includes(dose.value.unit)) {
        props.setF({ dose: { ...rules.value.default } });
    }
});

const PRESETS = [1, 2, 3, 4];
// F30 — sane upper bound for the daily quantity; values above this are almost
// certainly a typo, so we surface a hint rather than accepting them silently.
const MAX_QTY = 20;
const qtyError = computed(() => dose.value.qty > MAX_QTY || dose.value.qty < 0);
const customPerDay = ref(false);
const isCustom = computed(() => customPerDay.value || (dose.value.perDay > 0 && !PRESETS.includes(dose.value.perDay)));
const unitLabel = computed(() => DOSE_UNIT_LABELS[dose.value.unit] || dose.value.unit);
const singleUnit = computed(() => rules.value.units.length === 1);
</script>

<template>
    <section class="card px-[20px] py-[14px]">
        <div class="flex items-center flex-wrap gap-[18px]">

            <!-- Title -->
            <div class="min-w-[96px]">
                <div class="text-[14.5px] font-semibold text-ink">מינון יומי</div>
            </div>

            <div class="w-[1px] self-stretch shrink-0 bg-(--line)" />

            <!-- Daily quantity + adaptive unit -->
            <div>
                <div class="field-label mb-[6px]">
                    <label for="dose-qty">כמות יומית</label>
                </div>
                <div class="flex items-center gap-[8px]">
                    <input
                        id="dose-qty"
                        type="number"
                        min="0"
                        :max="MAX_QTY"
                        class="input num w-[72px] h-[36px] text-center text-[15px] font-semibold"
                        :value="dose.qty"
                        :aria-invalid="qtyError"
                        :aria-describedby="qtyError ? 'dose-qty-hint' : undefined"
                        @input="setDose({ qty: +$event.target.value || 0 })"
                    />
                    <span
                        v-if="singleUnit"
                        class="inline-flex items-center h-[36px] px-[14px] text-[13.5px] font-semibold text-ink-2 bg-surface-sunk border border-line rounded-control"
                    >{{ unitLabel }}</span>
                    <select
                        v-else
                        class="select h-[36px] min-w-[96px] text-[13.5px]"
                        :value="dose.unit"
                        @change="setDose({ unit: $event.target.value })"
                    >
                        <option v-for="u in rules.units" :key="u" :value="u">{{ DOSE_UNIT_LABELS[u] }}</option>
                    </select>
                </div>
                <div v-if="qtyError" id="dose-qty-hint" role="alert" class="small mt-[6px] font-semibold text-danger">
                    יש להזין כמות בין <span class="num">0</span> ל־<span class="num">{{ MAX_QTY }}</span>.
                </div>
            </div>

            <div class="w-[1px] self-stretch shrink-0 bg-(--line)" />

            <!-- Times per day -->
            <div>
                <div class="field-label mb-[6px]">נטילות ביום</div>
                <div class="flex items-center gap-[6px]">
                    <button
                        v-for="n in PRESETS" :key="n"
                        class="num w-[38px] h-[36px] text-[14.5px] font-semibold cursor-pointer border rounded-control transition-all duration-[.12s]"
                        :class="!isCustom && dose.perDay === n ? 'border-accent bg-accent-tint text-accent-ink' : 'border-line-strong bg-surface text-ink-2'"
                        @click="customPerDay = false; setDose({ perDay: n })"
                    >{{ n }}</button>
                    <button
                        class="h-[36px] px-[12px] text-[13px] font-semibold cursor-pointer border rounded-control transition-all duration-[.12s]"
                        :class="isCustom ? 'border-accent bg-accent-tint text-accent-ink' : 'border-line-strong bg-surface text-ink-2'"
                        @click="customPerDay = true; setDose({ perDay: 0 })"
                    >אחר</button>
                    <input
                        v-if="isCustom"
                        type="number"
                        min="1"
                        class="input num w-[60px] h-[36px] text-center text-[14.5px] font-semibold"
                        placeholder="0"
                        :value="dose.perDay || ''"
                        @input="setDose({ perDay: +$event.target.value || 0 })"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
