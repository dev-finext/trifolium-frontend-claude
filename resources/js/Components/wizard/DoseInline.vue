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
const customPerDay = ref(false);
const isCustom = computed(() => customPerDay.value || (dose.value.perDay > 0 && !PRESETS.includes(dose.value.perDay)));
const unitLabel = computed(() => DOSE_UNIT_LABELS[dose.value.unit] || dose.value.unit);
const singleUnit = computed(() => rules.value.units.length === 1);
</script>

<template>
    <section class="card" style="padding: 14px 20px">
        <div style="display: flex; align-items: center; gap: 18px; flex-wrap: wrap">

            <!-- Title -->
            <div style="min-width: 96px">
                <div style="font-size: 14.5px; font-weight: 600; color: var(--ink)">מינון יומי</div>
            </div>

            <div style="width: 1px; align-self: stretch; background: var(--line); flex-shrink: 0" />

            <!-- Daily quantity + adaptive unit -->
            <div>
                <div class="field-label" style="margin-bottom: 6px">כמות יומית</div>
                <div style="display: flex; align-items: center; gap: 8px">
                    <input
                        type="number"
                        min="0"
                        class="input num"
                        :value="dose.qty"
                        style="width: 72px; height: 36px; text-align: center; font-size: 15px; font-weight: 600"
                        @input="setDose({ qty: +$event.target.value || 0 })"
                    />
                    <span
                        v-if="singleUnit"
                        style="display: inline-flex; align-items: center; height: 36px; padding-inline: 14px; border-radius: var(--r-control); border: 1px solid var(--line); background: var(--surface-sunk); font-size: 13.5px; font-weight: 600; color: var(--ink-2)"
                    >{{ unitLabel }}</span>
                    <select
                        v-else
                        class="select"
                        :value="dose.unit"
                        style="height: 36px; font-size: 13.5px; min-width: 96px"
                        @change="setDose({ unit: $event.target.value })"
                    >
                        <option v-for="u in rules.units" :key="u" :value="u">{{ DOSE_UNIT_LABELS[u] }}</option>
                    </select>
                </div>
            </div>

            <div style="width: 1px; align-self: stretch; background: var(--line); flex-shrink: 0" />

            <!-- Times per day -->
            <div>
                <div class="field-label" style="margin-bottom: 6px">נטילות ביום</div>
                <div style="display: flex; align-items: center; gap: 6px">
                    <button
                        v-for="n in PRESETS" :key="n"
                        class="num"
                        :style="{
                            width: '38px', height: '36px', borderRadius: 'var(--r-control)',
                            border: '1px solid ' + (!isCustom && dose.perDay === n ? 'var(--accent)' : 'var(--line-strong)'),
                            background: !isCustom && dose.perDay === n ? 'var(--accent-tint)' : 'var(--surface)',
                            color: !isCustom && dose.perDay === n ? 'var(--accent-ink)' : 'var(--ink-2)',
                            fontSize: '14.5px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all .12s',
                        }"
                        @click="customPerDay = false; setDose({ perDay: n })"
                    >{{ n }}</button>
                    <button
                        :style="{
                            height: '36px', paddingInline: '12px', borderRadius: 'var(--r-control)',
                            border: '1px solid ' + (isCustom ? 'var(--accent)' : 'var(--line-strong)'),
                            background: isCustom ? 'var(--accent-tint)' : 'var(--surface)',
                            color: isCustom ? 'var(--accent-ink)' : 'var(--ink-2)',
                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                            transition: 'all .12s',
                        }"
                        @click="customPerDay = true; setDose({ perDay: 0 })"
                    >אחר</button>
                    <input
                        v-if="isCustom"
                        type="number"
                        min="1"
                        class="input num"
                        placeholder="0"
                        :value="dose.perDay || ''"
                        style="width: 60px; height: 36px; text-align: center; font-size: 14.5px; font-weight: 600"
                        @input="setDose({ perDay: +$event.target.value || 0 })"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
