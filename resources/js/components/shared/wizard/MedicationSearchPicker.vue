<script setup>
// Medication search & picker — searchable dropdown + removable tags.
// Suggests from a common-medications list; free-text entries can be added
// manually ("הוסף ידנית") when no exact match exists.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Icon from '@/components/ui/Icon.vue';

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
    if (wrapRef.value && !wrapRef.value.contains(e.target)) {
        open.value = false;
    }
}
onMounted(() => document.addEventListener('mousedown', onDocMouseDown));
onBeforeUnmount(() =>
    document.removeEventListener('mousedown', onDocMouseDown),
);

// Case-insensitive membership test (dedupe against already-selected meds).
const hasMed = (arr, m) => arr.some((x) => x.toLowerCase() === m.toLowerCase());

const q = computed(() => query.value.trim());
// Match case-insensitively (lowercase both sides) and hide already-selected meds.
const matches = computed(() => {
    const ql = q.value.toLowerCase();

    return COMMON_MEDS.filter(
        (m) =>
            (!ql || m.toLowerCase().includes(ql)) &&
            !hasMed(props.modelValue, m),
    ).slice(0, 8);
});
const exactExists = computed(
    () =>
        !!q.value &&
        COMMON_MEDS.some((m) => m.toLowerCase() === q.value.toLowerCase()),
);
const showManualOption = computed(
    () => !!q.value && !exactExists.value && !hasMed(props.modelValue, q.value),
);

// Flat option list backing keyboard navigation + aria-activedescendant. The
// manual ("הוסף ידנית") row, when shown, is the last option.
const options = computed(() => {
    const list = matches.value.map((m) => ({ type: 'med', value: m }));

    if (showManualOption.value) {
        list.push({ type: 'manual', value: q.value });
    }

    return list;
});
const activeIndex = ref(-1);
const activeId = computed(() =>
    activeIndex.value >= 0 && activeIndex.value < options.value.length
        ? `medpick-opt-${activeIndex.value}`
        : undefined,
);
// Reset the highlighted option whenever the query or open state changes.
watch([q, open], () => {
    activeIndex.value = -1;
});

function add(med) {
    const name = (med || '').trim();

    if (!name) {
        return;
    }

    if (!hasMed(props.modelValue, name)) {
        emit('update:modelValue', [...props.modelValue, name]);
    }

    query.value = '';
    open.value = false;
    activeIndex.value = -1;
}

function remove(med) {
    emit(
        'update:modelValue',
        props.modelValue.filter((m) => m !== med),
    );
}

function onKeydown(e) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();

        if (!open.value) {
            open.value = true;

            return;
        }

        if (options.value.length) {
            activeIndex.value = (activeIndex.value + 1) % options.value.length;
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();

        if (options.value.length) {
            activeIndex.value =
                (activeIndex.value - 1 + options.value.length) %
                options.value.length;
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt =
            activeIndex.value >= 0
                ? options.value[activeIndex.value]
                : options.value[0];

        if (opt) {
            add(opt.value);
        }
    } else if (e.key === 'Escape') {
        open.value = false;
        activeIndex.value = -1;
    }
}
</script>

<template>
    <div ref="wrapRef" class="relative">
        <!-- Search input -->
        <div class="input-wrap">
            <span class="lead-icon"><Icon name="search" :size="14" /></span>
            <input
                class="input with-icon"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="medpick-listbox"
                :aria-expanded="
                    open && (matches.length > 0 || showManualOption)
                "
                :aria-activedescendant="activeId"
                :value="query"
                placeholder="חפש תרופה..."
                @input="
                    query = $event.target.value;
                    open = true;
                "
                @focus="open = true"
                @keydown="onKeydown"
            />
        </div>

        <!-- Dropdown -->
        <div
            v-if="open && (matches.length > 0 || showManualOption)"
            id="medpick-listbox"
            role="listbox"
            class="absolute start-0 end-0 top-[calc(100%+4px)] z-20 max-h-[280px] overflow-auto rounded-control border border-line bg-surface p-[4px] shadow-[0_12px_28px_-16px_rgba(20,18,14,0.28)]"
        >
            <div
                v-for="(m, i) in matches"
                :key="m"
                :id="`medpick-opt-${i}`"
                role="option"
                :aria-selected="activeIndex === i"
                class="tf-medpick-option flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[12px] py-[9px] text-[13.5px] text-ink"
                :class="{ 'is-active': activeIndex === i }"
                @click="add(m)"
                @mousemove="activeIndex = i"
            >
                <span>{{ m }}</span>
            </div>
            <div
                v-if="showManualOption"
                :id="`medpick-opt-${matches.length}`"
                role="option"
                :aria-selected="activeIndex === matches.length"
                class="tf-medpick-manual flex cursor-pointer items-center gap-[8px] rounded-[6px] px-[12px] pb-[9px] text-[13px] font-medium text-accent"
                :class="[
                    { 'is-active': activeIndex === matches.length },
                    matches.length > 0
                        ? 'mt-[4px] border-t border-line pt-[11px]'
                        : 'mt-0 pt-[9px]',
                ]"
                @mousemove="activeIndex = matches.length"
                @click="add(q)"
            >
                <Icon name="plus" :size="13" />
                <span>הוסף ידנית: "{{ q }}"</span>
            </div>
        </div>

        <!-- Selected tags -->
        <div
            v-if="modelValue.length > 0"
            class="mt-[10px] flex flex-wrap gap-[8px]"
        >
            <span
                v-for="m in modelValue"
                :key="m"
                class="inline-flex items-center gap-[6px] rounded-[999px] border border-line bg-surface-sunk pt-[5px] pr-[6px] pb-[5px] pl-[12px] text-[12.5px] text-ink"
            >
                {{ m }}
                <button
                    type="button"
                    class="tf-medpick-remove inline-flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-[50%] border-none bg-transparent p-0 text-ink-3"
                    :aria-label="`הסר ${m}`"
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
.tf-medpick-option:hover,
.tf-medpick-option.is-active {
    background: var(--surface-sunk);
}
.tf-medpick-manual:hover,
.tf-medpick-manual.is-active {
    background: var(--accent-tint);
}
.tf-medpick-remove:hover {
    background: var(--line);
    color: var(--ink);
}
</style>
