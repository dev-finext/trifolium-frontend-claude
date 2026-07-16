<script setup>
// One cell of the Zone D stats bar. The value is provided via the default slot
// (it can carry rich markup — numbers, accents, "טרם נבחר" states).
defineProps({
    label: { type: String, required: true },
    big: { type: Boolean, default: false },
    accent: { type: Boolean, default: false },
    last: { type: Boolean, default: false },
});
</script>

<template>
    <div
        class="flex flex-col justify-center gap-[4px] min-h-[58px] px-[18px] py-[11px]"
        :class="last ? '' : 'border-l border-line'"
    >
        <div class="field-label">{{ label }}</div>
        <div
            class="leading-[1.2]"
            :class="[big ? 'text-[19px] font-bold tracking-[-0.01em]' : 'text-[15px] font-semibold tracking-[0]', accent ? 'text-accent' : 'text-ink']"
        >
            <slot />
        </div>
    </div>
</template>
