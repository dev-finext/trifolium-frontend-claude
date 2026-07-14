<script setup>
// Validation note — soft, pleasant brick-red. Tells the practitioner exactly
// why the "continue" button is locked. Clicking scrolls to (and flashes) the
// field that needs attention, keyed by DOM id.
defineProps({
    message: { type: String, default: '' },
    target: { type: String, default: null },
});

function scrollToTarget(target) {
    if (!target) return;
    const el = document.getElementById(target);
    if (!el) return;
    const startY = window.pageYOffset;
    const destY = Math.max(0, el.getBoundingClientRect().top + startY - 130);
    // Smooth when the browser supports it…
    try { window.scrollTo({ top: destY, behavior: 'smooth' }); }
    catch (e) { window.scrollTo(0, destY); }
    // …but guarantee arrival even where smooth scrolling is a no-op.
    window.setTimeout(() => {
        if (Math.abs(window.pageYOffset - startY) < 2 && Math.abs(destY - startY) > 4) {
            window.scrollTo(0, destY);
        }
    }, 90);
    // Flash the field immediately (independent of the scroll animation).
    el.classList.remove('tf-anchor-flash');
    void el.offsetWidth; // restart the animation
    el.classList.add('tf-anchor-flash');
    window.setTimeout(() => el.classList.remove('tf-anchor-flash'), 1500);
}
</script>

<template>
    <div
        v-if="message"
        role="alert"
        :title="target ? 'לחצו למעבר למקום שדורש התייחסות' : undefined"
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            padding: '12px 16px',
            background: '#faf0ed',
            border: '1px solid #e6c3ba',
            borderRadius: 'var(--r-card)',
            color: 'var(--danger)',
            fontSize: '13.5px',
            fontWeight: 600,
            lineHeight: 1.45,
            cursor: target ? 'pointer' : 'default',
        }"
        @click="target && scrollToTarget(target)"
    >
        <span
            :style="{
                width: '22px', height: '22px',
                borderRadius: '50%',
                background: 'var(--danger)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }"
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 7v6" />
                <path d="M12 17h.01" />
            </svg>
        </span>
        <span>{{ message }}</span>
        <span
            v-if="target"
            :style="{
                marginInlineStart: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                fontSize: '12.5px',
                fontWeight: 700,
            }"
        >
            קחו אותי לשם
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
            </svg>
        </span>
    </div>
</template>
