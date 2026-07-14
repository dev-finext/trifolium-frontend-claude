<script setup>
// Empty state for the on-hold list — points the user back to the cart.
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <div class="card" style="padding: 72px 24px; text-align: center; max-width: 520px; margin: 0 auto">
        <div
            :style="{
                width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 18px',
                background: 'var(--surface-sunk)', color: 'var(--ink-3)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <Icon name="clock" :size="28" />
        </div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 6px">אין הזמנות בהמתנה</div>
        <p class="small muted" style="margin: 0 auto 22px; max-width: 340px">
            הזמנות שתעבירו להמתנה מהסל יופיעו כאן, ויחכו עד שתהיו מוכנים לשלוח אותן לתשלום.
        </p>
        <button class="btn btn--accent" @click="visit('cart')">
            <Icon name="cart" :size="16" color="#fff" /> מעבר לסל הקניות
        </button>
    </div>
</template>
