<script setup>
// Empty state for the on-hold list — points the user back to the cart.
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div class="card max-w-[520px] my-0 mx-auto px-[24px] py-[72px] text-center">
        <div
            class="inline-flex items-center justify-center w-[64px] h-[64px] mt-0 mx-auto mb-[18px] text-ink-3 bg-surface-sunk rounded-[50%]"
        >
            <Icon name="clock" :size="28" />
        </div>
        <div class="mb-[6px] text-[18px] font-semibold">אין הזמנות בהמתנה</div>
        <p class="small muted max-w-[340px] mt-0 mx-auto mb-[22px]">
            הזמנות שתעבירו להמתנה מהסל יופיעו כאן, ויחכו עד שתהיו מוכנים לשלוח אותן לתשלום.
        </p>
        <button class="btn btn--accent" @click="visit('cart')">
            <Icon name="cart" :size="16" color="#fff" /> מעבר לסל הקניות
        </button>
    </div>
</template>
