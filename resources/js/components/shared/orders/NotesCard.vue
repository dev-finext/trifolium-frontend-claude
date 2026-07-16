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
        class="card overflow-hidden p-0"
        :style="{
            borderInlineStart: '3px solid ' + c,
        }"
    >
        <div
            class="flex items-center gap-[9px] border-b border-b-line px-[20px] py-[12px]"
            :class="accentTone ? 'bg-accent-tint' : 'bg-transparent'"
        >
            <span
                class="inline-flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full"
                :style="{
                    background: accentTone ? c : 'transparent',
                    border: accentTone ? 'none' : '1.5px solid ' + c,
                    color: accentTone ? '#fff' : c,
                }"
            >
                <Icon
                    :name="icon"
                    :size="13"
                    :color="accentTone ? '#fff' : c"
                />
            </span>
            <span
                class="text-[11px] font-bold tracking-[0.06em] uppercase"
                :style="{ color: accentTone ? 'var(--accent-ink)' : c }"
                >{{ eyebrow }}</span
            >
        </div>
        <div class="px-[20px] py-[16px] text-[14px] leading-[1.6] text-ink-2">
            {{ text }}
        </div>
    </div>
</template>
