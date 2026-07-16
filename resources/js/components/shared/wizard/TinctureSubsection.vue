<script setup>
// Tincture-specific subsection: a single opt-in question — "evaporate?".
// Default is NO (alcohol extract only). The carrier options appear only once
// the user actively turns the question on.
import { computed } from 'vue';
import { CARRIER_OPTIONS } from '@/components/shared/wizard/wizard-lib';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const on = computed(
    () => !!props.formula.evaporation && props.formula.evaporation !== 'none',
);

function toggle() {
    if (on.value) {
        props.setF({ evaporation: 'none' });
    } else {
        props.setF({ evaporation: CARRIER_OPTIONS[0].id });
    }
}
</script>

<template>
    <div
        class="mt-[16px] rounded-card border border-line bg-surface-sunk transition-[padding] duration-[.12s] ease-[ease]"
        :class="on ? 'p-[18px]' : 'px-[14px] py-[8px]'"
    >
        <!-- The opt-in question — a single checkbox row, defaults to off -->
        <label
            class="flex cursor-pointer items-center gap-[12px] px-0 py-[4px]"
            @click.prevent="toggle"
        >
            <span
                class="inline-flex shrink-0 items-center justify-center rounded-[5px] border-2 transition-[background-color,border-color] duration-[.12s] ease-[ease]"
                :class="
                    on
                        ? 'h-[20px] w-[20px] border-accent bg-accent'
                        : 'h-[18px] w-[18px] border-line-strong bg-white'
                "
            >
                <Icon
                    v-if="on"
                    name="check"
                    :size="13"
                    color="#fff"
                    :stroke="3"
                />
            </span>
            <span
                class="flex min-w-0 flex-1 flex-wrap items-baseline gap-[8px]"
            >
                <span
                    class="font-semibold"
                    :class="
                        on
                            ? 'text-[14px] text-accent-ink'
                            : 'text-[13px] text-ink'
                    "
                    >האם לנדף את הטינקטורה?</span
                >
                <span
                    class="text-ink-3"
                    :class="on ? 'text-[12px]' : 'text-[11.5px]'"
                    >{{
                        on
                            ? 'ברירת מחדל: ללא נידוף — תמצית באלכוהול בלבד.'
                            : 'ללא נידוף (ברירת מחדל)'
                    }}</span
                >
            </span>
        </label>

        <div v-if="on" class="mt-[16px]">
            <div
                class="mt-[4px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[10px]"
            >
                <label
                    v-for="opt in CARRIER_OPTIONS"
                    :key="opt.id"
                    class="flex cursor-pointer items-start gap-[10px] rounded-control border px-[14px] py-[12px] transition-[background-color,border-color] duration-[.12s] ease-[ease]"
                    :class="
                        (formula.evaporation || 'none') === opt.id
                            ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]'
                            : 'border-line bg-white shadow-none'
                    "
                    @click="setF({ evaporation: opt.id })"
                >
                    <span
                        class="mt-[2px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 bg-surface"
                        :class="
                            (formula.evaporation || 'none') === opt.id
                                ? 'border-accent'
                                : 'border-line-strong'
                        "
                    >
                        <span
                            v-if="(formula.evaporation || 'none') === opt.id"
                            class="h-[8px] w-[8px] rounded-full bg-accent"
                        />
                    </span>
                    <div class="min-w-0 flex-1">
                        <div
                            class="text-[13.5px] leading-[1.35]"
                            :class="
                                (formula.evaporation || 'none') === opt.id
                                    ? 'font-bold text-accent-ink'
                                    : 'font-semibold text-ink'
                            "
                        >
                            {{ opt.label }}
                        </div>
                        <div
                            class="mt-[2px] text-[11.5px] leading-[1.4] text-ink-3"
                        >
                            {{ opt.hint }}
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
