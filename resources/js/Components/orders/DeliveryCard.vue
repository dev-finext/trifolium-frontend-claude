<script setup>
// Delivery sidebar card — courier method, ETA, and pickup waiver note.
import Icon from '@/Components/ui/Icon.vue';
import SideCard from '@/Components/orders/SideCard.vue';
import Row from '@/Components/orders/Row.vue';

// Declared for parity with the prototype's props; not used in render.
defineProps({
    route: { type: String, default: '' },
});
</script>

<template>
    <SideCard title="אספקה">
        <div class="col gap-12">
            <Row icon="package" label="אופן מסירה" value="שליח עד הבית" />
            <Row icon="clock" label="זמן משוער" value="2–4 ימי עסקים" />
        </div>
        <div
            :style="{
                marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--line)',
                fontSize: '12.5px', color: 'var(--ink-3)', lineHeight: 1.55,
                display: 'flex', gap: '8px',
            }"
        >
            <Icon name="info" :size="14" color="var(--ink-4)" :style="{ flexShrink: 0, marginTop: '1px' }" />
            על המטופל לחתום על טופס ייפוי כוח וויתור על ייעוץ רוקחי בעת המסירה.
        </div>
    </SideCard>
</template>
