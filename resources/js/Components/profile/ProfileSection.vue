<script setup>
// Profile-editor section card: title + description column beside the fields.
defineProps({
    title: { type: String, required: true },
    desc: { type: String, default: '' },
});
</script>

<template>
    <section class="card" style="padding: 0; overflow: visible">
        <div style="display: grid; grid-template-columns: 232px 1fr; gap: 0">
            <div style="padding: 24px 24px 28px; order: 1">
                <h2 style="margin: 0; font-size: 15px; font-weight: 600">{{ title }}</h2>
                <p v-if="desc" class="small muted" style="margin: 8px 0 0; line-height: 1.6">{{ desc }}</p>
            </div>
            <div style="padding: 24px 28px 28px; order: 2; border-inline-start: 1px solid var(--line)">
                <slot />
            </div>
        </div>
    </section>
</template>
