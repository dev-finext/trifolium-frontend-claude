<script setup>
// Notes card (accent for patient-facing, amber for internal).
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

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
        class="card"
        :style="{
            padding: 0, overflow: 'hidden',
            borderInlineStart: '3px solid ' + c,
        }"
    >
        <div
            :style="{
                padding: '12px 20px',
                background: accentTone ? 'var(--accent-tint)' : 'transparent',
                borderBottom: '1px solid var(--line)',
                display: 'flex', alignItems: 'center', gap: '9px',
            }"
        >
            <span
                :style="{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: accentTone ? c : 'transparent',
                    border: accentTone ? 'none' : '1.5px solid ' + c,
                    color: accentTone ? '#fff' : c,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }"
            >
                <Icon :name="icon" :size="13" :color="accentTone ? '#fff' : c" />
            </span>
            <span
                :style="{
                    fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
                    fontWeight: 700, color: accentTone ? 'var(--accent-ink)' : c,
                }"
            >{{ eyebrow }}</span>
        </div>
        <div style="padding: 16px 20px; font-size: 14px; line-height: 1.6; color: var(--ink-2)">
            {{ text }}
        </div>
    </div>
</template>
