<script setup>
// Medication search & picker — searchable dropdown + removable tags.
// Suggests from a common-medications list; free-text entries can be added
// manually ("הוסף ידנית") when no exact match exists.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

const COMMON_MEDS = [
    'Cipralex',
    'Prozac',
    'Zoloft',
    'Lustral',
    'Eltroxin',
    'Coumadin',
    'Warfarin',
    'Aspirin Cardio',
    'Metformin',
    'Omeprazole',
    'Normiten',
    'Concor',
    'Acamol',
    'Advil',
    'Optalgin',
    'Dormicum',
    'Clonex',
    'Ritalin',
    'Atripla',
    'Oxycodone',
    'Tramadex',
    'Ventolin',
    'Symbicort',
    'Abilify',
    'Seroxat',
    'Lyrica',
    'Glucophage',
];

const props = defineProps({
    /** Selected medication names. */
    modelValue: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

const query = ref('');
const open = ref(false);
const wrapRef = ref(null);

// Close the dropdown on any click outside the picker.
function onDocMouseDown(e) {
    if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false;
}
onMounted(() => document.addEventListener('mousedown', onDocMouseDown));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMouseDown));

const q = computed(() => query.value.trim());
const matches = computed(() => (
    q.value
        ? COMMON_MEDS.filter((m) => m.includes(q.value) && !props.modelValue.includes(m)).slice(0, 8)
        : COMMON_MEDS.filter((m) => !props.modelValue.includes(m)).slice(0, 8)
));
const exactExists = computed(() => !!q.value && COMMON_MEDS.some((m) => m === q.value));
const showManualOption = computed(() => !!q.value && !exactExists.value && !props.modelValue.includes(q.value));

function add(med) {
    if (!med) return;
    if (!props.modelValue.includes(med)) emit('update:modelValue', [...props.modelValue, med]);
    query.value = '';
    open.value = false;
}

function remove(med) {
    emit('update:modelValue', props.modelValue.filter((m) => m !== med));
}

function onEnter(e) {
    e.preventDefault();
    if (matches.value[0]) add(matches.value[0]);
    else if (showManualOption.value) add(q.value);
}
</script>

<template>
    <div ref="wrapRef" style="position: relative">
        <!-- Search input -->
        <div class="input-wrap">
            <span class="lead-icon"><Icon name="search" :size="14" /></span>
            <input
                class="input with-icon"
                :value="query"
                placeholder="חפש תרופה..."
                @input="query = $event.target.value; open = true"
                @focus="open = true"
                @keydown.enter="onEnter"
            />
        </div>

        <!-- Dropdown -->
        <div
            v-if="open && (matches.length > 0 || showManualOption)"
            style="position: absolute; top: calc(100% + 4px); inset-inline-start: 0; inset-inline-end: 0; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-control); box-shadow: 0 12px 28px -16px rgba(20,18,14,0.28); z-index: 20; max-height: 280px; overflow: auto; padding: 4px"
        >
            <div
                v-for="m in matches"
                :key="m"
                class="tf-medpick-option"
                style="padding: 9px 12px; border-radius: 6px; font-size: 13.5px; color: var(--ink); cursor: pointer; display: flex; align-items: center; gap: 8px"
                @click="add(m)"
            >
                <span>{{ m }}</span>
            </div>
            <div
                v-if="showManualOption"
                class="tf-medpick-manual"
                :style="{
                    padding: '9px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderTop: matches.length > 0 ? '1px solid var(--line)' : 'none',
                    marginTop: matches.length > 0 ? '4px' : 0,
                    paddingTop: matches.length > 0 ? '11px' : '9px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }"
                @click="add(q)"
            >
                <Icon name="plus" :size="13" />
                <span>הוסף ידנית: "{{ q }}"</span>
            </div>
        </div>

        <!-- Selected tags -->
        <div v-if="modelValue.length > 0" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px">
            <span
                v-for="m in modelValue"
                :key="m"
                style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 6px 5px 12px; background: var(--surface-sunk); border: 1px solid var(--line); border-radius: 999px; font-size: 12.5px; color: var(--ink)"
            >
                {{ m }}
                <button
                    type="button"
                    class="tf-medpick-remove"
                    :aria-label="`הסר ${m}`"
                    style="width: 18px; height: 18px; border: none; background: transparent; color: var(--ink-3); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; padding: 0"
                    @click="remove(m)"
                >
                    <Icon name="x" :size="11" :stroke="2.4" />
                </button>
            </span>
        </div>
    </div>
</template>

<style>
/* Hover states ported from the prototype's onMouseEnter/Leave style swaps. */
.tf-medpick-option:hover {
    background: var(--surface-sunk);
}
.tf-medpick-manual:hover {
    background: var(--accent-tint);
}
.tf-medpick-remove:hover {
    background: var(--line);
    color: var(--ink);
}
</style>
