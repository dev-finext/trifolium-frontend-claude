<script setup>
// Price rail (shared left column of every cart card).
import { computed } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import QtyStepper from '@/components/shared/cart/QtyStepper.vue';
import { fmt } from '@/components/shared/cart/fmt';

const props = defineProps({
    item: { type: Object, required: true },
    /** Formula lines get an edit button (back to the compounding wizard). */
    editable: { type: Boolean, default: false },
});
const emit = defineEmits(['qty', 'remove', 'edit', 'hold']);

const lineTotal = computed(() => props.item.price * props.item.qty);
</script>

<template>
    <div
        class="price-rail flex flex-col gap-[14px] w-[210px] shrink-0 px-[22px] py-[22px] border-e border-line"
    >
        <div>
            <div class="num small muted text-[12.5px]">
                ₪{{ fmt(item.price) }} × {{ item.qty }}
            </div>
            <div class="num mt-[2px] text-[22px] font-bold text-ink">
                ₪{{ fmt(lineTotal) }}
            </div>
        </div>

        <div>
            <div class="field-label mb-[7px]">כמות יחידות</div>
            <QtyStepper :qty="item.qty" @change="(q) => emit('qty', q)" />
        </div>

        <div class="flex gap-[8px] flex-wrap">
            <button v-if="editable" class="btn btn--ghost btn--sm flex-1" @click="emit('edit')">
                <Icon name="edit" :size="13" /> עריכה
            </button>
            <button
                class="btn btn--ghost btn--sm flex-1 text-danger border-line"
                @click="emit('remove')"
            >
                <Icon name="x" :size="13" color="var(--danger)" /> הסר
            </button>
        </div>

        <button
            class="btn btn--ghost btn--sm w-full justify-center gap-[7px] text-ink-3"
            @click="emit('hold')"
        >
            <Icon name="clock" :size="13" color="var(--ink-3)" /> העבר להזמנות בהמתנה
        </button>
    </div>
</template>
