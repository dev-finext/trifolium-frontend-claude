<script setup>
// PACKAGE SPLIT — powder / tea only. Offer to divide the prepared batch into
// several separate packages. Each extra package (beyond the first) costs ₪10.
// The number of packages is capped so every package holds at least 10 g /
// capsules (MIN_PER_PACKAGE).
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import Field from '@/components/ui/Field.vue';
import StepBtn from '@/components/shared/wizard/StepBtn.vue';
import { VOLUME_RULES } from '@/components/shared/wizard/wizard-rules';
import { MIN_PER_PACKAGE } from '@/components/shared/wizard/wizard-lib';

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
    <div class="mt-[16px]">
        <!-- The offer — a checkbox row -->
        <label
            class="flex items-center gap-[12px] px-[16px] py-[14px] border rounded-card cursor-pointer transition-[background-color,border-color] duration-[.12s] ease-[ease]"
            :class="on ? 'border-accent bg-accent-tint' : 'border-line bg-surface-sunk'"
            @click.prevent="toggle"
        >
            <span
                class="inline-flex items-center justify-center w-[20px] h-[20px] shrink-0 border-2 rounded-[5px] transition-[background-color,border-color] duration-[.12s] ease-[ease]"
                :class="on ? 'border-accent bg-accent' : 'border-line-strong bg-white'"
            >
                <Icon v-if="on" name="check" :size="13" color="#fff" :stroke="3" />
            </span>
            <span class="flex-1 min-w-0">
                <span class="block text-[14px] font-semibold" :class="on ? 'text-accent-ink' : 'text-ink'">האם תרצה לחלק לשקיות אבקה נפרדות?</span>
                <span class="block mt-[2px] text-[12px] text-ink-3">חלוקת הכמות הכוללת למספר שקיות אבקה זהות.</span>
            </span>
        </label>

        <!-- Expanded — package count + cost note + per-package calc -->
        <div v-if="on" class="mt-[12px] p-[18px] bg-surface-sunk border border-line rounded-card">
            <div class="flex flex-wrap items-start gap-[24px]">
                <Field label="מספר שקיות">
                    <div class="inline-flex items-center gap-[8px]">
                        <div
                            class="inline-flex items-center h-[40px] bg-surface border rounded-control overflow-hidden"
                            :class="invalid ? 'border-danger' : 'border-line-strong'"
                        >
                            <StepBtn label="−" :disabled="count <= 2" @click="dec" />
                            <input
                                type="number"
                                :min="2"
                                :step="1"
                                :value="formula.packageCount"
                                class="num no-spin w-[64px] h-full text-center text-[15px] font-semibold text-ink bg-transparent outline-none [-moz-appearance:textfield] border-0 border-s border-e border-line"
                                @input="setCount($event.target.value)"
                            />
                            <StepBtn label="+" :disabled="maxPacks != null && count >= maxPacks" @click="inc" />
                        </div>
                        <span class="text-[13px] text-ink-3">שקיות</span>
                    </div>

                    <!-- Validation messaging -->
                    <div v-if="invalid" class="mt-[8px] text-[12px] font-medium text-danger">
                        <template v-if="belowMin">יש לחלק ל-<span class="num">2</span> שקיות לפחות</template>
                        <template v-else>מקסימום <span class="num">{{ maxPacks }}</span> שקיות — כל שקית חייבת להכיל לפחות <span class="num">{{ MIN_PER_PACKAGE }}</span> {{ unit }}</template>
                    </div>
                    <div v-else-if="hasVolume" class="small muted mt-[8px]">
                        עד <span class="num">{{ maxPacks }}</span> שקיות (מינימום <span class="num">{{ MIN_PER_PACKAGE }}</span> {{ unit }} לשקית)
                    </div>
                    <div v-else class="small muted mt-[8px]">בחר נפח פורמולה כדי לחשב את החלוקה</div>
                </Field>

                <!-- Per-package volume calc -->
                <Field v-if="hasVolume && !invalid" label="כל שקית תכיל">
                    <div class="inline-flex items-center gap-[8px] h-[40px] px-[14px] py-0 text-[14px] font-semibold text-accent-ink bg-accent-tint border border-accent rounded-control">
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
            <div class="flex items-start gap-[10px] mt-[16px] pt-[14px] text-[13px] leading-[1.5] text-ink-2 border-t border-t-line">
                <Icon name="info" :size="15" color="var(--ink-3)" class="mt-[1px] shrink-0" />
                <span>
                    כל שקית נוספת מעבר לראשונה מתומחרת ב-<strong class="num text-ink">₪10</strong>.
                    <template v-if="!invalid && count > 1"> תוספת לפורמולה זו: <strong class="num text-ink">₪{{ (count - 1) * 10 }}</strong> ({{ count - 1 }} שקיות נוספות).</template>
                </span>
            </div>
        </div>
    </div>
</template>
