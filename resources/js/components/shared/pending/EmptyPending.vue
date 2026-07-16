<script setup>
// Empty state for the on-hold list — points the user back to the cart.
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div
        class="card mx-auto my-0 max-w-[520px] px-[24px] py-[72px] text-center"
    >
        <div
            class="mx-auto mt-0 mb-[18px] inline-flex h-[64px] w-[64px] items-center justify-center rounded-[50%] bg-surface-sunk text-ink-3"
        >
            <Icon name="clock" :size="28" />
        </div>
        <div class="mb-[6px] text-[18px] font-semibold">אין הזמנות בהמתנה</div>
        <p class="small muted mx-auto mt-0 mb-[22px] max-w-[340px]">
            הזמנות שתעבירו להמתנה מהסל יופיעו כאן, ויחכו עד שתהיו מוכנים לשלוח
            אותן לתשלום.
        </p>
        <button class="btn btn--accent" @click="visit('cart')">
            <Icon name="cart" :size="16" color="#fff" /> מעבר לסל הקניות
        </button>
    </div>
</template>
