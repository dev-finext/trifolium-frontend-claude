<script setup>
// Step-4 column icon — teal, line style (matches lucide 1.5px stroke).
// One of: scale (כמות) · drop (יחידת מידה) · gauge (פעמים ביום) · moon (זמן לקיחה).
defineProps({
    /** 'scale' | 'drop' | 'gauge' | 'moon' */
    type: { type: String, required: true },
    size: { type: Number, default: 36 },
});
</script>

<template>
    <!-- Shared stroke attributes replicate the prototype's `s` spread object. -->
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <g v-if="type === 'scale'">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </g>
        <g v-else-if="type === 'drop'">
            <path
                d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
            />
        </g>
        <g v-else-if="type === 'gauge'">
            <path d="m12 14 4-4" />
            <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </g>
        <g v-else-if="type === 'moon'">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </g>
    </svg>
</template>
