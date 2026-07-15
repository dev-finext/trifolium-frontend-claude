<script setup>
// One editable shipping-address card. The primary (ברירת מחדל) card is
// highlighted with the accent tint; non-primary cards offer "make primary".
import { computed, inject } from 'vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';
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

// Validation errors are provided by Profile/Edit.vue, keyed by address id, and
// injected here so the parent needn't thread them through AddressesEditor.
const tfAddrErrors = inject('tfAddrErrors', null);
const errs = computed(() => (tfAddrErrors && tfAddrErrors[props.addr.id]) || {});

// Stable, unique field ids for label↔input + aria wiring.
const fid = (k) => `addr-${props.addr.id}-${k}`;
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
                <FieldLabel :for="fid('label')">תיאור הכתובת</FieldLabel>
                <input :id="fid('label')" class="input" :value="addr.label" placeholder="לדוגמה: מרפאה, בית" @input="set('label')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel :for="fid('name')">שם המקבל/ת</FieldLabel>
                <input :id="fid('name')" class="input" :value="addr.name" placeholder="שם מלא" autocomplete="name" @input="set('name')($event.target.value)" />
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel :for="fid('street')">
                    רחוב ומספר<span aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
                </FieldLabel>
                <input
                    :id="fid('street')"
                    class="input"
                    :value="addr.street"
                    placeholder="רחוב, מספר, דירה"
                    autocomplete="street-address"
                    aria-required="true"
                    :aria-invalid="errs.street ? 'true' : undefined"
                    :aria-describedby="errs.street ? fid('street') + '-error' : undefined"
                    :style="errs.street ? { borderColor: 'var(--danger)' } : undefined"
                    @input="set('street')($event.target.value)"
                />
                <ErrMsg v-if="errs.street" :id="fid('street') + '-error'" role="alert">{{ errs.street }}</ErrMsg>
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel :for="fid('city')">
                    עיר<span aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
                </FieldLabel>
                <input
                    :id="fid('city')"
                    class="input"
                    :value="addr.city"
                    placeholder="עיר"
                    autocomplete="address-level2"
                    aria-required="true"
                    :aria-invalid="errs.city ? 'true' : undefined"
                    :aria-describedby="errs.city ? fid('city') + '-error' : undefined"
                    :style="errs.city ? { borderColor: 'var(--danger)' } : undefined"
                    @input="set('city')($event.target.value)"
                />
                <ErrMsg v-if="errs.city" :id="fid('city') + '-error'" role="alert">{{ errs.city }}</ErrMsg>
            </div>
            <div style="grid-column: 1 / -1">
                <FieldLabel :for="fid('phone')">
                    טלפון ליצירת קשר<span aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
                </FieldLabel>
                <input
                    :id="fid('phone')"
                    class="input"
                    :value="addr.phone"
                    placeholder="טלפון"
                    dir="ltr"
                    inputmode="tel"
                    autocomplete="tel"
                    enterkeyhint="done"
                    aria-required="true"
                    :aria-invalid="errs.phone ? 'true' : undefined"
                    :aria-describedby="errs.phone ? fid('phone') + '-error' : undefined"
                    :style="errs.phone ? { textAlign: 'right', borderColor: 'var(--danger)' } : { textAlign: 'right' }"
                    @input="set('phone')($event.target.value)"
                />
                <ErrMsg v-if="errs.phone" :id="fid('phone') + '-error'" role="alert">{{ errs.phone }}</ErrMsg>
            </div>
        </div>
    </div>
</template>
