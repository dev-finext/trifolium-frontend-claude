<script setup>
// One patient result row in the picker — initials avatar, name, age + last
// visit, and a plus affordance. Hover tints toward the accent.
import { ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    patient: { type: Object, required: true },
});

const emit = defineEmits(['pick']);

const hover = ref(false);
</script>

<template>
    <button
        class="flex items-center gap-[12px] w-full text-right py-[10px] px-[12px] border rounded-control cursor-pointer transition-[background,border-color] duration-120 [font-family:inherit]"
        :class="hover ? 'bg-accent-tint border-accent' : 'bg-surface border-line'"
        @click="emit('pick')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            class="inline-flex items-center justify-center w-[36px] h-[36px] shrink-0 text-[13px] font-semibold text-accent bg-accent-tint rounded-[50%]"
        >{{ patient.initials }}</span>
        <span class="flex-1 min-w-0">
            <span class="block text-[14.5px] font-semibold text-ink">{{ patient.heb }}</span>
            <span class="small muted block mt-[1px]">
                גיל {{ patient.age }} · {{ patient.last }}
            </span>
        </span>
        <Icon name="plus" :size="16" :color="hover ? 'var(--accent)' : 'var(--ink-3)'" />
    </button>
</template>
