<script setup>
// Responsible-pharmacist sidebar card (static in the prototype).
import SideCard from '@/components/shared/orders/SideCard.vue';
import Icon from '@/components/ui/Icon.vue';
</script>

<template>
    <SideCard title="רוקח אחראי">
        <div class="flex items-center gap-[12px]">
            <span
                class="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-surface-sunk text-accent"
            >
                <Icon name="user" :size="18" />
            </span>
            <div>
                <div class="text-[14px] font-semibold">ד״ר נעמי שגב</div>
                <div class="small muted">
                    רוקחת אחראית · בית מרקחת Trifolium
                </div>
            </div>
        </div>
    </SideCard>
</template>
