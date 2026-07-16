<script setup>
// Small KPI tile — count + label, clickable to apply a status filter.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    icon: { type: String, required: true },
    count: { type: Number, default: 0 },
    label: { type: String, default: '' },
    /** 'ink' | 'amber' | 'blue' | 'green' */
    tone: { type: String, default: 'ink' },
    active: { type: Boolean, default: false },
});

defineEmits(['click']);

const TONES = {
    ink:   { fg: 'var(--ink)',     ring: 'var(--line-strong)', tint: 'var(--surface-sunk)' },
    amber: { fg: '#a87521',        ring: '#ecd9b0',            tint: '#fbf3e3' },
    blue:  { fg: '#2e5b8c',        ring: '#cddcec',            tint: '#e8eef6' },
    green: { fg: 'var(--accent)',  ring: 'var(--accent-tint-strong)', tint: 'var(--accent-tint)' },
};

const c = computed(() => TONES[props.tone] || TONES.ink);
</script>

<template>
    <button
        class="flex items-center gap-[14px] py-[16px] px-[18px] text-right [font-family:inherit] cursor-pointer rounded-card transition-all duration-150"
        :style="{
            background: active ? c.tint : 'var(--surface)',
            border: '1px solid ' + (active ? c.ring : 'var(--line)'),
        }"
        @click="$emit('click')"
    >
        <span
            class="inline-flex items-center justify-center w-[42px] h-[42px] shrink-0 rounded-full"
            :style="{ background: c.tint, color: c.fg }"
        ><Icon :name="icon" :size="20" :color="c.fg" /></span>
        <div class="flex flex-col gap-[1px]">
            <span class="num text-[24px] font-bold leading-[1.1]" :style="{ color: c.fg }">{{ count }}</span>
            <span class="text-[12.5px] font-medium text-ink-3">{{ label }}</span>
        </div>
    </button>
</template>
