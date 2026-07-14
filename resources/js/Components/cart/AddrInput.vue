<script setup>
// Address block input — labelled input reusing the system .input field.
// readOnly → sunk, locked, non-editable (used for "ship to me").
import Icon from '@/Components/ui/Icon.vue';

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
    <div :style="{ gridColumn: span2 ? '1 / -1' : 'auto' }">
        <label class="field-label" style="margin-bottom: 6px">{{ label }}</label>
        <div v-if="readOnly" class="input-wrap">
            <span class="lead-icon" style="right: auto; left: 11px; color: var(--ink-4)">
                <Icon name="lock" :size="14" />
            </span>
            <input
                class="input" :value="modelValue" readonly tabindex="-1" :dir="dir"
                :style="{
                    background: 'var(--surface-sunk)', color: 'var(--ink-2)',
                    cursor: 'default', paddingLeft: '34px', height: '42px', fontSize: '14px',
                    ...(dir === 'ltr' ? { textAlign: 'right' } : {}),
                }"
            />
        </div>
        <input
            v-else
            class="input" :value="modelValue" :placeholder="placeholder" :dir="dir"
            :style="{ height: '42px', fontSize: '14px', ...(dir === 'ltr' ? { textAlign: 'right' } : {}) }"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>
