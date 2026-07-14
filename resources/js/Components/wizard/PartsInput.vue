<script setup>
// Parts input (unified parts model) — relative ratio, integer stepper.
// Emits the new value via `change` (kept as a value payload, matching the
// source's onChange(v) contract).
import { ref, watch } from 'vue';

const props = defineProps({
    value: { type: [Number, String], default: 0 },
});
const emit = defineEmits(['change']);

const draft = ref(String(props.value ?? ''));
watch(() => props.value, (v) => { draft.value = String(v ?? ''); });

function commit(raw) {
    if (raw === '') { emit('change', ''); return; }
    const v = parseInt(raw, 10);
    if (isNaN(v)) { emit('change', ''); return; }
    emit('change', Math.max(0, v));
}
function step(d) {
    emit('change', Math.max(0, (+props.value || 0) + d));
}
function onInput(e) {
    draft.value = e.target.value;
    commit(e.target.value);
}

const btnStyle = {
    width: '28px', height: '32px',
    border: '1px solid var(--line-strong)',
    background: '#fff',
    color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-latin)',
    fontSize: '17px',
    lineHeight: 1,
    flexShrink: 0,
};
</script>

<template>
    <div style="display: inline-flex; align-items: stretch">
        <button
            type="button"
            aria-label="הפחת חלק"
            :style="{ ...btnStyle, borderRadius: 'var(--r-control) 0 0 var(--r-control)', borderRight: 'none' }"
            @click="step(-1)"
        >−</button>
        <input
            type="number"
            :min="0"
            :step="1"
            :value="draft"
            class="num no-spin"
            aria-label="מספר חלקים"
            :style="{
                width: '46px',
                height: '32px',
                border: '1px solid var(--line-strong)',
                borderRadius: 0,
                padding: 0,
                background: '#fff',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                direction: 'ltr',
                MozAppearance: 'textfield',
            }"
            @input="onInput"
            @blur="draft = String(value ?? '')"
        />
        <button
            type="button"
            aria-label="הוסף חלק"
            :style="{ ...btnStyle, borderRadius: '0 var(--r-control) var(--r-control) 0', borderLeft: 'none' }"
            @click="step(1)"
        >+</button>
    </div>
</template>
