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
        class="py-[16px] px-[18px] border rounded-card transition-[border-color,background] duration-150"
        :class="isPrimary ? 'border-accent bg-accent-tint' : 'border-line bg-surface'"
    >
        <!-- header: title + primary badge / actions -->
        <div class="flex items-center justify-between gap-[12px] mb-[14px]">
            <div class="flex items-center gap-[9px] min-w-0">
                <Icon name="map_pin" :size="16" color="var(--accent)" />
                <span class="text-[14px] font-semibold">כתובת {{ index + 1 }}</span>
                <span
                    v-if="isPrimary"
                    class="py-[2px] px-[9px] text-[11px] font-bold bg-accent text-white rounded-[999px]"
                >ברירת מחדל</span>
            </div>
            <div class="flex items-center gap-[6px] shrink-0">
                <button v-if="!isPrimary" class="btn btn--ghost btn--sm" @click="$emit('make-primary')">
                    קבע כברירת מחדל
                </button>
                <button
                    v-if="canDelete"
                    class="btn btn--ghost btn--sm text-danger border-line"
                    aria-label="מחק כתובת"
                    @click="$emit('delete')"
                >
                    <Icon name="trash" :size="14" color="var(--danger)" />
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-[14px]">
            <div class="col-span-full">
                <FieldLabel :for="fid('label')">תיאור הכתובת</FieldLabel>
                <input :id="fid('label')" class="input" :value="addr.label" placeholder="לדוגמה: מרפאה, בית" @input="set('label')($event.target.value)" />
            </div>
            <div class="col-span-full">
                <FieldLabel :for="fid('name')">שם המקבל/ת</FieldLabel>
                <input :id="fid('name')" class="input" :value="addr.name" placeholder="שם מלא" autocomplete="name" @input="set('name')($event.target.value)" />
            </div>
            <div class="col-span-full">
                <FieldLabel :for="fid('street')">
                    רחוב ומספר<span aria-hidden="true" class="ms-[3px] text-danger">*</span>
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
                    :class="errs.street ? 'border-danger' : ''"
                    @input="set('street')($event.target.value)"
                />
                <ErrMsg v-if="errs.street" :id="fid('street') + '-error'" role="alert">{{ errs.street }}</ErrMsg>
            </div>
            <div class="col-span-full">
                <FieldLabel :for="fid('city')">
                    עיר<span aria-hidden="true" class="ms-[3px] text-danger">*</span>
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
                    :class="errs.city ? 'border-danger' : ''"
                    @input="set('city')($event.target.value)"
                />
                <ErrMsg v-if="errs.city" :id="fid('city') + '-error'" role="alert">{{ errs.city }}</ErrMsg>
            </div>
            <div class="col-span-full">
                <FieldLabel :for="fid('phone')">
                    טלפון ליצירת קשר<span aria-hidden="true" class="ms-[3px] text-danger">*</span>
                </FieldLabel>
                <input
                    :id="fid('phone')"
                    class="input text-right"
                    :value="addr.phone"
                    placeholder="טלפון"
                    dir="ltr"
                    inputmode="tel"
                    autocomplete="tel"
                    enterkeyhint="done"
                    aria-required="true"
                    :aria-invalid="errs.phone ? 'true' : undefined"
                    :aria-describedby="errs.phone ? fid('phone') + '-error' : undefined"
                    :class="errs.phone ? 'border-danger' : ''"
                    @input="set('phone')($event.target.value)"
                />
                <ErrMsg v-if="errs.phone" :id="fid('phone') + '-error'" role="alert">{{ errs.phone }}</ErrMsg>
            </div>
        </div>
    </div>
</template>
