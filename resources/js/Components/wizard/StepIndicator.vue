<script setup>
// Wizard process bar — numbered step circles + connectors, with חזור / הבא
// buttons on the edges. Collapses to a compact height once the page scrolls
// (scrollY > 80), exactly like the prototype.
import { onBeforeUnmount, onMounted, ref } from 'vue';
import StepNavBtn from '@/Components/wizard/StepNavBtn.vue';

const props = defineProps({
    /** Resolved steps: [{ n, key, label }] (last label adapts when no patient). */
    steps: { type: Array, required: true },
    current: { type: Number, required: true },
    /** Furthest step reached — steps up to it stay clickable ("free jump"). */
    maxStep: { type: Number, default: null },
    canBack: { type: Boolean, default: false },
    canForward: { type: Boolean, default: false },
});

const emit = defineEmits(['jump', 'back', 'forward']);

// Source default: maxStep falls back to `current` when not provided.
const maxReached = (n) => n <= (props.maxStep ?? props.current);

const compact = ref(false);
const onScroll = () => { compact.value = window.scrollY > 80; };

onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
});

function jump(s) {
    const canJump = s.n !== props.current && maxReached(s.n);
    if (canJump) emit('jump', s.n);
}
</script>

<template>
    <div
        class="wizard-step-indicator"
        style="position: relative; z-index: 30; background: var(--surface); border-bottom: 1px solid var(--line); transition: padding .18s ease"
    >
        <div
            :style="{
                maxWidth: 'var(--maxw-lab)',
                margin: '0 auto',
                padding: compact ? '8px 24px 6px' : '20px 24px 14px',
                transition: 'padding .18s ease',
            }"
        >
            <div :style="{ display: 'flex', alignItems: 'center', gap: compact ? '14px' : '22px' }">
                <!-- חזור — process-bar back. State is preserved across the whole flow. -->
                <StepNavBtn
                    dir="back"
                    label="חזור"
                    :compact="compact"
                    :disabled="!canBack"
                    @click="canBack && emit('back')"
                />

                <div style="flex: 1; display: flex; align-items: flex-start; justify-content: space-between; position: relative">
                    <template v-for="(s, i) in steps" :key="s.n">
                        <div
                            :style="{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: compact ? '4px' : '8px',
                                cursor: (s.n !== current && maxReached(s.n)) ? 'pointer' : 'default',
                                position: 'relative',
                                zIndex: 2,
                                background: 'var(--surface)',
                                padding: '0 8px',
                                minWidth: 0,
                            }"
                            @click="jump(s)"
                        >
                            <div
                                :style="{
                                    width: compact ? '22px' : '28px',
                                    height: compact ? '22px' : '28px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'var(--font-latin)',
                                    fontSize: compact ? '11px' : '13px',
                                    fontWeight: 600,
                                    border: '1.5px solid ' + (s.n === current ? 'var(--accent)' : s.n < current ? 'var(--accent)' : 'var(--line-strong)'),
                                    background: s.n === current ? 'var(--accent)' : 'var(--surface)',
                                    color: s.n === current ? '#fff' : s.n < current ? 'var(--accent)' : 'var(--ink-4)',
                                    transition: 'width .18s ease, height .18s ease, font-size .18s ease',
                                }"
                            >
                                <svg
                                    v-if="s.n < current"
                                    :width="compact ? 11 : 14"
                                    :height="compact ? 11 : 14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <template v-else>{{ s.n }}</template>
                            </div>
                            <span
                                :style="{
                                    fontSize: compact ? '11.5px' : '13px',
                                    fontWeight: s.n === current ? 600 : 400,
                                    color: s.n === current ? 'var(--accent)' : s.n < current ? 'var(--ink-3)' : 'var(--ink-4)',
                                    whiteSpace: 'nowrap',
                                    transition: 'font-size .18s ease',
                                }"
                            >{{ s.label }}</span>
                        </div>

                        <div
                            v-if="i !== steps.length - 1"
                            :style="{
                                flex: 1,
                                height: '1.5px',
                                background: s.n < current ? 'var(--accent)' : 'var(--line-strong)',
                                marginTop: compact ? '11px' : '14px',
                                alignSelf: 'flex-start',
                                position: 'relative',
                                zIndex: 1,
                                marginInline: '-4px',
                                transition: 'margin-top .18s ease',
                            }"
                        />
                    </template>
                </div>

                <!-- הבא — process-bar forward. Re-opens once חזור was used or the
                     current step is valid; every condition entered so far is kept. -->
                <StepNavBtn
                    dir="forward"
                    label="הבא"
                    :compact="compact"
                    :disabled="!canForward"
                    @click="canForward && emit('forward')"
                />
            </div>
        </div>
    </div>
</template>
