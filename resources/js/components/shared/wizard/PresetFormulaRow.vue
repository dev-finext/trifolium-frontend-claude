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
        class="flex cursor-pointer items-center gap-[12px] border-s-[3px] border-b border-line px-[18px] py-[13px] transition-[background] duration-100"
        :class="
            selected
                ? 'border-s-accent bg-accent-tint'
                : 'border-s-transparent bg-transparent'
        "
        @click="$emit('select')"
    >
        <span
            class="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] border"
            :class="
                selected
                    ? 'border-accent bg-white text-accent'
                    : 'border-line bg-surface-sunk text-ink-3'
            "
        >
            <FormulaTypeIcon
                :id="preset.typeId"
                :size="19"
                color="currentColor"
            />
        </span>
        <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline gap-[7px]">
                <span
                    class="font-latin text-[14px] font-bold"
                    :class="selected ? 'text-accent-ink' : 'text-ink'"
                    >{{ preset.nameEn }}</span
                >
                <span class="font-latin text-[11.5px] text-ink-3 italic">{{
                    preset.namePinyin
                }}</span>
            </div>
            <div
                class="mt-[3px] flex items-center gap-[7px] text-[12px] text-ink-3"
            >
                <span class="[font-family:serif] text-[14px] text-ink-2">{{
                    preset.nameZh
                }}</span>
                <span>·</span>
                <span class="num">{{ preset.ingredients.length }}</span> רכיבים
            </div>
        </div>
        <span
            class="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[50%] border-2 bg-surface"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span
                v-if="selected"
                class="h-[8px] w-[8px] rounded-[50%] bg-accent"
            />
        </span>
    </div>
</template>
