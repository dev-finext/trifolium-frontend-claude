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
        class="fixed inset-0 flex items-center justify-center p-[24px] bg-[rgba(20,18,14,0.42)] z-[120] backdrop-blur-[2px]"
        @click="emit('close')"
    >
        <div
            dir="rtl"
            class="w-[min(360px,100%)] pt-[22px] px-[22px] pb-[18px] text-right bg-surface rounded-card border-t-[3px] border-t-danger shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <div class="flex items-center gap-[10px] mb-[10px]">
                <span
                    class="inline-flex items-center justify-center shrink-0 w-[34px] h-[34px] text-white bg-danger rounded-[8px]"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                </span>
                <h3 class="m-0 text-[16px] font-bold text-ink">
                    אינטראקציה אפשרית
                </h3>
            </div>

            <p class="m-0 mb-[12px] text-[13.5px] leading-[1.6] text-ink-2">
                זוהתה אינטראקציה אפשרית בין רכיב זה לבין תרופה שהמטופל נוטל. יש לבדוק את ההתאמה לפני המשך הרקיחה.
            </p>

            <div
                class="flex items-center justify-center gap-[10px] py-[10px] px-[12px] mb-[16px] text-[13px] font-semibold text-danger bg-[var(--danger-tint,#f3e3e0)] rounded-control"
            >
                <span class="font-latin">{{ herb?.lat || herb?.heb }}</span>
                <span class="opacity-60">+</span>
                <span class="font-latin">{{ drug }}</span>
            </div>

            <div class="flex justify-start">
                <button class="btn btn--primary px-[20px]" @click="emit('close')">
                    הבנתי
                </button>
            </div>
        </div>
    </div>
</template>
