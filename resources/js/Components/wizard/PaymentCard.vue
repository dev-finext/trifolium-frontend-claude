<script setup>
// Payment-route option card (radio-style). Defined in the prototype and kept
// here for parity; hover raises the border like the source's onMouseEnter swap.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    sub: { type: String, default: '' },
    selected: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

const hover = ref(false);
</script>

<template>
    <button
        class="card"
        :style="{
            padding: '18px 20px',
            textAlign: 'right',
            background: selected ? 'var(--accent-tint)' : 'var(--surface)',
            border: '1px solid ' + (selected ? 'var(--accent)' : hover ? 'var(--ink)' : 'var(--line)'),
            cursor: 'pointer',
            fontFamily: 'inherit',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            transition: 'all .15s',
        }"
        @click="emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            :style="{
                width: '38px', height: '38px', borderRadius: '50%',
                background: selected ? 'var(--accent)' : 'var(--surface-sunk)',
                color: selected ? '#fff' : 'var(--accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }"
        >
            <Icon :name="icon" :size="18" :color="selected ? '#fff' : 'var(--accent)'" />
        </span>
        <div style="flex: 1">
            <div style="font-size: 14px; font-weight: 600">{{ title }}</div>
            <div class="small muted">{{ sub }}</div>
        </div>
        <span
            :style="{
                width: '18px', height: '18px', borderRadius: '50%',
                border: '1.5px solid ' + (selected ? 'var(--accent)' : 'var(--line-strong)'),
                background: 'var(--surface)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }"
        >
            <span v-if="selected" style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent)" />
        </span>
    </button>
</template>
