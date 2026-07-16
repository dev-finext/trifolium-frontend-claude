<script setup>
// Round nav arrow that floats over the carousel edges.
// In RTL: "prev" sits on the right edge, "next" on the left edge.
import { ref, computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    /** 'prev' | 'next' */
    dir: { type: String, required: true },
    disabled: { type: Boolean, default: false },
});
defineEmits(['click']);

const hover = ref(false);
const sideStyle = computed(() =>
    props.dir === 'prev' ? { right: '-18px' } : { left: '-18px' },
);
</script>

<template>
    <button
        :disabled="disabled"
        :aria-label="dir === 'prev' ? 'הקודם' : 'הבא'"
        class="absolute top-[38%] z-[3] flex h-[44px] w-[44px] items-center justify-center rounded-[50%] border bg-surface transition-all duration-150 ease-[ease]"
        :class="[
            hover && !disabled ? 'border-ink-2' : 'border-line',
            disabled
                ? 'cursor-default opacity-[0.35] shadow-none'
                : 'cursor-pointer opacity-100 shadow-[0_6px_18px_-8px_rgba(31,46,29,0.30)]',
        ]"
        :style="sideStyle"
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
