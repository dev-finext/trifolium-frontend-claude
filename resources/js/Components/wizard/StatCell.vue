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
        :style="{
            padding: '11px 18px',
            borderLeft: last ? 'none' : '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minHeight: '58px',
            justifyContent: 'center',
        }"
    >
        <div class="field-label">{{ label }}</div>
        <div
            :style="{
                fontSize: big ? '19px' : '15px',
                fontWeight: big ? 700 : 600,
                color: accent ? 'var(--accent)' : 'var(--ink)',
                letterSpacing: big ? '-0.01em' : '0',
                lineHeight: 1.2,
            }"
        >
            <slot />
        </div>
    </div>
</template>
