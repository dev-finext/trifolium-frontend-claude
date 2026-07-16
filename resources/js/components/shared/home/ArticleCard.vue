<script setup>
// Article teaser card — cover with category badge, clamped title/excerpt.
// Clicking opens the article page. Also used by the Articles pages.
import { ref } from 'vue';
import { ItemCover } from '@/components/shared/art';
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
        class="flex h-full cursor-pointer flex-col overflow-hidden rounded-card border bg-surface [transition:transform_.25s_ease,box-shadow_.25s_ease,border-color_.15s_ease]"
        :class="[
            hover ? 'border-ink-2' : 'border-line',
            hover
                ? '[transform:translateY(-3px)] shadow-[0_8px_24px_-8px_rgba(31,46,29,0.18)]'
                : '[transform:none] shadow-none',
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="open"
    >
        <div class="relative h-[180px] overflow-hidden border-b border-b-line">
            <div
                class="h-full w-full transition-[transform] duration-400 ease-[ease]"
                :class="
                    hover ? '[transform:scale(1.04)]' : '[transform:scale(1)]'
                "
            >
                <ItemCover kind="article" :item="article" />
            </div>
            <span
                class="absolute top-[12px] right-[12px] rounded-[999px] bg-[rgba(255,255,255,0.92)] px-[10px] py-[4px] text-[11px] font-bold tracking-[0.04em] whitespace-nowrap text-accent backdrop-blur-[4px]"
                >{{ article.cat }}</span
            >
        </div>

        <div class="flex flex-1 flex-col p-[18px]">
            <div
                class="mb-[10px] line-clamp-2 min-h-[42px] text-[15.5px] leading-[1.35] font-bold text-accent"
            >
                {{ article.title }}
            </div>

            <div
                class="mb-[16px] line-clamp-3 flex-1 text-[13px] leading-[1.55] font-light text-ink-2"
            >
                {{ article.excerpt }}
            </div>

            <div
                class="flex items-center justify-between border-t border-t-line pt-[12px]"
            >
                <span class="small num muted">{{ article.date }}</span>
                <span
                    class="inline-flex items-center gap-[6px] rounded-[999px] border border-line px-[12px] py-[5px] text-[12px] font-semibold whitespace-nowrap text-accent"
                    >לקריאת הכתבה</span
                >
            </div>
        </div>
    </div>
</template>
