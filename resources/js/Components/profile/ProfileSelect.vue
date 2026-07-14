<script setup>
// Select matching the system field — custom chevron, appearance reset.
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    options: { type: Array, required: true },
    placeholder: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div>
        <FieldLabel>{{ label }}</FieldLabel>
        <div class="input-wrap">
            <span class="lead-icon" style="right: auto; left: 10px">
                <Icon name="chevron_down" :size="16" />
            </span>
            <select
                class="select"
                :value="modelValue"
                :style="{
                    appearance: 'none', WebkitAppearance: 'none', paddingLeft: '34px',
                    color: modelValue ? 'var(--ink)' : 'var(--ink-4)', cursor: 'pointer',
                }"
                @change="$emit('update:modelValue', $event.target.value)"
            >
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
            </select>
        </div>
    </div>
</template>
