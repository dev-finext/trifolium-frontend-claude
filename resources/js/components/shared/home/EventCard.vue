<script setup>
// Single event/update card — cover image, category kicker, clamped copy.
import { ref } from 'vue';
import { ItemCover } from '@/components/shared/art';

defineProps({
    event: { type: Object, required: true },
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
        <div class="relative h-[160px] overflow-hidden border-b border-b-line">
            <ItemCover kind="event" :item="event" />
        </div>

        <div class="flex flex-1 flex-col p-[16px]">
            <div
                class="mb-[10px] text-[11px] font-semibold tracking-[0.12em] text-accent uppercase"
            >
                {{ event.cat }}
            </div>

            <div
                class="mb-[8px] line-clamp-2 text-[15px] leading-[1.35] font-bold text-ink"
            >
                {{ event.title }}
            </div>

            <div
                class="mb-[14px] line-clamp-2 flex-1 text-[13px] leading-[1.5] font-light text-ink-2"
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
