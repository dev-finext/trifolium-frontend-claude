<script setup>
// Icon-button with a count badge + hover tooltip (cart / pending actions).
import { ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    icon: { type: String, required: true },
    tooltip: { type: String, required: true },
    count: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
});

defineEmits(['click']);

const hover = ref(false);
</script>

<template>
    <div class="relative inline-flex">
        <button
            :aria-label="tooltip"
            class="relative inline-flex items-center justify-center w-[38px] h-[38px] shrink-0 cursor-pointer border rounded-control transition-all duration-150"
            :class="[
                active ? 'bg-accent-tint' : 'bg-transparent',
                active ? 'border-accent' : hover ? 'border-line-strong' : 'border-transparent',
            ]"
            @click="$emit('click')"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @focus="hover = true"
            @blur="hover = false"
        >
            <Icon :name="icon" :size="19" :color="active ? 'var(--accent)' : 'var(--ink-2)'" :stroke="1.6" />
            <span
                v-if="count > 0"
                class="num absolute top-[-5px] left-[-5px] min-w-[18px] h-[18px] py-0 px-[5px] text-[11px] font-bold leading-[18px] text-center bg-accent text-on-accent border-2 border-surface rounded-[999px]"
            >{{ count }}</span>
        </button>
        <span
            v-if="hover"
            role="tooltip"
            class="absolute top-[calc(100%_+_8px)] start-0 z-[90] py-[5px] px-[9px] whitespace-nowrap text-[11.5px] font-semibold leading-[1] bg-(--ink) text-(--surface) rounded-[7px] shadow-[0_6px_18px_rgba(20,28,24,0.22)] pointer-events-none animate-[tf-tip-in_.12s_ease_both]"
        >{{ tooltip }}</span>
    </div>
</template>
