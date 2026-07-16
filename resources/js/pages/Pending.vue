<script setup>
// הזמנות בהמתנה — Pending / on-hold orders. Orders parked out of the active
// cart: awaiting payment, patient approval, or still a draft. Each can be
// returned to the cart or removed.
import { Head } from '@inertiajs/vue3';
import { useCartStore } from '@/stores/cart';
import PendingCard from '@/components/shared/pending/PendingCard.vue';
import EmptyPending from '@/components/shared/pending/EmptyPending.vue';

// The prototype received `items`/`setItems` as props from the app shell; the
// held lines now live in the cart store and are edited in place.
const cart = useCartStore();

// Return a held line to the cart: strip the hold metadata, re-add the rest
// as a regular cart line, and drop it from the on-hold list.
function onReturn(item) {
    const { heldAt, reason, reasonTone, orderId, ...rest } = item;
    cart.addToCart({ ...rest });
    cart.state.pendingItems = cart.state.pendingItems.filter((x) => x.id !== item.id);
}

function onRemove(id) {
    cart.state.pendingItems = cart.state.pendingItems.filter((x) => x.id !== id);
}
</script>

<template>
    <Head title="הזמנות בהמתנה" />
    <div class="page">
        <div class="page__inner page__inner--wide">
            <!-- Header -->
            <div class="page-head mb-[24px]">
                <div>
                    <h1 class="page-title">הזמנות בהמתנה</h1>
                    <p class="page-sub">
                        הזמנות וטיוטות שהוקפאו — ממתינות לתשלום, לאישור המטופל או להשלמה.
                    </p>
                </div>
            </div>

            <EmptyPending v-if="cart.state.pendingItems.length === 0" />
            <div v-else class="col gap-[16px]">
                <PendingCard
                    v-for="it in cart.state.pendingItems"
                    :key="it.id"
                    :item="it"
                    @return="onReturn"
                    @remove="onRemove"
                />
            </div>
        </div>
    </div>
</template>
