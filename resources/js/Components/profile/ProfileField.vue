<script setup>
// Labeled text input for the profile editor. Extra attributes (dir, style…)
// fall through to the <input>, mirroring the prototype's `...rest` spread.
import FieldLabel from '@/Components/ui/FieldLabel.vue';

defineOptions({ inheritAttrs: false });

defineProps({
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    hint: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<template>
    <div>
        <FieldLabel>{{ label }}</FieldLabel>
        <input
            class="input"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            v-bind="$attrs"
            @input="$emit('update:modelValue', $event.target.value)"
        />
        <div v-if="hint" class="small muted" style="margin-top: 6px">{{ hint }}</div>
    </div>
</template>
