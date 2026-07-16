<script setup>
// Toast confirming an item was added to the cart / moved to pending —
// bottom-center, auto-dismiss (timing lives in the cart store).
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';

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
            class="fixed bottom-[28px] left-[50%] z-[300] flex max-w-[min(92vw,460px)] [transform:translateX(-50%)] animate-[tf-toast-in_.22s_ease] items-center gap-[14px] rounded-[10px] bg-inverse-surface py-[12px] pr-[14px] pl-[18px] text-[#fff] shadow-[0_12px_32px_rgba(20,28,24,0.32)]"
        >
            <span
                class="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.16)]"
            >
                <Icon name="check" :size="16" color="#fff" :stroke="2.4" />
            </span>
            <div class="min-w-0">
                <div
                    class="overflow-hidden text-[13.5px] font-semibold text-ellipsis whitespace-nowrap"
                >
                    {{ cart.state.toast.title }}
                </div>
                <div
                    class="overflow-hidden text-[12px] text-ellipsis whitespace-nowrap text-[rgba(255,255,255,0.72)]"
                >
                    {{ cart.state.toast.name }}
                </div>
            </div>
            <button
                class="ms-[4px] shrink-0 cursor-pointer rounded-[7px] border-none bg-accent px-[14px] py-[7px] [font-family:inherit] text-[13px] font-semibold whitespace-nowrap text-on-accent"
                @click="view"
            >
                {{ cart.state.toast.actionLabel || 'צפה בסל' }}
            </button>
            <button
                aria-label="סגור"
                class="inline-flex shrink-0 cursor-pointer border-none bg-transparent p-[4px] text-[rgba(255,255,255,0.6)]"
                @click="cart.dismissToast()"
            >
                <Icon name="x" :size="15" color="rgba(255,255,255,0.6)" />
            </button>
        </div>
    </div>
</template>
