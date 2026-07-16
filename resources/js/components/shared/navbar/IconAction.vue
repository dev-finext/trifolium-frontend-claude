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
            class="relative inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-control border transition-all duration-150"
            :class="[
                active ? 'bg-accent-tint' : 'bg-transparent',
                active
                    ? 'border-accent'
                    : hover
                      ? 'border-line-strong'
                      : 'border-transparent',
            ]"
            @click="$emit('click')"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @focus="hover = true"
            @blur="hover = false"
        >
            <Icon
                :name="icon"
                :size="19"
                :color="active ? 'var(--accent)' : 'var(--ink-2)'"
                :stroke="1.6"
            />
            <span
                v-if="count > 0"
                class="num absolute top-[-5px] left-[-5px] h-[18px] min-w-[18px] rounded-[999px] border-2 border-surface bg-accent px-[5px] py-0 text-center text-[11px] leading-[18px] font-bold text-on-accent"
                >{{ count }}</span
            >
        </button>
        <span
            v-if="hover"
            role="tooltip"
            class="pointer-events-none absolute start-0 top-[calc(100%_+_8px)] z-[90] animate-[tf-tip-in_.12s_ease_both] rounded-[7px] bg-(--ink) px-[9px] py-[5px] text-[11.5px] leading-[1] font-semibold whitespace-nowrap text-(--surface) shadow-[0_6px_18px_rgba(20,28,24,0.22)]"
            >{{ tooltip }}</span
        >
    </div>
</template>
