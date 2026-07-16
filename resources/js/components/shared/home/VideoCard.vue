<script setup>
// Tutorial video card — cover thumbnail, hover play affordance, duration badge.
import { ref } from 'vue';
import { ItemCover } from '@/components/shared/art';

defineProps({
    video: { type: Object, required: true },
    index: { type: Number, default: 0 },
});
defineEmits(['play']);

const hover = ref(false);
</script>

<template>
    <div
        class="cursor-pointer overflow-hidden rounded-card border bg-surface [transition:transform_.25s_ease,box-shadow_.25s_ease,border-color_.15s_ease]"
        :class="[
            hover ? 'border-ink-2' : 'border-line',
            hover
                ? '[transform:translateY(-3px)] shadow-[0_8px_24px_-8px_rgba(31,46,29,0.18)]'
                : '[transform:none] shadow-none',
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="$emit('play')"
    >
        <!-- Thumbnail -->
        <div class="relative h-[220px] overflow-hidden">
            <ItemCover kind="video" :item="video" />
            <!-- dark overlay on hover -->
            <div
                class="absolute inset-0 bg-[#000] transition-opacity duration-250 ease-[ease]"
                :class="hover ? 'opacity-30' : 'opacity-0'"
            />
            <!-- Play button (pr-[4px] = optical correction for triangle) -->
            <div class="absolute inset-0 flex items-center justify-center">
                <div
                    class="flex h-[48px] w-[48px] items-center justify-center rounded-[50%] pr-[4px] text-ink transition-all duration-200"
                    :class="
                        hover
                            ? '[transform:scale(1.06)] bg-[#fff] shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
                            : '[transform:scale(1)] bg-[rgba(255,255,255,0.92)] shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
                    "
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M6 4l14 8-14 8V4z" />
                    </svg>
                </div>
            </div>
            <!-- Duration badge -->
            <div
                class="num absolute bottom-[12px] left-[12px] rounded-[4px] bg-[rgba(0,0,0,0.65)] px-[8px] py-[3px] font-latin text-[11px] font-medium tracking-[0.02em] text-white"
            >
                {{ video.duration }}
            </div>
        </div>

        <!-- Meta -->
        <div class="p-[18px]">
            <div
                class="mb-[10px] font-latin text-[11px] font-semibold tracking-[0.14em] text-accent uppercase"
            >
                {{ video.chapter }}
            </div>

            <div
                class="mb-[8px] line-clamp-2 text-[15px] leading-[1.35] font-bold text-ink"
            >
                {{ video.title }}
            </div>

            <div
                class="mb-[12px] line-clamp-2 text-[12px] leading-[1.5] font-light text-ink-2"
            >
                {{ video.desc }}
            </div>

            <div class="text-[12px] font-medium text-accent">צפה בסרטון ←</div>
        </div>
    </div>
</template>
