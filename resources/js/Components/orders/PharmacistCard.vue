<script setup>
// Responsible-pharmacist sidebar card (static in the prototype).
import Icon from '@/Components/ui/Icon.vue';
import SideCard from '@/Components/orders/SideCard.vue';
</script>

<template>
    <SideCard title="רוקח אחראי">
        <div style="display: flex; align-items: center; gap: 12px">
            <span
                :style="{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: 'var(--surface-sunk)', color: 'var(--accent)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }"
            >
                <Icon name="user" :size="18" />
            </span>
            <div>
                <div style="font-size: 14px; font-weight: 600">ד״ר נעמי שגב</div>
                <div class="small muted">רוקחת אחראית · בית מרקחת Trifolium</div>
            </div>
        </div>
    </SideCard>
</template>
