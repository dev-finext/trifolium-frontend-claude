<script setup>
// Patient-picker dropdown — used when the cart holds more than one patient.
import Icon from '@/components/ui/Icon.vue';

defineProps({
    modelValue: { type: String, default: '' },
    patients: { type: Array, required: true },
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="input-wrap">
        <span class="lead-icon right-auto left-[10px]">
            <Icon name="chevron_down" :size="16" />
        </span>
        <select
            class="select h-[42px] cursor-pointer appearance-none pl-[34px] text-[14px]"
            :class="modelValue ? 'text-ink' : 'text-ink-4'"
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
        >
            <option value="" disabled>בחר/י מטופל/ת…</option>
            <option v-for="p in patients" :key="p.name" :value="p.name">
                {{ p.name }}
            </option>
        </select>
    </div>
</template>
