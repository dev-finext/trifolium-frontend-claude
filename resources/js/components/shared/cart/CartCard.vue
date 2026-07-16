<script setup>
// One cart line — body + price rail.
import { visit } from '@/lib/routes';
import ShelfBody from '@/components/shared/cart/ShelfBody.vue';
import FormulaBody from '@/components/shared/cart/FormulaBody.vue';
import PriceRail from '@/components/shared/cart/PriceRail.vue';

defineProps({
    item: { type: Object, required: true },
});
const emit = defineEmits(['qty', 'remove', 'hold']);
</script>

<template>
    <div class="card cart-card flex items-stretch flex-wrap">
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
