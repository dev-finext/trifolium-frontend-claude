<script setup>
// Small bottle / capsule illustration for a custom formula.
defineProps({
    typeId: { type: String, default: 'tincture' },
});
</script>

<template>
    <svg v-if="typeId === 'capsule'" width="92" height="104" viewBox="0 0 92 104" fill="none" style="display: block">
        <ellipse cx="46" cy="96" rx="30" ry="5" fill="rgba(31,46,29,0.10)" />
        <!-- jar -->
        <rect x="20" y="20" width="52" height="14" rx="4" fill="var(--accent-ink)" />
        <rect x="16" y="32" width="60" height="58" rx="10" fill="var(--accent)" />
        <rect x="24" y="46" width="44" height="34" rx="4" fill="#f4efe3" />
        <!-- capsules -->
        <g transform="translate(34,58) rotate(-18)">
            <rect x="-12" y="-5" width="24" height="10" rx="5" fill="#fff" stroke="var(--accent-ink)" stroke-width="1.2" />
            <rect x="-12" y="-5" width="12" height="10" rx="5" fill="var(--warning)" opacity="0.85" />
        </g>
        <g transform="translate(52,68) rotate(14)">
            <rect x="-12" y="-5" width="24" height="10" rx="5" fill="#fff" stroke="var(--accent-ink)" stroke-width="1.2" />
            <rect x="-12" y="-5" width="12" height="10" rx="5" fill="var(--warning)" opacity="0.85" />
        </g>
    </svg>

    <!-- tincture dropper bottle + graduated beaker -->
    <svg v-else width="98" height="104" viewBox="0 0 98 104" fill="none" style="display: block">
        <ellipse cx="49" cy="97" rx="40" ry="5" fill="rgba(31,46,29,0.10)" />
        <!-- dropper bottle -->
        <g transform="translate(34,4)">
            <rect x="-9" y="0" width="18" height="9" rx="2" fill="var(--accent-ink)" />
            <rect x="-6" y="9" width="12" height="7" fill="var(--accent-ink)" opacity="0.85" />
            <rect x="-18" y="16" width="36" height="74" rx="9" fill="var(--accent)" />
            <rect x="-12" y="40" width="24" height="42" rx="3" fill="#f4efe3" />
            <rect x="-7" y="48" width="14" height="2.5" rx="1" fill="var(--accent)" opacity="0.55" />
            <rect x="-7" y="55" width="10" height="2.5" rx="1" fill="var(--ink-4)" opacity="0.6" />
            <rect x="-7" y="68" width="9" height="5" rx="1" fill="var(--warning)" opacity="0.8" />
        </g>
        <!-- graduated beaker -->
        <g transform="translate(72,52)">
            <path d="M-13 0 H13 V30 a4 4 0 0 1-4 4 H-9 a4 4 0 0 1-4-4 Z" fill="#fff" stroke="var(--line-strong)" stroke-width="1.4" />
            <path d="M-12 18 H12 V30 a4 4 0 0 1-4 4 H-8 a4 4 0 0 1-4-4 Z" fill="var(--warning)" opacity="0.55" />
            <path d="M-13 0 q6 -4 13 0 q7 4 13 0" fill="none" stroke="var(--line-strong)" stroke-width="1.4" />
            <path d="M8 6 H12 M8 12 H12 M8 18 H12" stroke="var(--ink-4)" stroke-width="1" />
        </g>
    </svg>
</template>
