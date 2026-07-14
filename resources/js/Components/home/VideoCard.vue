<script setup>
// Tutorial video card — cover thumbnail, hover play affordance, duration badge.
import { ref } from 'vue';
import { ItemCover } from '@/Components/art';

defineProps({
    video: { type: Object, required: true },
    index: { type: Number, default: 0 },
});
defineEmits(['play']);

const hover = ref(false);
</script>

<template>
    <div
        :style="{
            background: '#fff',
            border: '1px solid ' + (hover ? 'var(--ink-2)' : 'var(--line)'),
            borderRadius: 'var(--r-card)',
            overflow: 'hidden',
            cursor: 'pointer',
            transform: hover ? 'translateY(-3px)' : 'none',
            boxShadow: hover ? '0 8px 24px -8px rgba(31, 46, 29, 0.18)' : 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, border-color .15s ease',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @click="$emit('play')"
    >
        <!-- Thumbnail -->
        <div style="height: 220px; position: relative; overflow: hidden">
            <ItemCover kind="video" :item="video" />
            <!-- dark overlay on hover -->
            <div
                :style="{
                    position: 'absolute', inset: 0,
                    background: '#000',
                    opacity: hover ? 0.30 : 0,
                    transition: 'opacity .25s ease',
                }"
            />
            <!-- Play button -->
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">
                <div
                    :style="{
                        width: '48px', height: '48px',
                        borderRadius: '50%',
                        background: hover ? '#fff' : 'rgba(255,255,255,0.92)',
                        color: 'var(--ink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingRight: '4px', // optical correction for triangle
                        transition: 'all .2s',
                        boxShadow: hover ? '0 4px 16px rgba(0,0,0,0.25)' : '0 2px 6px rgba(0,0,0,0.15)',
                        transform: hover ? 'scale(1.06)' : 'scale(1)',
                    }"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4l14 8-14 8V4z" />
                    </svg>
                </div>
            </div>
            <!-- Duration badge -->
            <div
                class="num"
                :style="{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-latin)',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                }"
            >{{ video.duration }}</div>
        </div>

        <!-- Meta -->
        <div style="padding: 18px">
            <div
                :style="{
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    fontWeight: 600,
                    marginBottom: '10px',
                    fontFamily: 'var(--font-latin)',
                }"
            >{{ video.chapter }}</div>

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
            >{{ video.title }}</div>

            <div
                :style="{
                    fontSize: '12px',
                    fontWeight: 300,
                    lineHeight: 1.5,
                    color: 'var(--ink-2)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '12px',
                }"
            >{{ video.desc }}</div>

            <div style="font-size: 12px; color: var(--accent); font-weight: 500">צפה בסרטון ←</div>
        </div>
    </div>
</template>
