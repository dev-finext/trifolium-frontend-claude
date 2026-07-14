<script setup>
// Small persistent style badge for inside the wizard ("סגנון מערבי" / "סגנון סיני").
import { computed } from 'vue';
import { useModeStore } from '@/stores/mode';
import ModeGlyph from '@/Components/mode/ModeGlyph.vue';

const { mode } = useModeStore();
const label = computed(() => (mode.value === 'chinese' ? 'סגנון סיני' : 'סגנון מערבי'));
</script>

<template>
    <span
        title="לשינוי הסגנון יש להשתמש במתג שבסרגל העליון"
        :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px 3px 8px',
            borderRadius: '999px',
            background: 'var(--surface-sunk)',
            border: '1px solid var(--line)',
            fontSize: '11.5px',
            color: 'var(--ink-3)',
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'default',
        }"
    >
        <ModeGlyph :mode="mode" :size="12" />
        {{ label }}
    </span>
</template>
