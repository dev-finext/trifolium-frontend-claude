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

// Shared stepper-button classes (formerly the btnStyle inline-style object).
const btnClass = 'inline-flex items-center justify-center w-[28px] h-[32px] shrink-0 font-latin text-[17px] leading-[1] text-ink-2 bg-surface border border-line-strong cursor-pointer';
</script>

<template>
    <div class="inline-flex items-stretch">
        <button
            type="button"
            aria-label="הפחת חלק"
            :class="btnClass"
            class="border-r-0 rounded-[var(--r-control)_0_0_var(--r-control)]"
            @click="step(-1)"
        >−</button>
        <input
            type="number"
            :min="0"
            :step="1"
            :value="draft"
            class="num no-spin w-[46px] h-[32px] p-0 text-center text-[14px] font-semibold outline-none [direction:ltr] [-moz-appearance:textfield] bg-surface border border-line-strong rounded-none"
            aria-label="מספר חלקים"
            @input="onInput"
            @blur="draft = String(value ?? '')"
        />
        <button
            type="button"
            aria-label="הוסף חלק"
            :class="btnClass"
            class="border-l-0 rounded-[0_var(--r-control)_var(--r-control)_0]"
            @click="step(1)"
        >+</button>
    </div>
</template>
