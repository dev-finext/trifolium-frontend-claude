<script setup>
// List row for the classic-Chinese preset library (Latin + pinyin + hanzi).
import FormulaTypeIcon from '@/components/shared/wizard/FormulaTypeIcon.vue';

defineProps({
    preset: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
defineEmits(['select']);
</script>

<template>
    <div
        class="flex items-center gap-[12px] py-[13px] px-[18px] border-b border-line border-s-[3px] cursor-pointer transition-[background] duration-100"
        :class="selected ? 'bg-accent-tint border-s-accent' : 'bg-transparent border-s-transparent'"
        @click="$emit('select')"
    >
        <span
            class="inline-flex items-center justify-center w-[36px] h-[36px] shrink-0 border rounded-[9px]"
            :class="selected ? 'bg-white border-accent text-accent' : 'bg-surface-sunk border-line text-ink-3'"
        >
            <FormulaTypeIcon :id="preset.typeId" :size="19" color="currentColor" />
        </span>
        <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-[7px] flex-wrap">
                <span class="text-[14px] font-bold font-latin" :class="selected ? 'text-accent-ink' : 'text-ink'">{{ preset.nameEn }}</span>
                <span class="text-[11.5px] italic text-ink-3 font-latin">{{ preset.namePinyin }}</span>
            </div>
            <div class="flex items-center gap-[7px] mt-[3px] text-[12px] text-ink-3">
                <span class="text-[14px] [font-family:serif] text-ink-2">{{ preset.nameZh }}</span>
                <span>·</span>
                <span class="num">{{ preset.ingredients.length }}</span> רכיבים
            </div>
        </div>
        <span
            class="inline-flex items-center justify-center w-[18px] h-[18px] shrink-0 border-2 bg-surface rounded-[50%]"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span v-if="selected" class="w-[8px] h-[8px] bg-accent rounded-[50%]" />
        </span>
    </div>
</template>
