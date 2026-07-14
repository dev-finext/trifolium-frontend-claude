<script setup>
// Small KPI tile — count + label, clickable to apply a status filter.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    icon: { type: String, required: true },
    count: { type: Number, default: 0 },
    label: { type: String, default: '' },
    /** 'ink' | 'amber' | 'blue' | 'green' */
    tone: { type: String, default: 'ink' },
    active: { type: Boolean, default: false },
});

defineEmits(['click']);

const TONES = {
    ink:   { fg: 'var(--ink)',     ring: 'var(--line-strong)', tint: 'var(--surface-sunk)' },
    amber: { fg: '#a87521',        ring: '#ecd9b0',            tint: '#fbf3e3' },
    blue:  { fg: '#2e5b8c',        ring: '#cddcec',            tint: '#e8eef6' },
    green: { fg: 'var(--accent)',  ring: 'var(--accent-tint-strong)', tint: 'var(--accent-tint)' },
};

const c = computed(() => TONES[props.tone] || TONES.ink);
</script>

<template>
    <button
        :style="{
            textAlign: 'right', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px',
            background: active ? c.tint : 'var(--surface)',
            border: '1px solid ' + (active ? c.ring : 'var(--line)'),
            borderRadius: 'var(--r-card)', transition: 'all .15s',
        }"
        @click="$emit('click')"
    >
        <span
            :style="{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: c.tint, color: c.fg,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        ><Icon :name="icon" :size="20" :color="c.fg" /></span>
        <div style="display: flex; flex-direction: column; gap: 1px">
            <span class="num" :style="{ fontSize: '24px', fontWeight: 700, lineHeight: 1.1, color: c.fg }">{{ count }}</span>
            <span style="font-size: 12.5px; color: var(--ink-3); font-weight: 500">{{ label }}</span>
        </div>
    </button>
</template>
