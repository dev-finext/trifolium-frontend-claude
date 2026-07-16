<script setup>
// Process-bar navigation button (חזור / הבא). RTL-aware arrows.
import { computed, ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';

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
        class="inline-flex items-center gap-[6px] shrink-0 font-semibold [font-family:inherit] bg-surface border rounded-[999px] transition-[border-color,color,background-color] duration-[.12s]"
        :class="[
            compact ? 'h-[30px] ps-[11px] pe-[11px] text-[12.5px]' : 'h-[34px] ps-[14px] pe-[14px] text-[13.5px]',
            disabled ? 'border-line text-ink-4 cursor-not-allowed opacity-55' : (hover ? 'border-accent text-accent cursor-pointer opacity-100' : 'border-line-strong text-ink-2 cursor-pointer opacity-100'),
        ]"
        @click="!disabled && emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon v-if="isBack" name="arrow_right" :size="15" />
        <span>{{ label }}</span>
        <Icon v-if="!isBack" name="arrow_left" :size="15" />
    </button>
</template>
