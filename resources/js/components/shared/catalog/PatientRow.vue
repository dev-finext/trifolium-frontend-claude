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
        class="flex w-full cursor-pointer items-center gap-[12px] rounded-control border px-[12px] py-[10px] text-right [font-family:inherit] transition-[background,border-color] duration-120"
        :class="
            hover ? 'border-accent bg-accent-tint' : 'border-line bg-surface'
        "
        @click="emit('pick')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            class="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[50%] bg-accent-tint text-[13px] font-semibold text-accent"
            >{{ patient.initials }}</span
        >
        <span class="min-w-0 flex-1">
            <span class="block text-[14.5px] font-semibold text-ink">{{
                patient.heb
            }}</span>
            <span class="small muted mt-[1px] block">
                גיל {{ patient.age }} · {{ patient.last }}
            </span>
        </span>
        <Icon
            name="plus"
            :size="16"
            :color="hover ? 'var(--accent)' : 'var(--ink-3)'"
        />
    </button>
</template>
