<script setup>
// Freehand signature canvas for the courier power-of-attorney form.
// Emits `ink-change` (bool) when the pad transitions between empty and inked.
import { ref, onMounted } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const emit = defineEmits(['ink-change']);

const canvasRef = ref(null);
// Plain (non-reactive) drawing state — nothing here drives the template.
let ctx = null;
let drawing = false;
let last = { x: 0, y: 0 };
let inked = false;

onMounted(() => {
    const c = canvasRef.value;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(rect.width * dpr);
    c.height = Math.round(rect.height * dpr);
    ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1f2e1d';
});

function pos(e) {
    const r = canvasRef.value.getBoundingClientRect();
    const t = (e.touches && e.touches[0]) || e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
}
function start(e) { e.preventDefault(); drawing = true; last = pos(e); }
function move(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
    if (!inked) { inked = true; emit('ink-change', true); }
}
function end() { drawing = false; }
function clear() {
    const c = canvasRef.value;
    ctx.clearRect(0, 0, c.width, c.height);
    inked = false;
    emit('ink-change', false);
}
</script>

<template>
    <div style="position: relative">
        <button
            title="ניקוי חתימה"
            :style="{
                position: 'absolute', top: '8px', left: '8px', zIndex: 2,
                width: '30px', height: '30px', borderRadius: '8px', border: '1px solid var(--line)',
                background: '#fff', cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
            }"
            @click="clear"
        >
            <Icon name="x" :size="15" color="var(--danger)" />
        </button>
        <canvas
            ref="canvasRef"
            :style="{
                width: '100%', height: '230px', display: 'block',
                border: '1px solid var(--line)', borderRadius: 'var(--r-card)',
                background: '#fff', touchAction: 'none', cursor: 'crosshair',
            }"
            @mousedown="start"
            @mousemove="move"
            @mouseup="end"
            @mouseleave="end"
            @touchstart="start"
            @touchmove="move"
            @touchend="end"
        />
    </div>
</template>
