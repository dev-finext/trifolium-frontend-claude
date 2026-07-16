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
        class="flex items-center gap-[11px] px-[16px] py-[12px] text-[13.5px] font-semibold leading-[1.45] text-danger bg-[#faf0ed] border border-[#e6c3ba] rounded-card"
        :class="target ? 'cursor-pointer' : 'cursor-default'"
        @click="target && scrollToTarget(target)"
    >
        <span
            class="inline-flex items-center justify-center w-[22px] h-[22px] shrink-0 text-white bg-danger rounded-[50%]"
        >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 7v6" />
                <path d="M12 17h.01" />
            </svg>
        </span>
        <span>{{ message }}</span>
        <span
            v-if="target"
            class="inline-flex items-center gap-[5px] ms-auto shrink-0 text-[12.5px] font-bold"
        >
            קחו אותי לשם
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
            </svg>
        </span>
    </div>
</template>
