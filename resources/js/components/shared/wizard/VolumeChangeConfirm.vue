<script setup>
// Confirmation shown when changing an already-chosen formula volume.
import { onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    unit: { type: String, required: true },
    newVolume: { type: [Number, String], required: true },
});
const emit = defineEmits(['confirm', 'cancel']);

function onKey(e) {
    if (e.key === 'Escape') {
        emit('cancel');
    }
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div
        class="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(20,18,14,0.46)] p-[24px] backdrop-blur-[2px]"
        @click="emit('cancel')"
    >
        <div
            class="w-[min(440px,100%)] rounded-card bg-surface p-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.22)]"
            @click.stop
        >
            <div class="mb-[12px] flex items-center gap-[12px]">
                <span
                    class="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[50%] bg-accent-tint text-accent"
                >
                    <Icon name="info" :size="18" />
                </span>
                <h3 class="m-0 text-[16px] font-semibold">
                    שינוי נפח ל-<span class="num">{{ newVolume }}</span>
                    {{ unit }}
                </h3>
            </div>
            <p
                class="mx-0 mt-[4px] mb-[18px] text-[13.5px] leading-[1.55] text-ink-2"
            >
                שינוי הנפח לא ישפיע על האחוזים. הרכב הרכיבים ישמר. האם להמשיך?
            </p>
            <div class="flex justify-end gap-[10px]">
                <button class="btn btn--ghost" @click="emit('cancel')">
                    ביטול
                </button>
                <button
                    class="btn btn--primary px-[18px]"
                    @click="emit('confirm')"
                >
                    שנה נפח
                </button>
            </div>
        </div>
    </div>
</template>
