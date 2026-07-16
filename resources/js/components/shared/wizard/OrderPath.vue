<script setup>
// Step 5 — PATH A: Order confirmation (a patient was selected).
// Formula summary + pricing breakdown + safety/rx declarations, then the CTA
// adds the compounded formula to the shopping cart and navigates there.
import { computed, ref } from 'vue';
import MedsSafetyDeclaration from '@/components/shared/MedsSafetyDeclaration.vue';
import FormulaSummaryCard from '@/components/shared/wizard/FormulaSummaryCard.vue';
import PriceLine from '@/components/shared/wizard/PriceLine.vue';
import RxConfirmModal from '@/components/shared/wizard/RxConfirmModal.vue';
import { DOSE_UNIT_LABEL } from '@/components/shared/wizard/wizard-rules.js';
import Icon from '@/components/ui/Icon.vue';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';

const props = defineProps({
    formula: { type: Object, required: true },
    patientLabel: { type: String, default: null },
    patientOnMeds: { type: Boolean, default: false },
    patientMeds: { type: String, default: '' },
});

// `patch` kept for API parity (prototype passed setF); `submit` mirrors the
// prototype's onSubmit(order) success hand-off.
defineEmits(['patch', 'back', 'submit']);

const cart = useCartStore();

const ftype = computed(() =>
    FORMULA_TYPES.find((t) => t.id === props.formula.typeId),
);
const rxConfirmed = ref(false);
const showRxModal = ref(false);

// Pricing breakdown (brand rules: practitioner 20% off, patient additional 10%).
const base = computed(() =>
    Math.round(
        props.formula.ingredients.reduce((s, i) => {
            const h = HERBS.find((h) => h.id === i.herbId);

            return s + (h ? h.price * i.qty : 0);
        }, 0) + 35,
    ),
); // compounding fee
const practitionerDisc = computed(() => Math.round(base.value * 0.2));
const afterPractitioner = computed(() => base.value - practitionerDisc.value);
const patientDisc = computed(() => Math.round(afterPractitioner.value * 0.1));
const subtotal = computed(() => afterPractitioner.value - patientDisc.value);

const totalQty = computed(() =>
    props.formula.ingredients.reduce((s, i) => s + i.qty, 0),
);
const totalVol = computed(() => {
    const f = props.formula;

    if (f.typeId === 'capsule') {
        return `${f.capsuleCount * (f.capsuleMultiPacks ? 2 : 1)} כמוסות`;
    }

    if (f.typeId === 'tincture') {
        return `${f.tinctureVolume} ${ftype.value.unit}`;
    }

    return `${totalQty.value} ${ftype.value.unit}`;
});

// Build a cart line from the composed formula (add-to-cart, not order).
function buildCartItem() {
    const f = props.formula;
    const external = ['gel', 'cream', 'ioil', 'eoil'].includes(f.typeId);
    const doseUnit =
        DOSE_UNIT_LABEL(f.dose?.unit) ||
        (f.dose?.unit === 'drops' ? 'טיפות' : 'מנות');
    const tq = f.ingredients.reduce((s, x) => s + x.qty, 0);

    return {
        id: 'formula-' + Date.now(),
        kind: 'formula',
        typeId: f.typeId,
        name: f.name,
        patient: props.patientLabel || null,
        vol: totalVol.value,
        typeNote:
            f.typeId === 'tincture'
                ? f.evaporation === 'none'
                    ? 'ללא ניזוף'
                    : 'עם ניזוף'
                : '',
        route: external ? 'חיצוני' : 'פנימי',
        sample: false,
        dosage: f.dose
            ? `${f.dose.qty} ${doseUnit} · ${f.dose.perDay}× ביום`
            : '',
        pharmacyNote:
            f.internalNotes && f.internalNotes.trim()
                ? f.internalNotes.trim()
                : 'אין',
        ingredients: f.ingredients.map((row) => ({
            herbId: row.herbId,
            pct: tq ? (row.qty / tq) * 100 : 0,
        })),
        price: Math.round(subtotal.value * 100) / 100,
        qty: 1,
    };
}

// On confirm the freshly-compounded formula is added to the shopping cart
// (סל הקניות) — purchase is completed from there.
function addToCart() {
    cart.addToCart(buildCartItem());
    visit('cart');
    window.scrollTo(0, 0);
}

// TODO(backend): when checkout owns submission, persist the order here —
// build it from props.formula (id/date/patient/items) and emit 'submit'.

