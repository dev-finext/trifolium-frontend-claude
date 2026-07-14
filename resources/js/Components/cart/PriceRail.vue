<script setup>
// Price rail (shared left column of every cart card).
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import QtyStepper from '@/Components/cart/QtyStepper.vue';
import { fmt } from '@/Components/cart/fmt';

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
        :style="{
            width: '210px', flexShrink: 0,
            padding: '22px 22px',
            display: 'flex', flexDirection: 'column', gap: '14px',
            borderInlineEnd: '1px solid var(--line)',
        }"
    >
        <div>
            <div class="num small muted" style="font-size: 12.5px">
                ₪{{ fmt(item.price) }} × {{ item.qty }}
            </div>
            <div class="num" style="font-size: 22px; font-weight: 700; color: var(--ink); margin-top: 2px">
                ₪{{ fmt(lineTotal) }}
            </div>
        </div>

        <div>
            <div class="field-label" style="margin-bottom: 7px">כמות יחידות</div>
            <QtyStepper :qty="item.qty" @change="(q) => emit('qty', q)" />
        </div>

        <div style="display: flex; gap: 8px; flex-wrap: wrap">
            <button v-if="editable" class="btn btn--ghost btn--sm" style="flex: 1" @click="emit('edit')">
                <Icon name="edit" :size="13" /> עריכה
            </button>
            <button
                class="btn btn--ghost btn--sm"
                style="flex: 1; color: var(--danger); border-color: var(--line)"
                @click="emit('remove')"
            >
                <Icon name="x" :size="13" color="var(--danger)" /> הסר
            </button>
        </div>

        <button
            class="btn btn--ghost btn--sm"
            style="width: 100%; color: var(--ink-3); justify-content: center; gap: 7px"
            @click="emit('hold')"
        >
            <Icon name="clock" :size="13" color="var(--ink-3)" /> העבר להזמנות בהמתנה
        </button>
    </div>
</template>
