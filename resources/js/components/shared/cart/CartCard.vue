<script setup>
// One cart line — body + price rail.
import FormulaBody from '@/components/shared/cart/FormulaBody.vue';
import PriceRail from '@/components/shared/cart/PriceRail.vue';
import ShelfBody from '@/components/shared/cart/ShelfBody.vue';
import { visit } from '@/lib/routes';

defineProps({
    item: { type: Object, required: true },
});
const emit = defineEmits(['qty', 'remove', 'hold']);
</script>

<template>
    <div class="card cart-card flex flex-wrap items-stretch">
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
