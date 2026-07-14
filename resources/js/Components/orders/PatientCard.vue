<script setup>
// Patient sidebar card — initials avatar, name and phone.
import SideCard from '@/Components/orders/SideCard.vue';
import { initialsFromName } from '@/lib/orders';

defineProps({
    name: { type: String, default: '—' },
    phone: { type: String, default: '' },
});
</script>

<template>
    <SideCard title="מטופל">
        <div style="display: flex; align-items: center; gap: 12px">
            <span
                :style="{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'var(--accent-tint-strong)', color: 'var(--accent-ink)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', fontWeight: 600, flexShrink: 0,
                }"
            >{{ initialsFromName(name) }}</span>
            <div style="min-width: 0">
                <div style="font-size: 15px; font-weight: 600">{{ name }}</div>
                <div class="small muted num" dir="ltr" style="text-align: right">{{ phone }}</div>
            </div>
        </div>
    </SideCard>
</template>
