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
        :style="{
            background: 'var(--surface)',
            border: '1px solid ' + (hover ? 'var(--ink-2)' : 'var(--line)'),
            borderRadius: 'var(--r-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            height: '100%',
            transform: hover ? 'translateY(-3px)' : 'none',
            boxShadow: hover ? '0 8px 24px -8px rgba(31, 46, 29, 0.18)' : 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, border-color .15s ease',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="open"
    >
        <div style="height: 180px; position: relative; border-bottom: 1px solid var(--line); overflow: hidden">
            <div
                :style="{
                    width: '100%', height: '100%',
                    transform: hover ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform .4s ease',
                }"
            >
                <ItemCover kind="article" :item="article" />
            </div>
            <span
                :style="{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,255,255,0.92)',
                    color: 'var(--accent)',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
                    padding: '4px 10px', borderRadius: '999px',
                    backdropFilter: 'blur(4px)',
                    whiteSpace: 'nowrap',
                }"
            >{{ article.cat }}</span>
        </div>

        <div style="padding: 18px; display: flex; flex-direction: column; flex: 1">
            <div
                :style="{
                    fontSize: '15.5px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--accent)',
                    marginBottom: '10px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '42px',
                }"
            >{{ article.title }}</div>

            <div
                :style="{
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: 1.55,
                    color: 'var(--ink-2)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    flex: 1,
                }"
            >{{ article.excerpt }}</div>

            <div
                :style="{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }"
            >
                <span class="small num muted">{{ article.date }}</span>
                <span
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        border: '1px solid var(--line)',
                        borderRadius: '999px', padding: '5px 12px',
                        fontSize: '12px', color: 'var(--accent)', fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }"
                >לקריאת הכתבה</span>
            </div>
        </div>
    </div>
</template>
