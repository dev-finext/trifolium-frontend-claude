<script setup>
// Round initials avatar — filled accent when the patient is selected.
defineProps({
    initials: { type: String, default: '' },
    size: { type: Number, default: 46 },
    sel: { type: Boolean, default: false },
});
</script>

<template>
    <div
        class="flex shrink-0 items-center justify-center rounded-[50%] font-bold"
        :class="
            sel
                ? 'bg-accent text-white'
                : 'bg-accent-tint-strong text-accent-ink'
        "
        :style="{
            width: `${size}px`,
            height: `${size}px`,
            fontSize: `${Math.round(size * 0.34)}px`,
        }"
    >
        {{ initials }}
    </div>
</template>
