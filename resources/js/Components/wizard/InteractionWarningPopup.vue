<script setup>
// Interaction warning — small, generic popup. Opens from the red danger chip
// when an ingredient interacts with a patient medication.
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    herb: { type: Object, default: null },
    drug: { type: String, default: null },
});
const emit = defineEmits(['close']);

function onKey(e) { if (e.key === 'Escape') emit('close'); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0,
            background: 'rgba(20, 18, 14, 0.42)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(2px)',
        }"
        @click="emit('close')"
    >
        <div
            dir="rtl"
            :style="{
                background: 'var(--surface)',
                borderRadius: 'var(--r-card)',
                borderTop: '3px solid var(--danger)',
                width: 'min(360px, 100%)',
                padding: '22px 22px 18px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.22)',
                textAlign: 'right',
            }"
            @click.stop
        >
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
                <span
                    :style="{
                        width: '34px', height: '34px',
                        borderRadius: '8px',
                        background: 'var(--danger)',
                        color: '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                </span>
                <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: var(--ink)">
                    אינטראקציה אפשרית
                </h3>
            </div>

            <p style="margin: 0 0 12px; font-size: 13.5px; color: var(--ink-2); line-height: 1.6">
                זוהתה אינטראקציה אפשרית בין רכיב זה לבין תרופה שהמטופל נוטל. יש לבדוק את ההתאמה לפני המשך הרקיחה.
            </p>

            <div
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    background: 'var(--danger-tint, #f3e3e0)',
                    borderRadius: 'var(--r-control)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--danger)',
                    marginBottom: '16px',
                }"
            >
                <span style="font-family: var(--font-latin)">{{ herb?.lat || herb?.heb }}</span>
                <span style="opacity: 0.6">+</span>
                <span style="font-family: var(--font-latin)">{{ drug }}</span>
            </div>

            <div style="display: flex; justify-content: flex-start">
                <button class="btn btn--primary" style="padding-inline: 20px" @click="emit('close')">
                    הבנתי
                </button>
            </div>
        </div>
    </div>
</template>
