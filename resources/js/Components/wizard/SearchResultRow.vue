<script setup>
// A single result row inside the ingredient-search dropdown.
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import HerbName from '@/Components/mode/HerbName.vue';
import { findInteractions, matchedDrug } from '@/Components/wizard/wizard-lib';
import { HERB_WARNINGS } from '@/data/mock';

const props = defineProps({
    herb: { type: Object, required: true },
    patientMeds: { type: String, default: '' },
});
const emit = defineEmits(['add']);

const hover = ref(false);
// Patient-relevant interaction label (e.g. "אינטראקציה עם Eltroxin").
const drug = computed(() => {
    const interactions = findInteractions(props.herb.id, props.patientMeds);
    return interactions.length ? matchedDrug(props.herb.id, props.patientMeds) : null;
});
// General clinical warnings for this herb (e.g. "הריון", "יתר לחץ דם").
const warnings = computed(() => (HERB_WARNINGS && HERB_WARNINGS[props.herb.id]) || []);
const pills = computed(() => {
    const p = [];
    if (drug.value) p.push(`אינטראקציה עם ${drug.value}`);
    warnings.value.forEach((w) => p.push(w));
    return p;
});

function onAdd(e) {
    if (e) e.stopPropagation();
    emit('add');
}
</script>

<template>
    <div
        dir="ltr"
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '11px 14px',
            borderBottom: '1px solid var(--line)',
            cursor: 'pointer',
            background: hover ? 'var(--accent-tint)' : 'transparent',
        }"
        @click="onAdd()"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Name block — Latin primary (italic), Hebrew/pinyin below (muted) -->
        <div style="flex: 1; min-width: 0">
            <HerbName :herb="herb" :primary-size="15" :secondary-size="12.5" :primary-weight="600" parallel />
        </div>

        <!-- Inline red warning labels — text only, no icons, no popups -->
        <div v-if="pills.length > 0" dir="rtl" style="display: flex; flex-wrap: wrap; gap: 5px; justify-content: flex-end; max-width: 260px">
            <span
                v-for="(p, i) in pills" :key="i"
                style="font-size: 11.5px; font-weight: 600; color: #a13030; background: rgba(162, 48, 48, 0.08); border: 1px solid rgba(162, 48, 48, 0.22); border-radius: 999px; padding: 2px 9px; white-space: nowrap"
            >{{ p }}</span>
        </div>

        <!-- Green + button -->
        <button
            aria-label="הוסף רכיב"
            style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--accent); background: var(--accent); color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0"
            @click="onAdd($event)"
        >
            <Icon name="plus" :size="15" :stroke="2.4" />
        </button>
    </div>
</template>