function onRxToggle() {
    if (!rxConfirmed.value) {
        showRxModal.value = true;
    } else {
        rxConfirmed.value = false;
    }
}
</script>

<template>
    <div class="col gap-[24px]">
        <div>
            <h2 class="m-0 mb-[6px] text-[20px] font-semibold">
                סיכום הפורמולה
            </h2>
            <p class="muted m-0 text-[14px]">
                בדקו את הפרטים והוסיפו לסל הקניות — מי משלם ואופן התשלום ייקבעו
                בסל.
            </p>
        </div>

        <div class="grid grid-cols-[1fr_360px] items-start gap-[24px]">
            <!-- Left column — formula summary -->
            <FormulaSummaryCard
                :formula="formula"
                :patient-label="patientLabel"
                :total-vol="totalVol"
            />

            <!-- Right column — pricing -->
            <div class="col gap-[16px]">
                <div class="card p-[20px]">
                    <h3 class="m-0 mb-[16px] text-[14px] font-semibold">
                        פירוט תמחור
                    </h3>

                    <PriceLine label="מחיר בסיס" :value="`₪${base}`" />
                    <PriceLine
                        label="הנחת מטפל 20%"
                        :value="`−₪${practitionerDisc}`"
                        muted
                    />
                    <PriceLine
                        label="הנחת מטופל 10%"
                        :value="`−₪${patientDisc}`"
                        muted
                    />

                    <!-- Total -->
                    <div
                        class="mt-[14px] flex items-baseline justify-between border-t border-t-ink pt-[14px]"
                    >
                        <span class="text-[13px] font-semibold text-ink-2"
                            >סה״כ</span
                        >
                        <span class="text-[28px] font-bold text-accent">
                            ₪<span class="num">{{ subtotal }}</span>
                        </span>
                    </div>
                </div>

                <!-- Pharmacy notes preview (internal) -->
                <div
                    v-if="formula.internalNotes"
                    class="overflow-hidden rounded-card border border-line bg-surface"
                >
                    <div
                        class="flex items-center gap-[8px] border-b border-b-line px-[14px] py-[10px] text-[11px] font-bold tracking-[0.06em] text-[#a87521] uppercase"
                    >
                        <span
                            class="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-[#a87521]"
                        >
                            <Icon name="alert" :size="11" color="#a87521" />
                        </span>
                        תצוגה: הנחיות לבית המרקחת
                    </div>
                    <div
                        class="px-[14px] py-[12px] text-[13px] leading-[1.55] text-ink-2"
                    >
                        {{ formula.internalNotes }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Drug-interaction safety declaration — display-only, when on meds -->
        <MedsSafetyDeclaration
            v-if="patientOnMeds"
            :patient-meds="patientMeds"
        />

        <!-- Pharmaceutical-preparation confirmation (required) -->
        <label
            class="flex cursor-pointer items-center gap-[12px] rounded-card border px-[18px] py-[16px] transition-all duration-150"
            :class="
                rxConfirmed
                    ? 'border-accent bg-accent-tint'
                    : 'border-line-strong bg-surface'
            "
            @click.prevent="onRxToggle"
        >
            <span
                class="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-all duration-150"
                :class="
                    rxConfirmed
                        ? 'border-accent bg-accent'
                        : 'border-line-strong bg-white'
                "
            >
                <Icon
                    v-if="rxConfirmed"
                    name="check"
                    :size="14"
                    color="#fff"
                    :stroke="2.6"
                />
            </span>
            <span class="text-[14px] font-semibold text-ink">
                אני מאשר/ת הכנה רוקחית
                <span class="ms-[4px] text-accent">*</span>
            </span>
        </label>

        <!-- CTA -->
        <div class="col gap-[12px]">
            <button
                class="btn btn--accent h-[48px] w-full text-[16px] font-semibold"
                :class="
                    rxConfirmed
                        ? 'cursor-pointer opacity-100'
                        : 'cursor-not-allowed opacity-45'
                "
                :disabled="!rxConfirmed"
                @click="addToCart"
            >
                <Icon name="cart" :size="18" color="#fff" /> הוסף לסל הקניות
            </button>
        </div>

        <RxConfirmModal
            v-if="showRxModal"
            @confirm="
                rxConfirmed = true;
                showRxModal = false;
            "
            @close="showRxModal = false"
        />
    </div>
</template>
