<script setup>
// One editable shipping-address card. The primary (ברירת מחדל) card is
// highlighted with the accent tint; non-primary cards offer "make primary".
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import Icon from '@/Components/ui/Icon.vue';

const props = defineProps({
    addr: { type: Object, required: true },
    index: { type: Number, required: true },
    isPrimary: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
});

const emit = defineEmits(['change', 'make-primary', 'delete']);

// Emit a full replacement object, mirroring the prototype's `set(k)(v)`.
const set = (k) => (v) => emit('change', { ...props.addr, [k]: v });
</script>

<template>
    <div
        :style="{
            border: '1px solid ' + (isPrimary ? 'var(--accent)' : 'var(--line)'),
            borderRadius: 'var(--r-card)', padding: '16px 18px',
            background: isPrimary ? 'var(--accent-tint)' : 'var(--surface)',
            transition: 'border-color .15s, background .15s',
        }"
    >
        <!-- header: title + primary badge / actions -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px">
            <div style="display: flex; align-items: center; gap: 9px; min-width: 0">
                <Icon name="map_pin" :size="16" color="var(--accent)" />
                <span style="font-size: 14px; font-weight: 600">כתובת {{ index + 1 }}</span>
                <span
                    v-if="isPrimary"
                    :style="{
                        padding: '2px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                        background: 'var(--accent)', color: '#fff',
                    }"
                >ברירת מחדל</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0">
                <button v-if="!isPrimary" class="btn btn--ghost btn--sm" @click="$emit('make-primary')">
                    קבע כברירת מחדל
                </button>
                <button
                    v-if="canDelete"
                    class="btn btn--ghost btn--sm"
                    style="color: var(--danger); border-color: var(--line)"
                    aria-label="מחק כתובת"
                    @click="$emit('delete')"
                >
                    <Icon name="trash" :size="14" color="var(--danger)" />
                </button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px">
            <div style="grid-column: 1 / -1">
                <FieldLabel>תיאור הכתובת</FieldLabel>
                <input class="input" :value="addr.label" placeholder="לדוגמה: מרפאה, בית" @input="set('label')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel>שם המקבל/ת</FieldLabel>
                <input class="input" :value="addr.name" placeholder="שם מלא" @input="set('name')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel>רחוב ומספר</FieldLabel>
                <input class="input" :value="addr.street" placeholder="רחוב, מספר, דירה" @input="set('street')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel>עיר</FieldLabel>
                <input class="input" :value="addr.city" placeholder="עיר" @input="set('city')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel>טלפון ליצירת קשר</FieldLabel>
                <input class="input" :value="addr.phone" placeholder="טלפון" dir="ltr" style="text-align: right" @input="set('phone')($event.target.value)" />
            </div>
        </div>
    </div>
</template>
