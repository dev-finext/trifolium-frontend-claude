<script setup>
// The circular mode icon (navbar-size). Chinese: yin-yang. Western: mortar &
// pestle. Cross-fades smoothly between the two when the mode changes.
import YinYang from '@/Components/mode/YinYang.vue';
import MortarPestle from '@/Components/mode/MortarPestle.vue';

defineProps({
    /** 'western' | 'chinese' */
    mode: { type: String, required: true },
    size: { type: Number, default: 30 },
});
</script>

<template>
    <span
        :style="{
            position: 'relative',
            width: `${size}px`, height: `${size}px`,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid var(--line-strong)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'background-color .25s ease, border-color .25s ease',
        }"
    >
        <span
            :style="{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: mode === 'chinese' ? 1 : 0,
                transform: mode === 'chinese' ? 'rotate(0deg) scale(1)' : 'rotate(-30deg) scale(0.85)',
                transition: 'opacity .25s ease, transform .25s ease',
            }"
        >
            <YinYang :size="size - 8" />
        </span>
        <span
            :style="{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: mode === 'western' ? 1 : 0,
                transform: mode === 'western' ? 'rotate(0deg) scale(1)' : 'rotate(30deg) scale(0.85)',
                transition: 'opacity .25s ease, transform .25s ease',
            }"
        >
            <MortarPestle :size="size - 8" />
        </span>
    </span>
</template>
