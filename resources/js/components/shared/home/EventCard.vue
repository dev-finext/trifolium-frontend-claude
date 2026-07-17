<script setup>
// Single event/update card — cover image, category kicker, clamped copy.
// `size` drives the bento grid: 'featured' (large, 2×2 cell), 'wide' (2×1)
// or 'compact' (1×1) — same card anatomy, scaled cover and type.
import { ref } from 'vue';
import { ItemCover } from '@/components/shared/art';

defineProps({
    event: { type: Object, required: true },
    /** 'featured' | 'wide' | 'compact' */
    size: { type: String, default: 'compact' },
});

const hover = ref(false);
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
    >
        <!-- Image — always in full color -->
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
            <ItemCover kind="event" :item="event" />
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
                <span class="text-[12px] font-medium text-accent">
                    לקריאה ←
                </span>
            </div>
        </div>
    </div>
</template>
