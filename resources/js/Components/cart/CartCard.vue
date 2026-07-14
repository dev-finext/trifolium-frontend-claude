<script setup>
// One cart line — body + price rail.
import { visit } from '@/lib/routes';
import ShelfBody from '@/Components/cart/ShelfBody.vue';
import FormulaBody from '@/Components/cart/FormulaBody.vue';
import PriceRail from '@/Components/cart/PriceRail.vue';

defineProps({
    item: { type: Object, required: true },
});
const emit = defineEmits(['qty', 'remove', 'hold']);
</script>

<template>
    <div class="card cart-card" style="display: flex; align-items: stretch; flex-wrap: wrap">
        <ShelfBody v-if="item.kind === 'shelf'" :item="item" />
        <FormulaBody v-else :item="item" />
        <PriceRail
            :item="item"
            :editable="item.kind === 'formula'"
            @qty="(q) => emit('qty', q)"
            @remove="emit('remove')"
            @hold="emit('hold')"
            @edit="visit('compounding')"
        />
    </div>
</template>
