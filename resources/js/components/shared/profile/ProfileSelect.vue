<script setup>
// Select matching the system field — custom chevron, appearance reset.
import FieldLabel from '@/components/ui/FieldLabel.vue';
import Icon from '@/components/ui/Icon.vue';

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
            <span class="lead-icon right-auto left-[10px]">
                <Icon name="chevron_down" :size="16" />
            </span>
            <select
                class="select cursor-pointer appearance-none pl-[34px] [-webkit-appearance:none]"
                :class="modelValue ? 'text-ink' : 'text-ink-4'"
                :value="modelValue"
                @change="$emit('update:modelValue', $event.target.value)"
            >
                <option v-if="placeholder" value="" disabled>
                    {{ placeholder }}
                </option>
                <option v-for="o in options" :key="o" :value="o">
                    {{ o }}
                </option>
            </select>
        </div>
    </div>
</template>
