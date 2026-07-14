<script setup>
// Process-bar navigation button (חזור / הבא). RTL-aware arrows.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    /** 'back' | 'forward' — decides which side the arrow sits on. */
    dir: { type: String, required: true },
    label: { type: String, required: true },
    compact: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);

const hover = ref(false);
const isBack = computed(() => props.dir === 'back');
</script>

<template>
    <button
        type="button"
        :disabled="disabled"
        :style="{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            height: compact ? '30px' : '34px',
            paddingInline: compact ? '11px' : '14px',
            borderRadius: '999px',
            border: '1px solid ' + (disabled ? 'var(--line)' : (hover ? 'var(--accent)' : 'var(--line-strong)')),
            background: 'var(--surface)',
            color: disabled ? 'var(--ink-4)' : (hover ? 'var(--accent)' : 'var(--ink-2)'),
            fontFamily: 'inherit',
            fontSize: compact ? '12.5px' : '13.5px',
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.55 : 1,
            transition: 'border-color .12s, color .12s, background-color .12s',
        }"
        @click="!disabled && emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon v-if="isBack" name="arrow_right" :size="15" />
        <span>{{ label }}</span>
        <Icon v-if="!isBack" name="arrow_left" :size="15" />
    </button>
</template>
