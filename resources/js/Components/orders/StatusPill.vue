<script setup>
// Status pill (Order view header) — colored dot + status label.
import { computed } from 'vue';

const props = defineProps({
    /** 'amber' | 'green' | 'blue' | 'red' */
    tone: { type: String, default: 'green' },
    label: { type: String, default: '' },
    // Declared for parity with the prototype's call site; not used in render.
    route: { type: String, default: '' },
});

const TONES = {
    amber: { bg: '#fbf3e3', fg: '#a87521', dot: '#c18d2a', bd: '#ecd9b0' },
    green: { bg: 'var(--accent-tint)', fg: 'var(--accent-ink)', dot: '#4d8047', bd: 'var(--accent-tint-strong)' },
    blue:  { bg: '#e8eef6', fg: '#2e5b8c', dot: '#2e5b8c', bd: '#cddcec' },
    red:   { bg: '#f6e6e3', fg: '#a23a2d', dot: '#a23a2d', bd: '#e6c8c2' },
};

const c = computed(() => TONES[props.tone] || TONES.green);
</script>

<template>
    <span
        :style="{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '999px',
            background: c.bg, color: c.fg,
            fontSize: '13px', fontWeight: 600,
            border: '1px solid ' + c.bd,
        }"
    >
        <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: c.dot }" />
        {{ label }}
    </span>
</template>
