<script setup>
// Single event/update card — cover image, category kicker, clamped copy.
// `size` drives the bento grid: 'featured' (large, 2×2 cell), 'wide' (2×1)
// or 'compact' (1×1) — same card anatomy, scaled cover and type.
// A video event (event.kind === 'video', with a real `youtube` id) swaps the
// illustrated cover for the lecture's real thumbnail and opens it on click.
import { computed, ref } from 'vue';
import { ItemCover } from '@/components/shared/art';

const props = defineProps({
    event: { type: Object, required: true },
    /** 'featured' | 'wide' | 'compact' */
    size: { type: String, default: 'compact' },
});

const hover = ref(false);

const isVideo = computed(() => props.event.kind === 'video');
const watchUrl = computed(
    () => `https://www.youtube.com/watch?v=${props.event.youtube}`,
);
// The big featured cell gets the sharper 640×480 thumbnail; the small cells
// keep the lighter 480×360. A failed load falls back to the safe hqdefault.
const posterFailed = ref(false);
const poster = computed(() => {
    const quality =
        props.size === 'featured' && !posterFailed.value
            ? 'sddefault'
            : 'hqdefault';

    return `https://img.youtube.com/vi/${props.event.youtube}/${quality}.jpg`;
});

function openVideo() {
    if (isVideo.value) {
        window.open(watchUrl.value, '_blank', 'noopener');
    }
}
</script>

<template>
    <div
        class="flex cursor-pointer flex-col overflow-hidden rounded-card border bg-surface [transition:transform_.25s_ease,box-shadow_.25s_ease,border-color_.15s_ease]"
        :class="[
            hover ? 'border-ink-2' : 'border-line',
            hover
                ? '[transform:translateY(-3px)] shadow-[0_8px_24px_-8px_rgba(31,46,29,0.18)]'
                : '[transform:none] shadow-none',
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="openVideo"
    >
        <!-- Cover -->
        <div
            class="relative overflow-hidden border-b border-b-line"
            :class="
                size === 'featured'
                    ? 'h-[240px]'
                    : size === 'wide'
                      ? 'h-[132px]'
                      : 'h-[124px]'
            "
        >
            <!-- Video event: the lecture's real YouTube thumbnail -->
            <div v-if="isVideo" class="relative h-full w-full bg-[#1f2e1d]">
                <img
                    :src="poster"
                    :alt="event.title"
                    class="h-full w-full object-cover opacity-90"
                    @error="posterFailed = true"
                />
                <!-- channel chip -->
                <div
                    class="absolute top-[10px] right-[10px] flex items-center gap-[6px] rounded-[999px] bg-[rgba(20,28,24,0.72)] px-[10px] py-[4px] text-[11px] font-semibold text-white backdrop-blur-[4px]"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fill="#ff0000"
                            d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.8 12 4.8 12 4.8s-7 0-8.9.6A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.6 8.9.6 8.9.6s7 0 8.9-.6A3 3 0 0 0 23 16.5 31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5z"
                        />
                        <path fill="#fff" d="M9.8 15.3V8.7l5.7 3.3z" />
                    </svg>
                    בית מרקחת טריפוליום
                </div>
                <!-- centered play -->
                <span
                    class="absolute top-1/2 left-1/2 flex h-[52px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[14px] bg-[#ff0000] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] transition-transform duration-150"
                    :class="hover ? 'scale-[1.06]' : 'scale-100'"
                >
                    <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="#fff"
                        aria-hidden="true"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </span>
            </div>

            <!-- Regular event: illustrated cover -->
            <ItemCover v-else kind="event" :item="event" />
        </div>

        <div
            class="flex flex-1 flex-col"
            :class="size === 'featured' ? 'p-[20px]' : 'p-[14px]'"
        >
            <div
                class="mb-[8px] text-[11px] font-semibold tracking-[0.12em] text-accent uppercase"
            >
                {{ event.cat }}
            </div>

            <div
                class="mb-[8px] leading-[1.35] font-bold text-ink"
                :class="
                    size === 'featured'
                        ? 'line-clamp-2 text-[19px]'
                        : 'line-clamp-2 text-[14.5px]'
                "
            >
                {{ event.title }}
            </div>

            <div
                class="flex-1 leading-[1.5] font-light text-ink-2"
                :class="
                    size === 'featured'
                        ? 'mb-[14px] line-clamp-3 text-[13.5px]'
                        : 'mb-[12px] line-clamp-2 text-[12.5px]'
                "
            >
                {{ event.desc }}
            </div>

            <div
                class="flex items-center justify-between border-t border-t-line pt-[12px]"
            >
                <span class="small num muted">{{ event.date }}</span>
                <span
                    v-if="isVideo"
                    class="inline-flex items-center gap-[5px] text-[12px] font-semibold text-accent"
                >
                    לצפייה בהרצאה ↗
                </span>
                <span v-else class="text-[12px] font-medium text-accent">
                    לקריאה ←
                </span>
            </div>
        </div>
    </div>
</template>
