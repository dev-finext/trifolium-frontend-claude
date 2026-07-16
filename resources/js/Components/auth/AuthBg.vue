<script setup>
// Ambient backdrop for the centered auth cards — a soft sage gradient with a
// gentle top-light radial, kept calm and low-contrast so the white card stays
// crisp.
</script>

<template>
    <div
        aria-hidden="true"
        :style="{ position: 'absolute', inset: '0', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }"
    >
        <div style="position: absolute; inset: 0; background: linear-gradient(160deg, #eef2ec 0%, #e4ece1 55%, #dae4d6 100%)" />
        <div style="position: absolute; inset: 0; background: radial-gradient(110% 80% at 28% 22%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)" />
    </div>
</template>
