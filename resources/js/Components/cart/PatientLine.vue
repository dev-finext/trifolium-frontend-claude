<script setup>
// Patient attribution row — every order is tied to a specific patient.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    name: { type: String, required: true },
    phone: { type: String, default: '' },
});
</script>

<template>
    <div>
        <div style="display: flex; align-items: center; gap: 7px">
            <Icon name="user" :size="15" color="var(--accent)" />
            <span style="font-size: 16px; font-weight: 600">{{ name }}</span>
        </div>
        <div v-if="phone" class="small muted num" dir="ltr" style="text-align: right; margin-top: 2px">{{ phone }}</div>
    </div>
</template>
