<script setup>
// List row for the classic-Chinese preset library (Latin + pinyin + hanzi).
import FormulaTypeIcon from '@/Components/wizard/FormulaTypeIcon.vue';

defineProps({
    preset: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
defineEmits(['select']);
</script>

<template>
    <div
        :style="{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '13px 18px',
            borderBottom: '1px solid var(--line)',
            cursor: 'pointer',
            background: selected ? 'var(--accent-tint)' : 'transparent',
            borderInlineStart: '3px solid ' + (selected ? 'var(--accent)' : 'transparent'),
            transition: 'background .1s',
        }"
        @click="$emit('select')"
    >
        <span
            :style="{
                width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                background: selected ? '#fff' : 'var(--surface-sunk)',
                border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
                color: selected ? 'var(--accent)' : 'var(--ink-3)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <FormulaTypeIcon :id="preset.typeId" :size="19" color="currentColor" />
        </span>
        <div style="flex: 1; min-width: 0">
            <div style="display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap">
                <span :style="{ fontSize: '14px', fontWeight: 700, color: selected ? 'var(--accent-ink)' : 'var(--ink)', fontFamily: 'var(--font-latin)' }">{{ preset.nameEn }}</span>
                <span style="font-size: 11.5px; font-style: italic; color: var(--ink-3); font-family: var(--font-latin)">{{ preset.namePinyin }}</span>
            </div>
            <div style="font-size: 12px; color: var(--ink-3); margin-top: 3px; display: flex; align-items: center; gap: 7px">
                <span style="font-size: 14px; font-family: serif; color: var(--ink-2)">{{ preset.nameZh }}</span>
                <span>·</span>
                <span class="num">{{ preset.ingredients.length }}</span> רכיבים
            </div>
        </div>
        <span
            :style="{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                border: '2px solid ' + (selected ? 'var(--accent)' : 'var(--line-strong)'),
                background: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <span v-if="selected" style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent)" />
        </span>
    </div>
</template>
