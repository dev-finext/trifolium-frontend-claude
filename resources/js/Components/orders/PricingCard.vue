<script setup>
// Pricing sidebar card — base price, discounts, points and total.
import SideCard from '@/Components/orders/SideCard.vue';
import PriceRow from '@/Components/orders/PriceRow.vue';

defineProps({
    pricing: { type: Object, required: true },
});
</script>

<template>
    <SideCard title="תמחור">
        <PriceRow label="מחיר בסיס" :value="`₪${pricing.base}`" />
        <PriceRow label="הנחת מטפל 20%" :value="`−₪${pricing.practitionerDisc}`" muted />
        <PriceRow label="הנחת מטופל 10%" :value="`−₪${pricing.patientDisc}`" muted />
        <PriceRow v-if="pricing.pointsApplied > 0" label="ניצול נקודות" :value="`−₪${pricing.pointsApplied}`" accent />
        <div class="flex justify-between items-baseline mt-[10px] pt-[12px] border-t border-t-(--ink)">
            <span class="text-[13px] font-semibold text-ink-2">סה״כ</span>
            <span class="text-[24px] font-bold text-accent">
                ₪<span class="num">{{ pricing.total }}</span>
            </span>
        </div>
    </SideCard>
</template>
