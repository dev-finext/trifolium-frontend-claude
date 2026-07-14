<script setup>
// One patient result row in the picker — initials avatar, name, age + last
// visit, and a plus affordance. Hover tints toward the accent.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    patient: { type: Object, required: true },
});

const emit = defineEmits(['pick']);

const hover = ref(false);
</script>

<template>
    <button
        :style="{
            display: 'flex', alignItems: 'center', gap: '12px',
            width: '100%', textAlign: 'right',
            padding: '10px 12px', border: '1px solid var(--line)',
            borderRadius: 'var(--r-control)', cursor: 'pointer',
            background: hover ? 'var(--accent-tint)' : 'var(--surface)',
            borderColor: hover ? 'var(--accent)' : 'var(--line)',
            transition: 'background .12s, border-color .12s',
            fontFamily: 'inherit',
        }"
        @click="emit('pick')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            :style="{
                width: '36px', height: '36px', flexShrink: 0, borderRadius: '50%',
                background: 'var(--accent-tint)', color: 'var(--accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600,
            }"
        >{{ patient.initials }}</span>
        <span style="flex: 1; min-width: 0">
            <span style="display: block; font-size: 14.5px; font-weight: 600; color: var(--ink)">{{ patient.heb }}</span>
            <span class="small muted" style="display: block; margin-top: 1px">
                גיל {{ patient.age }} · {{ patient.last }}
            </span>
        </span>
        <Icon name="plus" :size="16" :color="hover ? 'var(--accent)' : 'var(--ink-3)'" />
    </button>
</template>
