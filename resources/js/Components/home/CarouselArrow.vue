<script setup>
// Round nav arrow that floats over the carousel edges.
// In RTL: "prev" sits on the right edge, "next" on the left edge.
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    /** 'prev' | 'next' */
    dir: { type: String, required: true },
    disabled: { type: Boolean, default: false },
});
defineEmits(['click']);

const hover = ref(false);
const sideStyle = computed(() => (props.dir === 'prev' ? { right: '-18px' } : { left: '-18px' }));
</script>

<template>
    <button
        :disabled="disabled"
        :aria-label="dir === 'prev' ? 'הקודם' : 'הבא'"
        :style="{
            position: 'absolute',
            top: '38%',
            ...sideStyle,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid ' + (hover && !disabled ? 'var(--ink-2)' : 'var(--line)'),
            boxShadow: disabled ? 'none' : '0 6px 18px -8px rgba(31,46,29,0.30)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.35 : 1,
            zIndex: 3,
            transition: 'all .15s ease',
        }"
        @click="$emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon
            :name="dir === 'prev' ? 'arrow_right' : 'arrow_left'"
            :size="20"
            :color="hover && !disabled ? 'var(--ink)' : 'var(--ink-2)'"
        />
    </button>
</template>
