<script setup>
// Tincture-specific subsection: a single opt-in question — "evaporate?".
// Default is NO (alcohol extract only). The carrier options appear only once
// the user actively turns the question on.
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import { CARRIER_OPTIONS } from '@/components/shared/wizard/wizard-lib';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const on = computed(() => !!props.formula.evaporation && props.formula.evaporation !== 'none');

function toggle() {
    if (on.value) props.setF({ evaporation: 'none' });
    else props.setF({ evaporation: CARRIER_OPTIONS[0].id });
}
</script>

<template>
    <div
        class="mt-[16px] bg-surface-sunk border border-line rounded-card transition-[padding] duration-[.12s] ease-[ease]"
        :class="on ? 'p-[18px]' : 'px-[14px] py-[8px]'"
    >
        <!-- The opt-in question — a single checkbox row, defaults to off -->
        <label
            class="flex items-center gap-[12px] px-0 py-[4px] cursor-pointer"
            @click.prevent="toggle"
        >
            <span
                class="inline-flex items-center justify-center shrink-0 border-2 rounded-[5px] transition-[background-color,border-color] duration-[.12s] ease-[ease]"
                :class="on ? 'w-[20px] h-[20px] border-accent bg-accent' : 'w-[18px] h-[18px] border-line-strong bg-white'"
            >
                <Icon v-if="on" name="check" :size="13" color="#fff" :stroke="3" />
            </span>
            <span class="flex flex-1 min-w-0 items-baseline flex-wrap gap-[8px]">
                <span class="font-semibold" :class="on ? 'text-[14px] text-accent-ink' : 'text-[13px] text-ink'">האם לנדף את הטינקטורה?</span>
                <span class="text-ink-3" :class="on ? 'text-[12px]' : 'text-[11.5px]'">{{ on ? 'ברירת מחדל: ללא נידוף — תמצית באלכוהול בלבד.' : 'ללא נידוף (ברירת מחדל)' }}</span>
            </span>
        </label>

        <div v-if="on" class="mt-[16px]">
            <div class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[10px] mt-[4px]">
                <label
                    v-for="opt in CARRIER_OPTIONS" :key="opt.id"
                    class="flex items-start gap-[10px] px-[14px] py-[12px] border rounded-control cursor-pointer transition-[background-color,border-color] duration-[.12s] ease-[ease]"
                    :class="(formula.evaporation || 'none') === opt.id
                        ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]'
                        : 'border-line bg-white shadow-none'"
                    @click="setF({ evaporation: opt.id })"
                >
                    <span
                        class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 mt-[2px] bg-surface border-2 rounded-full"
                        :class="(formula.evaporation || 'none') === opt.id ? 'border-accent' : 'border-line-strong'"
                    >
                        <span v-if="(formula.evaporation || 'none') === opt.id" class="w-[8px] h-[8px] rounded-full bg-accent" />
                    </span>
                    <div class="flex-1 min-w-0">
                        <div class="text-[13.5px] leading-[1.35]" :class="(formula.evaporation || 'none') === opt.id ? 'font-bold text-accent-ink' : 'font-semibold text-ink'">{{ opt.label }}</div>
                        <div class="mt-[2px] text-[11.5px] leading-[1.4] text-ink-3">{{ opt.hint }}</div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
