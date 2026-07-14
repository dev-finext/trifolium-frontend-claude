<script setup>
// Patient-picker dropdown — used when the cart holds more than one patient.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    modelValue: { type: String, default: '' },
    patients: { type: Array, required: true },
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="input-wrap">
        <span class="lead-icon" style="right: auto; left: 10px">
            <Icon name="chevron_down" :size="16" />
        </span>
        <select
            class="select"
            :value="modelValue"
            :style="{
                'appearance': 'none', '-webkit-appearance': 'none', paddingLeft: '34px',
                color: modelValue ? 'var(--ink)' : 'var(--ink-4)', cursor: 'pointer', height: '42px', fontSize: '14px',
            }"
            @change="$emit('update:modelValue', $event.target.value)"
        >
            <option value="" disabled>בחר/י מטופל/ת…</option>
            <option v-for="p in patients" :key="p.name" :value="p.name">{{ p.name }}</option>
        </select>
    </div>
</template>
