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
        class="flex items-center gap-[12px] px-[14px] py-[11px] border-b border-line cursor-pointer"
        :class="hover ? 'bg-accent-tint' : 'bg-transparent'"
        @click="onAdd()"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Name block — Latin primary (italic), Hebrew/pinyin below (muted) -->
        <div class="flex-1 min-w-0">
            <HerbName :herb="herb" :primary-size="15" :secondary-size="12.5" :primary-weight="600" parallel />
        </div>

        <!-- Inline red warning labels — text only, no icons, no popups -->
        <div v-if="pills.length > 0" dir="rtl" class="flex flex-wrap justify-end gap-[5px] max-w-[260px]">
            <span
                v-for="(p, i) in pills" :key="i"
                class="px-[9px] py-[2px] text-[11.5px] font-semibold whitespace-nowrap text-[#a13030] bg-[rgba(162,48,48,0.08)] border border-[rgba(162,48,48,0.22)] rounded-[999px]"
            >{{ p }}</span>
        </div>

        <!-- Green + button -->
        <button
            aria-label="הוסף רכיב"
            class="inline-flex items-center justify-center w-[30px] h-[30px] shrink-0 text-white bg-accent border border-accent rounded-[50%] cursor-pointer"
            @click="onAdd($event)"
        >
            <Icon name="plus" :size="15" :stroke="2.4" />
        </button>
    </div>
</template>
