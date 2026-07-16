<script setup>
// One row inside the saved-formula picker — type icon, name/summary, radio and
// an inline delete-confirm affordance.
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import FormulaTypeIcon from '@/components/shared/wizard/FormulaTypeIcon.vue';
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
        class="flex items-center gap-[14px] py-[14px] px-[16px] cursor-pointer border rounded-card transition-[background-color,border-color] duration-[120ms] ease-[ease]"
        :class="selected ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]' : 'border-line bg-surface shadow-none'"
        @click="emit('select')"
        @dblclick="emit('double-pick')"
    >
        <!-- Type icon -->
        <span
            class="inline-flex items-center justify-center shrink-0 w-[42px] h-[42px] border rounded-[10px]"
            :class="selected ? 'bg-white border-accent text-accent' : 'bg-surface-sunk border-line text-ink-2'"
        >
            <FormulaTypeIcon :id="saved.typeId" :size="22" color="currentColor" />
        </span>

        <!-- Main info -->
        <div class="flex-1 min-w-0">
            <div class="mb-[3px] text-[14.5px]" :class="selected ? 'font-bold text-accent-ink' : 'font-semibold text-ink'">{{ saved.name }}</div>
            <div class="text-[12.5px] leading-[1.45] text-pretty text-ink-3">{{ saved.summary }}</div>
            <div class="flex flex-wrap gap-[12px] mt-[6px] text-[11.5px] text-ink-3">
                <span><Icon name="flask" :size="11" />&nbsp;{{ ftype?.heb }}</span>
                <span>·</span>
                <span><span class="num">{{ itemCount }}</span> רכיבים</span>
            </div>
        </div>

        <!-- Radio -->
        <span
            class="inline-flex items-center justify-center shrink-0 w-[20px] h-[20px] bg-surface border-2 rounded-[50%]"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span v-if="selected" class="w-[9px] h-[9px] rounded-[50%] bg-accent" />
        </span>

        <!-- Delete -->
        <div v-if="confirmingDelete" class="flex items-center gap-[6px] shrink-0" @click.stop>
            <button
                title="אישור מחיקה"
                class="h-[30px] px-[12px] text-[12.5px] font-semibold text-white bg-[var(--danger,#c0392b)] border border-[var(--danger,#c0392b)] rounded-[8px] cursor-pointer whitespace-nowrap"
                @click.stop="emit('confirm-delete')"
            >מחק</button>
            <button
                title="ביטול"
                class="h-[30px] px-[12px] text-[12.5px] font-semibold text-ink-2 bg-surface border border-line rounded-[8px] cursor-pointer whitespace-nowrap"
                @click.stop="emit('cancel-delete')"
            >בטל</button>
        </div>
        <button
            v-else
            title="מחק פורמולה"
            aria-label="מחק פורמולה"
            class="saved-formula__del inline-flex items-center justify-center shrink-0 w-[32px] h-[32px] text-ink-3 bg-surface border border-line rounded-[8px] cursor-pointer transition-[color,border-color,background-color] duration-[120ms] ease-[ease]"
            @click.stop="emit('request-delete')"
        >
            <Icon name="trash" :size="15" />
        </button>
    </div>
</template>
