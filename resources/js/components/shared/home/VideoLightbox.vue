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
        class="fixed inset-0 z-[200] flex animate-[tf-fade-in_.2s_ease] items-center justify-center bg-[rgba(10,9,7,0.85)] p-[24px]"
        @click="emit('close')"
    >
        <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="tf-video-title"
            class="relative w-full max-w-[1000px] overflow-hidden rounded-[8px] bg-[#0e0e0c]"
            @click.stop
        >
            <!-- Close -->
            <button
                aria-label="סגור"
                class="absolute top-[16px] left-[16px] z-[10] flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[50%] border-none bg-[rgba(255,255,255,0.1)] text-white backdrop-blur-[8px]"
                @click="emit('close')"
            >
                <Icon name="x" :size="18" color="#fff" />
            </button>

            <!-- "Video" — simulated player -->
            <div
                class="relative flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#2a3a3e_0%,#4a5d52_100%)]"
            >
                <div
                    class="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0,transparent_16px,rgba(255,255,255,0.04)_16px,rgba(255,255,255,0.04)_17px)]"
                />
                <button
                    type="button"
                    aria-label="נגן"
                    class="flex h-[72px] w-[72px] cursor-pointer items-center justify-center rounded-[50%] border-none bg-white pr-[6px] text-ink shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                    <svg
                        aria-hidden="true"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M6 4l14 8-14 8V4z" />
                    </svg>
                </button>

                <!-- Progress bar -->
                <div
                    aria-hidden="true"
                    class="absolute right-0 bottom-0 left-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent)] px-[20px] py-[16px]"
                >
                    <div
                        class="h-[3px] overflow-hidden rounded-[999px] bg-[rgba(255,255,255,0.2)]"
                    >
                        <div class="h-full w-0 bg-white" />
                    </div>
                    <div
                        class="mt-[8px] flex justify-between font-latin text-[12px] text-[rgba(255,255,255,0.85)]"
                    >
                        <span>0:00</span>
                        <span>{{ video.duration }}</span>
                    </div>
                </div>
            </div>

            <!-- Meta below -->
            <div class="p-[24px] text-[#e8e6e0] [direction:rtl]">
                <div
                    class="mb-[8px] font-latin text-[11px] font-semibold tracking-[0.14em] text-[#a8c79e] uppercase"
                >
                    {{ video.chapter }}
                </div>
                <div
                    id="tf-video-title"
                    class="mb-[6px] text-[18px] font-semibold"
                >
                    {{ video.title }}
                </div>
                <div class="text-[13px] leading-[1.5] text-[#a8a89c]">
                    {{ video.desc }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@keyframes tf-fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
