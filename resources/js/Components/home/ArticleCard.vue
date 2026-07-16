<script setup>
// Article teaser card — cover with category badge, clamped title/excerpt.
// Clicking opens the article page. Also used by the Articles pages.
import { ref } from 'vue';
import { ItemCover } from '@/Components/art';
import { visit } from '@/lib/routes';

const props = defineProps({
    article: { type: Object, required: true },
});

const hover = ref(false);

// Replaces the prototype's `tf:openArticle` window event.
function open() {
    visit('article', { id: props.article.id });
}
</script>

<template>
    <div
        class="flex flex-col h-full overflow-hidden cursor-pointer bg-surface border rounded-card [transition:transform_.25s_ease,box-shadow_.25s_ease,border-color_.15s_ease]"
        :class="[
            hover ? 'border-ink-2' : 'border-line',
            hover ? '[transform:translateY(-3px)] shadow-[0_8px_24px_-8px_rgba(31,46,29,0.18)]' : '[transform:none] shadow-none',
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="open"
    >
        <div class="relative h-[180px] overflow-hidden border-b border-b-line">
            <div
                class="w-full h-full transition-[transform] duration-400 ease-[ease]"
                :class="hover ? '[transform:scale(1.04)]' : '[transform:scale(1)]'"
            >
                <ItemCover kind="article" :item="article" />
            </div>
            <span
                class="absolute top-[12px] right-[12px] py-[4px] px-[10px] text-[11px] font-bold tracking-[0.04em] whitespace-nowrap text-accent bg-[rgba(255,255,255,0.92)] rounded-[999px] backdrop-blur-[4px]"
            >{{ article.cat }}</span>
        </div>

        <div class="flex flex-col flex-1 p-[18px]">
            <div class="min-h-[42px] mb-[10px] text-[15.5px] font-bold leading-[1.35] text-accent line-clamp-2">{{ article.title }}</div>

            <div class="flex-1 mb-[16px] text-[13px] font-light leading-[1.55] text-ink-2 line-clamp-3">{{ article.excerpt }}</div>

            <div class="flex justify-between items-center pt-[12px] border-t border-t-line">
                <span class="small num muted">{{ article.date }}</span>
                <span
                    class="inline-flex items-center gap-[6px] py-[5px] px-[12px] text-[12px] font-semibold whitespace-nowrap text-accent border border-line rounded-[999px]"
                >לקריאת הכתבה</span>
            </div>
        </div>
    </div>
</template>
