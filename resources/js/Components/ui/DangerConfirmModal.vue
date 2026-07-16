<script setup>
// Destructive-action confirmation dialog (red icon + cancel / confirm pair).
// Shared chrome for the mode-switch and formula-type-switch confirmations —
// pass the message as the default slot.
import { useModal } from '@/composables/useModal';

defineProps({
    title: { type: String, required: true },
    confirmLabel: { type: String, required: true },
});

const emit = defineEmits(['confirm', 'cancel']);

const { dialogRef } = useModal(() => emit('cancel'));
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-[200] flex items-center justify-center p-[24px] bg-[rgba(20,18,14,0.46)] backdrop-blur-[2px]"
            @click="emit('cancel')"
        >
            <div
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                aria-labelledby="tf-danger-title"
                class="w-[min(460px,100%)] p-[26px] bg-surface rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
                @click.stop
            >
                <div class="flex items-center gap-[14px] mb-[14px]">
                    <span
                        class="inline-flex items-center justify-center w-[44px] h-[44px] shrink-0 text-[#c93838] bg-[rgba(201,56,56,0.10)] rounded-full"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3L22 21H2L12 3z" />
                            <path d="M12 10v5M12 18v.5" />
                        </svg>
                    </span>
                    <h3 id="tf-danger-title" class="m-0 text-[18px] font-semibold tracking-[-0.005em]">
                        {{ title }}
                    </h3>
                </div>
                <p class="m-0 mb-[22px] text-[14px] leading-[1.6] text-ink-2">
                    <slot />
                </p>
                <div class="flex justify-end gap-[10px]">
                    <button class="btn btn--ghost" @click="emit('cancel')">בטל</button>
                    <button
                        class="inline-flex items-center gap-[6px] py-[10px] px-[18px] [font-family:inherit] text-[14px] font-semibold text-[#fff] bg-[#c93838] border-none rounded-control cursor-pointer"
                        @click="emit('confirm')"
                    >{{ confirmLabel }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
