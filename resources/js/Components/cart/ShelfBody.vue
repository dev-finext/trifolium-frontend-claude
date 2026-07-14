<script setup>
// Shelf-product card body.
import Icon from '@/Components/ui/Icon.vue';
import { ProductIllustration } from '@/Components/art';
import TypeBadge from '@/Components/cart/TypeBadge.vue';
import PatientLine from '@/Components/cart/PatientLine.vue';

defineProps({
    item: { type: Object, required: true },
});
</script>

<template>
    <div style="flex: 1; padding: 24px; display: flex; gap: 22px; align-items: flex-start">
        <!-- product image -->
        <div
            :style="{
                width: '124px', height: '132px', flexShrink: 0,
                borderRadius: 'var(--r-card)', overflow: 'hidden',
                border: '1px solid var(--line)',
            }"
        >
            <ProductIllustration :heb="item.name" />
        </div>

        <!-- text -->
        <div style="flex: 1; min-width: 0">
            <!-- patient header + type badge -->
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 12px">
                <PatientLine :name="item.patient" :phone="item.phone" />
                <TypeBadge kind="shelf" />
            </div>

            <div style="display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap">
                <h3 style="margin: 0; font-size: 19px; font-weight: 600">{{ item.name }}</h3>
                <span class="small muted">{{ item.vol }}</span>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px">
                <span
                    v-for="(t, i) in item.tags"
                    :key="i"
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 10px', borderRadius: '999px',
                        background: 'var(--accent-tint)', color: 'var(--accent-ink)',
                        fontSize: '12px', fontWeight: 500,
                    }"
                >
                    <Icon name="leaf" :size="11" color="var(--accent)" /> {{ t }}
                </span>
            </div>

            <p
                :style="{
                    margin: '14px 0 0', fontSize: '13.5px', lineHeight: 1.65,
                    color: 'var(--ink-3)', textWrap: 'pretty', maxWidth: '520px',
                }"
            >{{ item.desc }}</p>
        </div>
    </div>
</template>
