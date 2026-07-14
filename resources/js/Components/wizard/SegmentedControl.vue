<script setup>
// Inline segmented control — options can be plain strings or {value, label}.
// v-model compatible; values may be strings or booleans (YesNoToggle).
import { computed } from 'vue';

const props = defineProps({
    options: { type: Array, required: true },
    /** Currently selected value (null = nothing selected yet). */
    modelValue: { type: [String, Number, Boolean], default: null },
});

const emit = defineEmits(['update:modelValue']);

const norm = computed(() =>
    props.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
);
</script>

<template>
    <div
        style="display: inline-flex; border: 1px solid var(--line); border-radius: var(--r-control); overflow: hidden; height: 40px"
    >
        <button
            v-for="(o, i) in norm"
            :key="String(o.value)"
            type="button"
            :style="{
                height: '100%',
                padding: '0 18px',
                border: 'none',
                borderLeft: i === norm.length - 1 ? 'none' : '1px solid var(--line)',
                background: modelValue === o.value ? 'var(--ink)' : 'transparent',
                color: modelValue === o.value ? '#fff' : 'var(--ink-2)',
                fontSize: '13px',
                fontWeight: modelValue === o.value ? 500 : 400,
                cursor: 'pointer',
                transition: 'all .12s',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
            }"
            @click="emit('update:modelValue', o.value)"
        >{{ o.label }}</button>
    </div>
</template>
