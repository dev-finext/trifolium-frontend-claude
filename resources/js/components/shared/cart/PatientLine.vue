<script setup>
// Patient attribution row — every order is tied to a specific patient.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    name: { type: String, required: true },
    phone: { type: String, default: '' },
});
</script>

<template>
    <div>
        <div class="flex items-center gap-[7px]">
            <Icon name="user" :size="15" color="var(--accent)" />
            <span class="text-[16px] font-semibold">{{ name }}</span>
        </div>
        <div v-if="phone" class="small muted num mt-[2px] text-right" dir="ltr">
            {{ phone }}
        </div>
    </div>
</template>
