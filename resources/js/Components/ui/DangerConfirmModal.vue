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
            :style="{
                position: 'fixed', inset: 0,
                background: 'rgba(20, 18, 14, 0.46)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backdropFilter: 'blur(2px)',
            }"
            @click="emit('cancel')"
        >
            <div
                ref="dialogRef"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                aria-labelledby="tf-danger-title"
                :style="{
                    background: 'var(--surface)',
                    borderRadius: 'var(--r-card)',
                    width: 'min(460px, 100%)',
                    padding: '26px',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                }"
                @click.stop
            >
                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px">
                    <span
                        :style="{
                            width: '44px', height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(201, 56, 56, 0.10)',
                            color: '#c93838',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3L22 21H2L12 3z" />
                            <path d="M12 10v5M12 18v.5" />
                        </svg>
                    </span>
                    <h3 id="tf-danger-title" style="margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -0.005em">
                        {{ title }}
                    </h3>
                </div>
                <p style="margin: 0 0 22px; font-size: 14px; color: var(--ink-2); line-height: 1.6">
                    <slot />
                </p>
                <div style="display: flex; justify-content: flex-end; gap: 10px">
                    <button class="btn btn--ghost" @click="emit('cancel')">בטל</button>
                    <button
                        :style="{
                            background: '#c93838',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 18px',
                            borderRadius: 'var(--r-control)',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }"
                        @click="emit('confirm')"
                    >{{ confirmLabel }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
