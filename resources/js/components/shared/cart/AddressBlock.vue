<script setup>
// Address block — labelled inputs reusing the system .input field.
// readOnly renders every field sunk + locked (used for "ship to me").
import AddrInput from '@/components/shared/cart/AddrInput.vue';

const props = defineProps({
    addr: { type: Object, required: true },
    readOnly: { type: Boolean, default: false },
});
const emit = defineEmits(['update']);

// Field setter — emits a fresh address object, as the prototype's onChange.
const set = (k) => (v) => emit('update', { ...props.addr, [k]: v });
</script>

<template>
    <div class="grid grid-cols-[1fr_1fr] gap-[12px]">
        <AddrInput label="שם המקבל/ת" :model-value="addr.name" placeholder="שם מלא" :read-only="readOnly" span2 @update:model-value="set('name')($event)" />
        <AddrInput label="רחוב ומספר" :model-value="addr.street" placeholder="רחוב, מספר, דירה" :read-only="readOnly" span2 @update:model-value="set('street')($event)" />
        <AddrInput label="עיר" :model-value="addr.city" placeholder="עיר" :read-only="readOnly" span2 @update:model-value="set('city')($event)" />
        <AddrInput label="טלפון" :model-value="addr.phone" placeholder="טלפון ליצירת קשר" :read-only="readOnly" dir="ltr" span2 @update:model-value="set('phone')($event)" />
    </div>
</template>
