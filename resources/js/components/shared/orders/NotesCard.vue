<script setup>
// Notes card (accent for patient-facing, amber for internal).
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    /** 'accent' | 'amber' */
    tone: { type: String, default: 'accent' },
    eyebrow: { type: String, default: '' },
    icon: { type: String, default: 'info' },
    text: { type: String, default: '' },
});

const AMBER = '#a87521';
const accentTone = computed(() => props.tone === 'accent');
const c = computed(() => (accentTone.value ? 'var(--accent)' : AMBER));
</script>

<template>
    <div
        class="card p-0 overflow-hidden"
        :style="{
            borderInlineStart: '3px solid ' + c,
        }"
    >
        <div
            class="flex items-center gap-[9px] py-[12px] px-[20px] border-b border-b-line"
            :class="accentTone ? 'bg-accent-tint' : 'bg-transparent'"
        >
            <span
                class="inline-flex items-center justify-center w-[24px] h-[24px] shrink-0 rounded-full"
                :style="{
                    background: accentTone ? c : 'transparent',
                    border: accentTone ? 'none' : '1.5px solid ' + c,
                    color: accentTone ? '#fff' : c,
                }"
            >
                <Icon :name="icon" :size="13" :color="accentTone ? '#fff' : c" />
            </span>
            <span
                class="text-[11px] tracking-[0.06em] uppercase font-bold"
                :style="{ color: accentTone ? 'var(--accent-ink)' : c }"
            >{{ eyebrow }}</span>
        </div>
        <div class="py-[16px] px-[20px] text-[14px] leading-[1.6] text-ink-2">
            {{ text }}
        </div>
    </div>
</template>
