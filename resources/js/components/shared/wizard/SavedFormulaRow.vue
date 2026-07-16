<script setup>
// One row inside the saved-formula picker — type icon, name/summary, radio and
// an inline delete-confirm affordance.
import { computed } from 'vue';
import FormulaTypeIcon from '@/components/shared/wizard/FormulaTypeIcon.vue';
import Icon from '@/components/ui/Icon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    saved: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    confirmingDelete: { type: Boolean, default: false },
});
const emit = defineEmits([
    'select',
    'double-pick',
    'request-delete',
    'cancel-delete',
    'confirm-delete',
]);

const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === props.saved.typeId),
);
const itemCount = computed(() => props.saved.ingredients.length);
</script>

<template>
    <div
        class="flex cursor-pointer items-center gap-[14px] rounded-card border px-[16px] py-[14px] transition-[background-color,border-color] duration-[120ms] ease-[ease]"
        :class="
            selected
                ? 'border-accent bg-accent-tint shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-surface shadow-none'
        "
        @click="emit('select')"
        @dblclick="emit('double-pick')"
    >
        <!-- Type icon -->
        <span
            class="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border"
            :class="
                selected
                    ? 'border-accent bg-white text-accent'
                    : 'border-line bg-surface-sunk text-ink-2'
            "
        >
            <FormulaTypeIcon
                :id="saved.typeId"
                :size="22"
                color="currentColor"
            />
        </span>

        <!-- Main info -->
        <div class="min-w-0 flex-1">
            <div
                class="mb-[3px] text-[14.5px]"
                :class="
                    selected
                        ? 'font-bold text-accent-ink'
                        : 'font-semibold text-ink'
                "
            >
                {{ saved.name }}
            </div>
            <div class="text-[12.5px] leading-[1.45] text-pretty text-ink-3">
                {{ saved.summary }}
            </div>
            <div
                class="mt-[6px] flex flex-wrap gap-[12px] text-[11.5px] text-ink-3"
            >
                <span
                    ><Icon name="flask" :size="11" />&nbsp;{{
                        ftype?.heb
                    }}</span
                >
                <span>·</span>
                <span
                    ><span class="num">{{ itemCount }}</span> רכיבים</span
                >
            </div>
        </div>

        <!-- Radio -->
        <span
            class="inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[50%] border-2 bg-surface"
            :class="selected ? 'border-accent' : 'border-line-strong'"
        >
            <span
                v-if="selected"
                class="h-[9px] w-[9px] rounded-[50%] bg-accent"
            />
        </span>

        <!-- Delete -->
        <div
            v-if="confirmingDelete"
            class="flex shrink-0 items-center gap-[6px]"
            @click.stop
        >
            <button
                title="אישור מחיקה"
                class="h-[30px] cursor-pointer rounded-[8px] border border-[var(--danger,#c0392b)] bg-[var(--danger,#c0392b)] px-[12px] text-[12.5px] font-semibold whitespace-nowrap text-white"
                @click.stop="emit('confirm-delete')"
            >
                מחק
            </button>
            <button
                title="ביטול"
                class="h-[30px] cursor-pointer rounded-[8px] border border-line bg-surface px-[12px] text-[12.5px] font-semibold whitespace-nowrap text-ink-2"
                @click.stop="emit('cancel-delete')"
            >
                בטל
            </button>
        </div>
        <button
            v-else
            title="מחק פורמולה"
            aria-label="מחק פורמולה"
            class="saved-formula__del inline-flex h-[32px] w-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-line bg-surface text-ink-3 transition-[color,border-color,background-color] duration-[120ms] ease-[ease]"
            @click.stop="emit('request-delete')"
        >
            <Icon name="trash" :size="15" />
        </button>
    </div>
</template>
