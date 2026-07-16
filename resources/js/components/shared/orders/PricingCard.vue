<script setup>
// Pricing sidebar card — base price, discounts, points and total.
import PriceRow from '@/components/shared/orders/PriceRow.vue';
import SideCard from '@/components/shared/orders/SideCard.vue';

defineProps({
    pricing: { type: Object, required: true },
});
</script>

<template>
    <SideCard title="תמחור">
        <PriceRow label="מחיר בסיס" :value="`₪${pricing.base}`" />
        <PriceRow
            label="הנחת מטפל 20%"
            :value="`−₪${pricing.practitionerDisc}`"
            muted
        />
        <PriceRow
            label="הנחת מטופל 10%"
            :value="`−₪${pricing.patientDisc}`"
            muted
        />
        <PriceRow
            v-if="pricing.pointsApplied > 0"
            label="ניצול נקודות"
            :value="`−₪${pricing.pointsApplied}`"
            accent
        />
        <div
            class="mt-[10px] flex items-baseline justify-between border-t border-t-(--ink) pt-[12px]"
        >
            <span class="text-[13px] font-semibold text-ink-2">סה״כ</span>
            <span class="text-[24px] font-bold text-accent">
                ₪<span class="num">{{ pricing.total }}</span>
            </span>
        </div>
    </SideCard>
</template>
