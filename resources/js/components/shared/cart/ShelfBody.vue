<script setup>
// Shelf-product cart line. No image (the catalog uses illustrated placeholders,
// not real photography) — the product's name, form, tags and description carry
// the line on their own.
import Icon from '@/components/ui/Icon.vue';
import TypeBadge from '@/components/shared/cart/TypeBadge.vue';
import PatientLine from '@/components/shared/cart/PatientLine.vue';

defineProps({
    item: { type: Object, required: true },
});
</script>

<template>
    <div class="flex-1 min-w-0 px-[24px] py-[20px]">
        <!-- patient header + type badge -->
        <div class="flex items-start justify-between gap-[12px] flex-wrap mb-[10px]">
            <PatientLine :name="item.patient" :phone="item.phone" />
            <TypeBadge kind="shelf" />
        </div>

        <div class="flex items-baseline gap-[10px] flex-wrap">
            <h3 class="m-0 text-[19px] font-semibold">{{ item.name }}</h3>
            <span class="small muted num">{{ item.vol }}</span>
        </div>

        <div class="flex flex-wrap gap-[6px] mt-[12px]">
            <span
                v-for="(t, i) in item.tags"
                :key="i"
                class="inline-flex items-center gap-[5px] px-[10px] py-[3px] text-[12px] font-medium text-accent-ink bg-accent-tint rounded-[999px]"
            >
                <Icon name="leaf" :size="11" color="var(--accent)" /> {{ t }}
            </span>
        </div>

        <p
            class="max-w-[560px] m-0 mt-[14px] text-[13.5px] leading-[1.65] text-ink-3 text-pretty"
        >{{ item.desc }}</p>
    </div>
</template>
