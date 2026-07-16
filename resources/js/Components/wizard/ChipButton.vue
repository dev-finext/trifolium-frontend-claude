<script setup>
// Clickable chip button (info / warn / danger) — opens the herb info modal or
// interaction popup. Style: "רך וממולא" — soft tinted circle, matching-hue icon.
import { ref, computed } from 'vue';
import { CHIP_TONE } from '@/Components/wizard/step3-data';

const props = defineProps({
    variant: { type: String, default: 'info' }, // 'info' | 'warn' | 'danger'
    title: { type: String, default: '' },
});
const emit = defineEmits(['click']);

const hover = ref(false);
const tone = computed(() => CHIP_TONE[props.variant] || CHIP_TONE.info);

function onClick(e) {
    e.stopPropagation();
    emit('click');
}
</script>

<template>
    <button
        type="button"
        :title="title"
        :aria-label="title"
        class="inline-flex items-center justify-center w-[24px] h-[24px] p-0 border-none rounded-[50%] cursor-pointer shrink-0 transition-[filter,transform] duration-[140ms]"
        :class="hover ? 'brightness-[0.96] [transform:translateY(-1px)]' : 'filter-none [transform:none]'"
        :style="{
            background: tone.bg,
            color: tone.fg,
        }"
        @click="onClick"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <svg v-if="variant === 'warn'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
        <svg v-else-if="variant === 'danger'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
            <path d="m8.5 8.5 7 7" />
        </svg>
        <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    </button>
</template>
