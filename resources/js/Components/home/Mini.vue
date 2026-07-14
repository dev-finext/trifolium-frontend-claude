<script setup>
// Tiny label/value pair used inside the reorder sheet summary card.
// The prototype passed `value` as JSX; here the value is the default slot.
defineProps({
    label: { type: String, required: true },
});
</script>

<template>
    <div>
        <div class="field-label" style="margin-bottom: 4px">{{ label }}</div>
        <div style="font-size: 13px"><slot /></div>
    </div>
</template>
