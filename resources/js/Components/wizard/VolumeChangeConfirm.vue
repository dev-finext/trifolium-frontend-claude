<script setup>
// Confirmation shown when changing an already-chosen formula volume.
import { onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    unit: { type: String, required: true },
    newVolume: { type: [Number, String], required: true },
});
const emit = defineEmits(['confirm', 'cancel']);

function onKey(e) { if (e.key === 'Escape') emit('cancel'); }
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="fixed inset-0 flex items-center justify-center p-[24px] bg-[rgba(20,18,14,0.46)] z-[110] backdrop-blur-[2px]"
        @click="emit('cancel')"
    >
        <div
            class="w-[min(440px,100%)] p-[24px] bg-surface rounded-card shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <div class="flex items-center gap-[12px] mb-[12px]">
                <span class="inline-flex items-center justify-center shrink-0 w-[38px] h-[38px] text-accent bg-accent-tint rounded-[50%]">
                    <Icon name="info" :size="18" />
                </span>
                <h3 class="m-0 text-[16px] font-semibold">
                    שינוי נפח ל-<span class="num">{{ newVolume }}</span> {{ unit }}
                </h3>
            </div>
            <p class="mt-[4px] mx-0 mb-[18px] text-[13.5px] leading-[1.55] text-ink-2">
                שינוי הנפח לא ישפיע על האחוזים. הרכב הרכיבים ישמר. האם להמשיך?
            </p>
            <div class="flex justify-end gap-[10px]">
                <button class="btn btn--ghost" @click="emit('cancel')">ביטול</button>
                <button class="btn btn--primary px-[18px]" @click="emit('confirm')">שנה נפח</button>
            </div>
        </div>
    </div>
</template>
