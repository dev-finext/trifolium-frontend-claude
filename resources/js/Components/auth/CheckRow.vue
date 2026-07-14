<script setup>
// Checkbox row — custom square check with label slot.
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <label
        :style="{ display: 'flex', alignItems: 'center', gap: '11px', cursor: 'pointer', userSelect: 'none' }"
        @click="emit('update:modelValue', !modelValue)"
    >
        <span
            :style="{
                width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                border: '1.5px solid ' + (modelValue ? 'var(--accent)' : 'var(--line-strong)'),
                background: modelValue ? 'var(--accent)' : '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s',
            }"
        >
            <Icon v-if="modelValue" name="check" :size="13" color="#fff" :stroke="3" />
        </span>
        <span :style="{ fontSize: '15px', color: 'var(--ink)' }"><slot /></span>
    </label>
</template>
