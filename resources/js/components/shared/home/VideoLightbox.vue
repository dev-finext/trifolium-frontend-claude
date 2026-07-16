<script setup>
// Video lightbox modal — dark scrim, simulated 16:9 player, meta below.
import Icon from '@/components/ui/Icon.vue';
import { useModal } from '@/composables/useModal';

defineProps({
    video: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const { dialogRef } = useModal(() => emit('close'));
</script>

<template>
    <div
        class="fixed inset-0 flex items-center justify-center z-[200] p-[24px] bg-[rgba(10,9,7,0.85)] animate-[tf-fade-in_.2s_ease]"
        @click="emit('close')"
    >
        <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="tf-video-title"
            class="relative w-full max-w-[1000px] overflow-hidden bg-[#0e0e0c] rounded-[8px]"
            @click.stop
        >
            <!-- Close -->
            <button
                aria-label="סגור"
                class="absolute top-[16px] left-[16px] z-[10] flex items-center justify-center w-[36px] h-[36px] text-white bg-[rgba(255,255,255,0.1)] border-none rounded-[50%] cursor-pointer backdrop-blur-[8px]"
                @click="emit('close')"
            >
                <Icon name="x" :size="18" color="#fff" />
            </button>

            <!-- "Video" — simulated player -->
            <div class="relative flex items-center justify-center aspect-[16/9] bg-[linear-gradient(135deg,#2a3a3e_0%,#4a5d52_100%)]">
                <div class="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0,transparent_16px,rgba(255,255,255,0.04)_16px,rgba(255,255,255,0.04)_17px)]" />
                <button
                    type="button"
                    aria-label="נגן"
                    class="flex items-center justify-center w-[72px] h-[72px] pr-[6px] text-ink bg-white border-none rounded-[50%] cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4l14 8-14 8V4z" />
                    </svg>
                </button>

                <!-- Progress bar -->
                <div
                    aria-hidden="true"
                    class="absolute bottom-0 left-0 right-0 py-[16px] px-[20px] bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent)]"
                >
                    <div class="h-[3px] bg-[rgba(255,255,255,0.2)] rounded-[999px] overflow-hidden">
                        <div class="w-0 h-full bg-white" />
                    </div>
                    <div class="flex justify-between mt-[8px] text-[12px] font-latin text-[rgba(255,255,255,0.85)]">
                        <span>0:00</span>
                        <span>{{ video.duration }}</span>
                    </div>
                </div>
            </div>

            <!-- Meta below -->
            <div class="p-[24px] text-[#e8e6e0] [direction:rtl]">
                <div class="mb-[8px] text-[11px] font-semibold tracking-[0.14em] uppercase font-latin text-[#a8c79e]">{{ video.chapter }}</div>
                <div id="tf-video-title" class="mb-[6px] text-[18px] font-semibold">{{ video.title }}</div>
                <div class="text-[13px] leading-[1.5] text-[#a8a89c]">{{ video.desc }}</div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
