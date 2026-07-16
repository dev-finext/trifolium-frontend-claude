<script setup>
// Address block input — labelled input reusing the system .input field.
// readOnly → sunk, locked, non-editable (used for "ship to me").
import Icon from '@/components/ui/Icon.vue';

defineProps({
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    readOnly: { type: Boolean, default: false },
    dir: { type: String, default: undefined },
    span2: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div :class="span2 ? 'col-span-full' : 'col-auto'">
        <label class="field-label mb-[6px]">{{ label }}</label>
        <div v-if="readOnly" class="input-wrap">
            <span class="lead-icon right-auto left-[11px] text-ink-4">
                <Icon name="lock" :size="14" />
            </span>
            <input
                class="input h-[42px] pl-[34px] text-[14px] text-ink-2 bg-surface-sunk cursor-default"
                :class="dir === 'ltr' ? 'text-right' : ''"
                :value="modelValue" readonly tabindex="-1" :dir="dir"
            />
        </div>
        <input
            v-else
            class="input h-[42px] text-[14px]"
            :class="dir === 'ltr' ? 'text-right' : ''"
            :value="modelValue" :placeholder="placeholder" :dir="dir"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>
