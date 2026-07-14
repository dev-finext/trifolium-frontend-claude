<script setup>
// Toast confirming an item was added to the cart / moved to pending —
// bottom-center, auto-dismiss (timing lives in the cart store).
import Icon from '@/Components/ui/Icon.vue';
import { useCartStore } from '@/stores/cart';
import { visit } from '@/lib/routes';

const cart = useCartStore();

function view() {
    const target = cart.state.toast?.target || 'cart';
    cart.dismissToast();
    visit(target);
}
</script>

<template>
    <div
        v-if="cart.state.toast"
        :style="{
            position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 300, display: 'flex', alignItems: 'center', gap: '14px',
            background: 'var(--ink)', color: '#fff',
            padding: '12px 14px 12px 18px', borderRadius: '10px',
            boxShadow: '0 12px 32px rgba(20,28,24,0.32)',
            animation: 'tf-toast-in .22s ease',
            maxWidth: 'min(92vw, 460px)',
        }"
    >
        <span
            :style="{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.16)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <Icon name="check" :size="16" color="#fff" :stroke="2.4" />
        </span>
        <div style="min-width: 0">
            <div style="font-size: 13.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ cart.state.toast.title }}
            </div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.72); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{ cart.state.toast.name }}
            </div>
        </div>
        <button
            :style="{
                flexShrink: 0, marginInlineStart: '4px',
                background: 'var(--accent)', color: '#fff', border: 'none',
                padding: '7px 14px', borderRadius: '7px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }"
            @click="view"
        >{{ cart.state.toast.actionLabel || 'צפה בסל' }}</button>
        <button
            aria-label="סגור"
            :style="{
                flexShrink: 0, background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px',
                display: 'inline-flex',
            }"
            @click="cart.dismissToast()"
        ><Icon name="x" :size="15" color="rgba(255,255,255,0.6)" /></button>
    </div>
</template>
