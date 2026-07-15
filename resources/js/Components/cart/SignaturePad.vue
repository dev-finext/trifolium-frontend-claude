<script setup>
// Freehand signature canvas for the courier power-of-attorney form.
// Emits `ink-change` (bool) when the pad transitions between empty and inked.
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const emit = defineEmits(['ink-change']);

const canvasRef = ref(null);
// Plain (non-reactive) drawing state — nothing here drives the template.
let ctx = null;
let drawing = false;
let last = { x: 0, y: 0 };
let inked = false;
let ro = null;

// (Re)size the canvas backing store to match its CSS box at the current DPR.
// (F35) Sizing only in onMounted meant an orientation change or a late layout
// shift left the backing store the wrong size and distorted the stroke. This
// re-fits on demand and repaints any existing signature scaled to the new box.
function fitCanvas() {
    const c = canvasRef.value;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    // Nothing changed — avoid a needless clear (setting width/height wipes the canvas).
    if (ctx && c.width === w && c.height === h) return;

    // Snapshot the current drawing so a resize does not erase the signature.
    let snapshot = null;
    if (ctx && inked && c.width > 0 && c.height > 0) {
        try { snapshot = c.toDataURL(); } catch (e) { snapshot = null; }
    }

    c.width = w;
    c.height = h;
    ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1f2e1d';

    if (snapshot) {
        const img = new Image();
        img.onload = () => { if (ctx) ctx.drawImage(img, 0, 0, rect.width, rect.height); };
        img.src = snapshot;
    }
}

const onOrientation = () => fitCanvas();

onMounted(() => {
    fitCanvas();
    // ResizeObserver catches both viewport resizes and late layout shifts;
    // orientationchange is kept as an explicit fallback for older WebViews.
    if (typeof ResizeObserver !== 'undefined' && canvasRef.value) {
        ro = new ResizeObserver(() => fitCanvas());
        ro.observe(canvasRef.value);
    } else {
        window.addEventListener('resize', onOrientation);
    }
    window.addEventListener('orientationchange', onOrientation);
});

onBeforeUnmount(() => {
    if (ro) { ro.disconnect(); ro = null; }
    window.removeEventListener('resize', onOrientation);
    window.removeEventListener('orientationchange', onOrientation);
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
                background: 'var(--surface)', cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
            }"
            @click="clear"
        >
            <Icon name="x" :size="15" color="var(--danger)" />
        </button>
        <canvas
            ref="canvasRef"
            role="img"
            aria-label="אזור חתימה — חתמו כאן באמצעות העכבר או האצבע"
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
