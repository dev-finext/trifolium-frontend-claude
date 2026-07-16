<script setup>
// Wizard process bar — numbered step circles + connectors, with חזור / הבא
// buttons on the edges. Collapses to a compact height once the page scrolls
// (scrollY > 80), exactly like the prototype.
import { onBeforeUnmount, onMounted, ref } from 'vue';
import StepNavBtn from '@/components/shared/wizard/StepNavBtn.vue';

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
const onScroll = () => {
    compact.value = window.scrollY > 80;
};

onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
});

function jump(s) {
    const canJump = s.n !== props.current && maxReached(s.n);

    if (canJump) {
        emit('jump', s.n);
    }
}
</script>

<template>
    <div
        class="wizard-step-indicator relative z-[30] border-b border-line bg-surface transition-[padding] duration-[180ms] ease-[ease]"
    >
        <div
            class="mx-auto my-0 max-w-(--maxw-lab) transition-[padding] duration-[180ms] ease-[ease]"
            :class="
                compact
                    ? 'px-[24px] pt-[8px] pb-[6px]'
                    : 'px-[24px] pt-[20px] pb-[14px]'
            "
        >
            <div
                class="flex items-center"
                :class="compact ? 'gap-[14px]' : 'gap-[22px]'"
            >
                <!-- חזור — process-bar back. State is preserved across the whole flow. -->
                <StepNavBtn
                    dir="back"
                    label="חזור"
                    :compact="compact"
                    :disabled="!canBack"
                    @click="canBack && emit('back')"
                />

                <div class="relative flex flex-1 items-start justify-between">
                    <template v-for="(s, i) in steps" :key="s.n">
                        <div
                            class="relative z-[2] flex min-w-0 flex-col items-center bg-surface px-[8px] py-0"
                            :class="[
                                compact ? 'gap-[4px]' : 'gap-[8px]',
                                s.n !== current && maxReached(s.n)
                                    ? 'cursor-pointer'
                                    : 'cursor-default',
                            ]"
                            @click="jump(s)"
                        >
                            <div
                                class="flex items-center justify-center rounded-[50%] border-[1.5px] font-latin font-semibold transition-[width,height,font-size] duration-[180ms] ease-[ease]"
                                :class="[
                                    compact
                                        ? 'h-[22px] w-[22px] text-[11px]'
                                        : 'h-[28px] w-[28px] text-[13px]',
                                    s.n === current
                                        ? 'border-accent bg-accent text-white'
                                        : s.n < current
                                          ? 'border-accent bg-surface text-accent'
                                          : 'border-line-strong bg-surface text-ink-4',
                                ]"
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
                                class="whitespace-nowrap transition-[font-size] duration-[180ms] ease-[ease]"
                                :class="[
                                    compact ? 'text-[11.5px]' : 'text-[13px]',
                                    s.n === current
                                        ? 'font-semibold text-accent'
                                        : s.n < current
                                          ? 'font-normal text-ink-3'
                                          : 'font-normal text-ink-4',
                                ]"
                                >{{ s.label }}</span
                            >
                        </div>

                        <div
                            v-if="i !== steps.length - 1"
                            class="relative z-[1] mx-[-4px] h-[1.5px] flex-1 self-start transition-[margin-top] duration-[180ms] ease-[ease]"
                            :class="[
                                s.n < current ? 'bg-accent' : 'bg-line-strong',
                                compact ? 'mt-[11px]' : 'mt-[14px]',
                            ]"
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
