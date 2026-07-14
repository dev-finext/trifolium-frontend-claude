<script setup>
// Shared section header: title (+ optional subtitle) with an optional
// "see all" link on the end side. Also used by the Articles pages.
import { getCurrentInstance } from 'vue';

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    linkLabel: { type: String, default: '' },
});
const emit = defineEmits(['link-click']);

// The prototype only accent-highlighted the link on hover when an
// onLinkClick handler was provided — mirror that by checking for a listener.
const hasLink = Boolean(getCurrentInstance()?.vnode.props?.onLinkClick);
</script>

<template>
    <div
        :style="{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--line)',
        }"
    >
        <div>
            <h2 style="font-size: 22px; font-weight: 600; letter-spacing: -0.01em; margin: 0; color: var(--ink)">{{ title }}</h2>
            <p v-if="subtitle" class="small muted" style="margin: 4px 0 0">{{ subtitle }}</p>
        </div>
        <a
            v-if="linkLabel"
            :class="{ 'tf-section-link': hasLink }"
            style="font-size: 13px; color: var(--ink-2); cursor: pointer; font-weight: 500"
            @click="emit('link-click')"
        >{{ linkLabel }} ←</a>
    </div>
</template>

<style>
.tf-section-link:hover {
    color: var(--accent) !important;
}
</style>
