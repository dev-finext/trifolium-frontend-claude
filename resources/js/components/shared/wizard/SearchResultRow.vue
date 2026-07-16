<script setup>
// A single result row inside the ingredient-search dropdown.
import { ref, computed } from 'vue';
import HerbName from '@/components/shared/mode/HerbName.vue';
import {
    findInteractions,
    matchedDrug,
} from '@/components/shared/wizard/wizard-lib';
import Icon from '@/components/ui/Icon.vue';
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

    return interactions.length
        ? matchedDrug(props.herb.id, props.patientMeds)
        : null;
});
// General clinical warnings for this herb (e.g. "הריון", "יתר לחץ דם").
const warnings = computed(
    () => (HERB_WARNINGS && HERB_WARNINGS[props.herb.id]) || [],
);
const pills = computed(() => {
    const p = [];

    if (drug.value) {
        p.push(`אינטראקציה עם ${drug.value}`);
    }

    warnings.value.forEach((w) => p.push(w));

    return p;
});

function onAdd(e) {
    if (e) {
        e.stopPropagation();
    }

    emit('add');
}
</script>

<template>
    <div
        dir="ltr"
        class="flex cursor-pointer items-center gap-[12px] border-b border-line px-[14px] py-[11px]"
        :class="hover ? 'bg-accent-tint' : 'bg-transparent'"
        @click="onAdd()"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Name block — Latin primary (italic), Hebrew/pinyin below (muted) -->
        <div class="min-w-0 flex-1">
            <HerbName
                :herb="herb"
                :primary-size="15"
                :secondary-size="12.5"
                :primary-weight="600"
                parallel
            />
        </div>

        <!-- Inline red warning labels — text only, no icons, no popups -->
        <div
            v-if="pills.length > 0"
            dir="rtl"
            class="flex max-w-[260px] flex-wrap justify-end gap-[5px]"
        >
            <span
                v-for="(p, i) in pills"
                :key="i"
                class="rounded-[999px] border border-[rgba(162,48,48,0.22)] bg-[rgba(162,48,48,0.08)] px-[9px] py-[2px] text-[11.5px] font-semibold whitespace-nowrap text-[#a13030]"
                >{{ p }}</span
            >
        </div>

        <!-- Green + button -->
        <button
            aria-label="הוסף רכיב"
            class="inline-flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[50%] border border-accent bg-accent text-white"
            @click="onAdd($event)"
        >
            <Icon name="plus" :size="15" :stroke="2.4" />
        </button>
    </div>
</template>
