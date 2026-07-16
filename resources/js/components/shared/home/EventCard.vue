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
        class="flex flex-col overflow-hidden cursor-pointer bg-surface border rounded-card [transition:transform_.25s_ease,box-shadow_.25s_ease,border-color_.15s_ease]"
        :class="[
            hover ? 'border-ink-2' : 'border-line',
            hover ? '[transform:translateY(-3px)] shadow-[0_8px_24px_-8px_rgba(31,46,29,0.18)]' : '[transform:none] shadow-none',
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Image — always in full color -->
        <div class="relative h-[160px] overflow-hidden border-b border-b-line">
            <ItemCover kind="event" :item="event" />
        </div>

        <div class="flex flex-col flex-1 p-[16px]">
            <div class="mb-[10px] text-[11px] font-semibold tracking-[0.12em] uppercase text-accent">{{ event.cat }}</div>

            <div class="mb-[8px] text-[15px] font-bold leading-[1.35] text-ink line-clamp-2">{{ event.title }}</div>

            <div class="flex-1 mb-[14px] text-[13px] font-light leading-[1.5] text-ink-2 line-clamp-2">{{ event.desc }}</div>

            <div class="flex justify-between items-center pt-[12px] border-t border-t-line">
                <span class="small num muted">{{ event.date }}</span>
                <span class="text-[12px] font-medium text-accent">
                    לקריאה ←
                </span>
            </div>
        </div>
    </div>
</template>
