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
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--ink)">
            <span style="font-size: 13px; color: var(--ink-2); font-weight: 600">סה״כ</span>
            <span style="font-size: 24px; font-weight: 700; color: var(--accent)">
                ₪<span class="num">{{ pricing.total }}</span>
            </span>
        </div>
    </SideCard>
</template>
