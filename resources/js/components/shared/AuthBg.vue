<script setup>
// Ambient backdrop for the centered auth cards — a soft sage gradient with a
// gentle top-light radial, kept calm and low-contrast so the white card stays
// crisp.
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
        <div
            class="absolute inset-0 bg-[linear-gradient(160deg,#eef2ec_0%,#e4ece1_55%,#dae4d6_100%)]"
        />
        <div
            class="absolute inset-0 bg-[radial-gradient(110%_80%_at_28%_22%,rgba(255,255,255,0.55),rgba(255,255,255,0)_60%)]"
        />
    </div>
</template>
