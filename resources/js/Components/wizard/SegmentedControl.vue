<script setup>
// Inline segmented control — options can be plain strings or {value, label}.
// v-model compatible; values may be strings or booleans (YesNoToggle).
// A9: exposed as an ARIA radiogroup with roving tabindex + arrow-key nav, so
// it is keyboard-operable and its selection is announced (not colour-only).
import { computed, ref } from 'vue';

const props = defineProps({
    options: { type: Array, required: true },
    /** Currently selected value (null = nothing selected yet). */
    modelValue: { type: [String, Number, Boolean], default: null },
    /** Accessible name for the group (e.g. "סגנון טיפול"). */
    ariaLabel: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const norm = computed(() =>
    props.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
);

const btns = ref([]);
const selectedIndex = computed(() => {
    const i = norm.value.findIndex((o) => o.value === props.modelValue);
    return i; // -1 when nothing selected
});
// Roving tabindex: the selected option is the single tab stop; if none is
// selected the first option is, so the group is always reachable by Tab.
function tabindexFor(i) {
    const sel = selectedIndex.value;
    return (sel === -1 ? i === 0 : i === sel) ? 0 : -1;
}

function select(i) {
    emit('update:modelValue', norm.value[i].value);
    btns.value[i]?.focus();
}

function onKeydown(e, i) {
    const n = norm.value.length;
    // RTL: ArrowLeft advances, ArrowRight goes back; Up/Down direction-neutral.
    let next = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next !== null) {
        e.preventDefault();
        select(next);
    }
}
</script>

<template>
    <div
        role="radiogroup"
        :aria-label="ariaLabel || undefined"
        class="inline-flex h-[40px] border border-line rounded-control overflow-hidden"
    >
        <button
            v-for="(o, i) in norm"
            :key="String(o.value)"
            :ref="(el) => (btns[i] = el)"
            type="button"
            role="radio"
            :aria-checked="modelValue === o.value"
            :tabindex="tabindexFor(i)"
            class="h-full px-[18px] py-0 border-0 text-[13px] [font-family:inherit] whitespace-nowrap cursor-pointer transition-all duration-[.12s]"
            :class="[
                i === norm.length - 1 ? '' : 'border-e border-line',
                modelValue === o.value ? 'bg-inverse-surface text-inverse-ink font-medium' : 'bg-transparent text-ink-2 font-normal',
            ]"
            @click="emit('update:modelValue', o.value)"
            @keydown="onKeydown($event, i)"
        >{{ o.label }}</button>
    </div>
</template>
