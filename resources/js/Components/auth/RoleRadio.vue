<script setup>
// Radio pill group (role selector: student / therapist).
defineProps({
    modelValue: { type: String, default: null },
    options: { type: Array, required: true }, // [{ id, label }]
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div :style="{ display: 'flex', gap: '12px', flexWrap: 'wrap' }">
        <label
            v-for="o in options" :key="o.id"
            :style="{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '11px 18px', borderRadius: 'var(--r-control)',
                border: '1.5px solid ' + (modelValue === o.id ? 'var(--accent)' : 'var(--line-strong)'),
                background: modelValue === o.id ? 'var(--accent-tint)' : 'var(--surface)',
                cursor: 'pointer', transition: 'all .15s', userSelect: 'none',
            }"
            @click="emit('update:modelValue', o.id)"
        >
            <span
                :style="{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: '1.5px solid ' + (modelValue === o.id ? 'var(--accent)' : 'var(--line-strong)'),
                    background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }"
            >
                <span
                    v-if="modelValue === o.id"
                    :style="{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--accent)' }"
                />
            </span>
            <span :style="{ fontSize: '15.5px', fontWeight: modelValue === o.id ? 600 : 500, color: 'var(--ink)' }">{{ o.label }}</span>
        </label>
    </div>
</template>
