<script setup>
// Toast confirming an item was added to the cart / moved to pending —
// bottom-center, auto-dismiss (timing lives in the cart store).
import Icon from '@/components/ui/Icon.vue';
import { useCartStore } from '@/stores/cart';
import { visit } from '@/lib/routes';

const cart = useCartStore();

function view() {
    const toast = cart.state.toast;
    // Undo toast (item removed): the action restores the line instead of navigating.
    if (toast?.action === 'undo') {
        cart.undoRemove();
        return;
    }
    const target = toast?.target || 'cart';
    cart.dismissToast();
    visit(target);
}
</script>

<template>
    <!-- A5 · Persistent polite live region so the toast text is announced to
         screen readers when it appears (a live region must exist before its
         content changes). The visible toast lives inside it. -->
    <div role="status" aria-live="polite" aria-atomic="true">
    <div
        v-if="cart.state.toast"
        class="fixed bottom-[28px] left-[50%] [transform:translateX(-50%)] z-[300] flex items-center gap-[14px] max-w-[min(92vw,460px)] py-[12px] pr-[14px] pl-[18px] text-[#fff] bg-inverse-surface rounded-[10px] shadow-[0_12px_32px_rgba(20,28,24,0.32)] animate-[tf-toast-in_.22s_ease]"
    >
        <span
            class="inline-flex items-center justify-center w-[30px] h-[30px] shrink-0 bg-[rgba(255,255,255,0.16)] rounded-full"
        >
            <Icon name="check" :size="16" color="#fff" :stroke="2.4" />
        </span>
        <div class="min-w-0">
            <div class="whitespace-nowrap overflow-hidden text-ellipsis text-[13.5px] font-semibold">
                {{ cart.state.toast.title }}
            </div>
            <div class="whitespace-nowrap overflow-hidden text-ellipsis text-[12px] text-[rgba(255,255,255,0.72)]">
                {{ cart.state.toast.name }}
            </div>
        </div>
        <button
            class="shrink-0 ms-[4px] py-[7px] px-[14px] [font-family:inherit] text-[13px] font-semibold whitespace-nowrap text-on-accent bg-accent border-none rounded-[7px] cursor-pointer"
            @click="view"
        >{{ cart.state.toast.actionLabel || 'צפה בסל' }}</button>
        <button
            aria-label="סגור"
            class="inline-flex shrink-0 p-[4px] text-[rgba(255,255,255,0.6)] bg-transparent border-none cursor-pointer"
            @click="cart.dismissToast()"
        ><Icon name="x" :size="15" color="rgba(255,255,255,0.6)" /></button>
    </div>
    </div>
</template>
