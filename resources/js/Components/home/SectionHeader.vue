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
    <div class="flex justify-between items-end mb-[20px] pb-[16px] border-b border-b-line">
        <div>
            <h2 class="m-0 text-[22px] font-semibold tracking-[-0.01em] text-ink">{{ title }}</h2>
            <p v-if="subtitle" class="small muted mt-[4px] mx-0 mb-0">{{ subtitle }}</p>
        </div>
        <a
            v-if="linkLabel"
            class="cursor-pointer text-[13px] font-medium text-ink-2"
            :class="{ 'tf-section-link': hasLink }"
            @click="emit('link-click')"
        >{{ linkLabel }} ←</a>
    </div>
</template>

<style>
.tf-section-link:hover {
    color: var(--accent) !important;
}
</style>
