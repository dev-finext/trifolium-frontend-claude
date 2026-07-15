<script setup>
// PACKAGE SPLIT — powder / tea only. Offer to divide the prepared batch into
// several separate packages. Each extra package (beyond the first) costs ₪10.
// The number of packages is capped so every package holds at least 10 g /
// capsules (MIN_PER_PACKAGE).
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import Field from '@/Components/ui/Field.vue';
import StepBtn from '@/Components/wizard/StepBtn.vue';
import { VOLUME_RULES } from '@/Components/wizard/wizard-rules';
import { MIN_PER_PACKAGE } from '@/Components/wizard/wizard-lib';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const rules = computed(() => VOLUME_RULES[props.formula.typeId]);
const unit = computed(() => rules.value?.unit || 'גרם');
const volume = computed(() => props.formula.formulaVolume); // null until chosen
const on = computed(() => !!props.formula.splitPackaging);
const count = computed(() => Math.max(2, Math.floor(props.formula.packageCount || 2)));

// Max packages so each holds ≥ MIN_PER_PACKAGE. Needs a chosen volume.
const maxPacks = computed(() => (volume.value != null ? Math.floor(volume.value / MIN_PER_PACKAGE) : null));
const hasVolume = computed(() => volume.value != null);

const tooMany = computed(() => maxPacks.value != null && count.value > maxPacks.value);
const belowMin = computed(() => count.value < 2);
const invalid = computed(() => belowMin.value || tooMany.value);

function toggle() {
    if (on.value) props.setF({ splitPackaging: false });
    else props.setF({ splitPackaging: true, packageCount: Math.max(2, Math.floor(props.formula.packageCount || 2)) });
}
const setCount = (n) => props.setF({ packageCount: Math.max(1, Math.floor(+n || 0)) });
const dec = () => props.setF({ packageCount: Math.max(2, count.value - 1) });
const inc = () => props.setF({ packageCount: maxPacks.value != null ? Math.min(maxPacks.value, count.value + 1) : count.value + 1 });

// Even/uneven split of the volume across the packages.
const split = computed(() => {
    if (!hasVolume.value || invalid.value) return null;
    const base = Math.floor(volume.value / count.value);
    const rem = volume.value - base * count.value; // this many packages get one extra unit
    return { base, rem };
});
</script>

<template>
    <div style="margin-top: 16px">
        <!-- The offer — a checkbox row -->
        <label
            :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                border: '1px solid ' + (on ? 'var(--accent)' : 'var(--line)'),
                background: on ? 'var(--accent-tint)' : 'var(--surface-sunk)',
                borderRadius: 'var(--r-card)',
                cursor: 'pointer',
                transition: 'background-color .12s ease, border-color .12s ease',
            }"
            @click.prevent="toggle"
        >
            <span
                :style="{
                    width: '20px', height: '20px',
                    borderRadius: '5px',
                    flexShrink: 0,
                    border: '2px solid ' + (on ? 'var(--accent)' : 'var(--line-strong)'),
                    background: on ? 'var(--accent)' : '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color .12s ease, border-color .12s ease',
                }"
            >
                <Icon v-if="on" name="check" :size="13" color="#fff" :stroke="3" />
            </span>
            <span style="flex: 1; min-width: 0">
                <span :style="{ display: 'block', fontSize: '14px', fontWeight: 600, color: on ? 'var(--accent-ink)' : 'var(--ink)' }">האם תרצה לחלק לשקיות אבקה נפרדות?</span>
                <span style="display: block; font-size: 12px; color: var(--ink-3); margin-top: 2px">חלוקת הכמות הכוללת למספר שקיות אבקה זהות.</span>
            </span>
        </label>

        <!-- Expanded — package count + cost note + per-package calc -->
        <div v-if="on" style="margin-top: 12px; padding: 18px; background: var(--surface-sunk); border: 1px solid var(--line); border-radius: var(--r-card)">
            <div style="display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-start">
                <Field label="מספר שקיות">
                    <div style="display: inline-flex; align-items: center; gap: 8px">
                        <div
                            :style="{
                                display: 'inline-flex',
                                alignItems: 'center',
                                border: '1px solid ' + (invalid ? 'var(--danger)' : 'var(--line-strong)'),
                                borderRadius: 'var(--r-control)',
                                overflow: 'hidden',
                                height: '40px',
                                background: '#fff',
                            }"
                        >
                            <StepBtn label="−" :disabled="count <= 2" @click="dec" />
                            <input
                                type="number"
                                :min="2"
                                :step="1"
                                :value="formula.packageCount"
                                class="num no-spin"
                                style="width: 64px; height: 100%; border: none; border-inline: 1px solid var(--line); text-align: center; font-size: 15px; font-weight: 600; color: var(--ink); outline: none; background: transparent; -moz-appearance: textfield"
                                @input="setCount($event.target.value)"
                            />
                            <StepBtn label="+" :disabled="maxPacks != null && count >= maxPacks" @click="inc" />
                        </div>
                        <span style="font-size: 13px; color: var(--ink-3)">שקיות</span>
                    </div>

                    <!-- Validation messaging -->
                    <div v-if="invalid" style="font-size: 12px; color: var(--danger); margin-top: 8px; font-weight: 500">
                        <template v-if="belowMin">יש לחלק ל-<span class="num">2</span> שקיות לפחות</template>
                        <template v-else>מקסימום <span class="num">{{ maxPacks }}</span> שקיות — כל שקית חייבת להכיל לפחות <span class="num">{{ MIN_PER_PACKAGE }}</span> {{ unit }}</template>
                    </div>
                    <div v-else-if="hasVolume" class="small muted mt-8">
                        עד <span class="num">{{ maxPacks }}</span> שקיות (מינימום <span class="num">{{ MIN_PER_PACKAGE }}</span> {{ unit }} לשקית)
                    </div>
                    <div v-else class="small muted mt-8">בחר נפח פורמולה כדי לחשב את החלוקה</div>
                </Field>

                <!-- Per-package volume calc -->
                <Field v-if="hasVolume && !invalid" label="כל שקית תכיל">
                    <div style="display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 14px; background: var(--accent-tint); border: 1px solid var(--accent); border-radius: var(--r-control); font-size: 14px; font-weight: 600; color: var(--accent-ink)">
                        <Icon name="flask" :size="14" color="var(--accent)" />
                        <template v-if="split.rem === 0">
                            <span class="num">{{ count }}</span> שקיות × <span class="num">{{ split.base }}</span> {{ unit }}
                        </template>
                        <template v-else>
                            <span class="num">{{ split.rem }}</span> × <span class="num">{{ split.base + 1 }}</span> {{ unit }}
                            {{ ' + ' }}
                            <span class="num">{{ count - split.rem }}</span> × <span class="num">{{ split.base }}</span> {{ unit }}
                        </template>
                    </div>
                </Field>
            </div>

            <!-- Cost note -->
            <div style="display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); font-size: 13px; color: var(--ink-2); line-height: 1.5">
                <Icon name="info" :size="15" color="var(--ink-3)" style="margin-top: 1px; flex-shrink: 0" />
                <span>
                    כל שקית נוספת מעבר לראשונה מתומחרת ב-<strong class="num" style="color: var(--ink)">₪10</strong>.
                    <template v-if="!invalid && count > 1"> תוספת לפורמולה זו: <strong class="num" style="color: var(--ink)">₪{{ (count - 1) * 10 }}</strong> ({{ count - 1 }} שקיות נוספות).</template>
                </span>
            </div>
        </div>
    </div>
</template>
