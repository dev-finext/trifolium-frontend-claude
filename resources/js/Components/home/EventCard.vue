<script setup>
// Single event/update card — cover image, category kicker, clamped copy.
import { ref } from 'vue';
import { ItemCover } from '@/Components/art';

defineProps({
    event: { type: Object, required: true },
});

const hover = ref(false);
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
            transform: hover ? 'translateY(-3px)' : 'none',
            boxShadow: hover ? '0 8px 24px -8px rgba(31, 46, 29, 0.18)' : 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, border-color .15s ease',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Image — always in full color -->
        <div style="height: 160px; position: relative; border-bottom: 1px solid var(--line); overflow: hidden">
            <ItemCover kind="event" :item="event" />
        </div>

        <div style="padding: 16px; flex: 1; display: flex; flex-direction: column">
            <div
                :style="{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    marginBottom: '10px',
                }"
            >{{ event.cat }}</div>

            <div
                :style="{
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }"
            >{{ event.title }}</div>

            <div
                :style="{
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    color: 'var(--ink-2)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '14px',
                    flex: 1,
                }"
            >{{ event.desc }}</div>

            <div
                :style="{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--line)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }"
            >
                <span class="small num muted">{{ event.date }}</span>
                <span style="font-size: 12px; color: var(--accent); font-weight: 500">
                    לקריאה ←
                </span>
            </div>
        </div>
    </div>
</template>
