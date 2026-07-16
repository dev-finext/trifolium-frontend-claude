<script setup>
// Patient sidebar card — initials avatar, name and phone.
import SideCard from '@/components/shared/orders/SideCard.vue';
import { initialsFromName } from '@/lib/orders';

defineProps({
    name: { type: String, default: '—' },
    phone: { type: String, default: '' },
});
</script>

<template>
    <SideCard title="מטופל">
        <div class="flex items-center gap-[12px]">
            <span
                class="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-accent-tint-strong text-[15px] font-semibold text-accent-ink"
                >{{ initialsFromName(name) }}</span
            >
            <div class="min-w-0">
                <div class="text-[15px] font-semibold">{{ name }}</div>
                <div class="small muted num text-right" dir="ltr">
                    {{ phone }}
                </div>
            </div>
        </div>
    </SideCard>
</template>
