<script setup>
// One row inside the saved-formula picker — type icon, name/summary, radio and
// an inline delete-confirm affordance.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FormulaTypeIcon from '@/Components/wizard/FormulaTypeIcon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    saved: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    confirmingDelete: { type: Boolean, default: false },
});
const emit = defineEmits(['select', 'double-pick', 'request-delete', 'cancel-delete', 'confirm-delete']);

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.saved.typeId));
const itemCount = computed(() => props.saved.ingredients.length);
</script>

<template>
    <div
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
            background: selected ? 'var(--accent-tint)' : 'var(--surface)',
            borderRadius: 'var(--r-card)',
            cursor: 'pointer',
            transition: 'background-color .12s ease, border-color .12s ease',
            boxShadow: selected ? 'inset 0 0 0 1px var(--accent)' : 'none',
        }"
        @click="emit('select')"
        @dblclick="emit('double-pick')"
    >
        <!-- Type icon -->
        <span
            :style="{
                width: '42px', height: '42px',
                borderRadius: '10px',
                background: selected ? '#fff' : 'var(--surface-sunk)',
                border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
                color: selected ? 'var(--accent)' : 'var(--ink-2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }"
        >
            <FormulaTypeIcon :id="saved.typeId" :size="22" color="currentColor" />
        </span>

        <!-- Main info -->
        <div style="flex: 1; min-width: 0">
            <div :style="{ fontSize: '14.5px', fontWeight: selected ? 700 : 600, color: selected ? 'var(--accent-ink)' : 'var(--ink)', marginBottom: '3px' }">{{ saved.name }}</div>
            <div style="font-size: 12.5px; color: var(--ink-3); line-height: 1.45; text-wrap: pretty">{{ saved.summary }}</div>
            <div style="display: flex; gap: 12px; margin-top: 6px; font-size: 11.5px; color: var(--ink-3); flex-wrap: wrap">
                <span><Icon name="flask" :size="11" />&nbsp;{{ ftype?.heb }}</span>
                <span>·</span>
                <span><span class="num">{{ itemCount }}</span> רכיבים</span>
            </div>
        </div>

        <!-- Radio -->
        <span
            :style="{
                width: '20px', height: '20px',
                borderRadius: '50%',
                border: '2px solid ' + (selected ? 'var(--accent)' : 'var(--line-strong)'),
                background: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }"
        >
            <span v-if="selected" style="width: 9px; height: 9px; border-radius: 50%; background: var(--accent)" />
        </span>

        <!-- Delete -->
        <div v-if="confirmingDelete" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0" @click.stop>
            <button
                title="אישור מחיקה"
                style="height: 30px; padding-inline: 12px; border-radius: 8px; border: 1px solid var(--danger, #c0392b); background: var(--danger, #c0392b); color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap"
                @click.stop="emit('confirm-delete')"
            >מחק</button>
            <button
                title="ביטול"
                style="height: 30px; padding-inline: 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--ink-2); font-size: 12.5px; font-weight: 600; cursor: pointer; white-space: nowrap"
                @click.stop="emit('cancel-delete')"
            >בטל</button>
        </div>
        <button
            v-else
            title="מחק פורמולה"
            aria-label="מחק פורמולה"
            class="saved-formula__del"
            style="width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--ink-3); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: color .12s ease, border-color .12s ease, background-color .12s ease"
            @click.stop="emit('request-delete')"
        >
            <Icon name="trash" :size="15" />
        </button>
    </div>
</template>
