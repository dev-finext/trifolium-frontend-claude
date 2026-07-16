<script setup>
// List row for the editable libraries (my formulas / system formulas).
import FormulaTypeIcon from '@/Components/wizard/FormulaTypeIcon.vue';

defineProps({
    f: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
defineEmits(['select']);
</script>

<template>
    <div
        class="flex items-center gap-[12px] px-[18px] py-[13px] border-b border-b-line border-s-[3px] cursor-pointer transition-[background] duration-100"
        :class="selected ? 'bg-accent-tint border-s-accent' : 'bg-transparent border-s-transparent'"
        @click="$emit('select')"
    >
        <span
            class="inline-flex items-center justify-center w-[36px] h-[36px] shrink-0 border rounded-[9px]"
            :class="selected ? 'bg-white border-accent text-accent' : 'bg-surface-sunk border-line text-ink-3'"
        >
            <FormulaTypeIcon :id="f.typeId" :size="19" color="currentColor" />
        </span>
        <div class="flex-1 min-w-0">
            <div class="text-[14px] font-bold whitespace-nowrap overflow-hidden text-ellipsis" :class="selected ? 'text-accent-ink' : 'text-ink'">{{ f.name }}</div>
            <div class="mt-[3px] text-[12px] text-ink-3 whitespace-nowrap overflow-hidden text-ellipsis">
                <span class="num">{{ f.ingredients.length }}</span> רכיבים · {{ f.summary }}
            </div>
        </div>
        <span
            class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 bg-surface border-2 rounded-[50%]"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span v-if="selected" class="w-[8px] h-[8px] rounded-[50%] bg-accent" />
        </span>
    </div>
</template>
