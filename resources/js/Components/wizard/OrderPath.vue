<script setup>
// Step 5 — PATH A: Order confirmation (a patient was selected).
// Formula summary + pricing breakdown + safety/rx declarations, then the CTA
// adds the compounded formula to the shopping cart and navigates there.
import { computed, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import MedsSafetyDeclaration from '@/Components/ui/MedsSafetyDeclaration.vue';
import FormulaSummaryCard from '@/Components/wizard/FormulaSummaryCard.vue';
import PriceLine from '@/Components/wizard/PriceLine.vue';
import RxConfirmModal from '@/Components/wizard/RxConfirmModal.vue';
import { DOSE_UNIT_LABEL } from '@/Components/wizard/wizard-rules.js';
import { FORMULA_TYPES, HERBS } from '@/data/mock';
import { useCartStore } from '@/stores/cart';
import { visit } from '@/lib/routes';

const props = defineProps({
    formula: { type: Object, required: true },
    patientLabel: { type: String, default: null },
    patientOnMeds: { type: Boolean, default: false },
    patientMeds: { type: String, default: '' },
});

// `patch` kept for API parity (prototype passed setF); `submit` mirrors the
// prototype's onSubmit(order) success hand-off.
const emit = defineEmits(['patch', 'back', 'submit']);

const cart = useCartStore();

const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
const rxConfirmed = ref(false);
const showRxModal = ref(false);

// Pricing breakdown (brand rules: practitioner 20% off, patient additional 10%).
const base = computed(() => Math.round(props.formula.ingredients.reduce((s, i) => {
    const h = HERBS.find((h) => h.id === i.herbId);
    return s + (h ? h.price * i.qty : 0);
}, 0) + 35)); // compounding fee
const practitionerDisc = computed(() => Math.round(base.value * 0.20));
const afterPractitioner = computed(() => base.value - practitionerDisc.value);
const patientDisc = computed(() => Math.round(afterPractitioner.value * 0.10));
const subtotal = computed(() => afterPractitioner.value - patientDisc.value);
const pointsAvailable = 124; // value of 1240 points
const pointsApplied = computed(() => (props.formula.usePoints ? Math.min(pointsAvailable, subtotal.value) : 0));
const total = computed(() => subtotal.value - pointsApplied.value);

const totalQty = computed(() => props.formula.ingredients.reduce((s, i) => s + i.qty, 0));
const totalVol = computed(() => {
    const f = props.formula;
    if (f.typeId === 'capsule') return `${f.capsuleCount * (f.capsuleMultiPacks ? 2 : 1)} כמוסות`;
    if (f.typeId === 'tincture') return `${f.tinctureVolume} ${ftype.value.unit}`;
    return `${totalQty.value} ${ftype.value.unit}`;
});

function buildOrder() {
    const f = props.formula;
    return {
        id: 'TF-' + (2850 + Math.floor(Math.random() * 9)),
        date: 'היום, ' + new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        paymentRoute: f.paymentRoute,
        status: f.paymentRoute === 'patient' ? 'ממתין לתשלום' : 'התקבל — ממתין למעבדה',
        patientLabel: props.patientLabel,
        formula: {
            name: f.name,
            typeId: f.typeId,
            typeHeb: ftype.value.heb,
            unit: ftype.value.unit,
            totalVol: totalVol.value,
            ingredients: f.ingredients.map((row) => {
                const h = HERBS.find((h) => h.id === row.herbId);
                const tq = f.ingredients.reduce((s, x) => s + x.qty, 0);
                return { heb: h.heb, lat: h.lat, qty: row.qty, pct: tq ? (row.qty / tq) * 100 : 0 };
            }),
            externalNotes: f.externalNotes,
            internalNotes: f.internalNotes,
        },
        pricing: {
            base: base.value,
            practitionerDisc: practitionerDisc.value,
            patientDisc: patientDisc.value,
            pointsApplied: pointsApplied.value,
            subtotal: subtotal.value,
            total: total.value,
        },
    };
}

// Build a cart line from the composed formula (add-to-cart, not order).
function buildCartItem() {
    const f = props.formula;
    const external = ['gel', 'cream', 'ioil', 'eoil'].includes(f.typeId);
    const doseUnit = DOSE_UNIT_LABEL(f.dose?.unit) || (f.dose?.unit === 'drops' ? 'טיפות' : 'מנות');
    const tq = f.ingredients.reduce((s, x) => s + x.qty, 0);
    return {
        id: 'formula-' + Date.now(),
        kind: 'formula',
        typeId: f.typeId,
        name: f.name,
        patient: props.patientLabel || null,
        vol: totalVol.value,
        typeNote: f.typeId === 'tincture'
            ? (f.evaporation === 'none' ? 'ללא ניזוף' : 'עם ניזוף')
            : '',
        route: external ? 'חיצוני' : 'פנימי',
        sample: false,
        dosage: f.dose ? `${f.dose.qty} ${doseUnit} · ${f.dose.perDay}× ביום` : '',
        pharmacyNote: (f.internalNotes && f.internalNotes.trim()) ? f.internalNotes.trim() : 'אין',
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

// Retained for parity with the prototype (defined but not wired to the CTA):
// the order flow completes from the cart, so no success screen is shown here.
// TODO(backend): persist the order when the checkout flow owns submission.
function submitOrder() {
    const order = buildOrder();
    cart.addToCart({ ...buildCartItem(), orderId: order.id });
    emit('submit', order);
}

function onRxToggle() {
    if (!rxConfirmed.value) showRxModal.value = true;
    else rxConfirmed.value = false;
}
</script>

<template>
    <div class="col gap-24">
        <div>
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 6px">סיכום הפורמולה</h2>
            <p class="muted" style="margin: 0; font-size: 14px">
                בדקו את הפרטים והוסיפו לסל הקניות — מי משלם ואופן התשלום ייקבעו בסל.
            </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: flex-start">

            <!-- Left column — formula summary -->
            <FormulaSummaryCard :formula="formula" :patient-label="patientLabel" :total-vol="totalVol" />

            <!-- Right column — pricing -->
            <div class="col gap-16">
                <div class="card" style="padding: 20px">
                    <h3 style="margin: 0 0 16px; font-size: 14px; font-weight: 600">פירוט תמחור</h3>

                    <PriceLine label="מחיר בסיס" :value="`₪${base}`" />
                    <PriceLine label="הנחת מטפל 20%" :value="`−₪${practitionerDisc}`" muted />
                    <PriceLine label="הנחת מטופל 10%" :value="`−₪${patientDisc}`" muted />

                    <!-- Total -->
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--ink)">
                        <span style="font-size: 13px; color: var(--ink-2); font-weight: 600">סה״כ</span>
                        <span style="font-size: 28px; font-weight: 700; color: var(--accent)">
                            ₪<span class="num">{{ subtotal }}</span>
                        </span>
                    </div>
                </div>

                <!-- Pharmacy notes preview (internal) -->
                <div
                    v-if="formula.internalNotes"
                    style="background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-card); overflow: hidden"
                >
                    <div style="padding: 10px 14px; border-bottom: 1px solid var(--line); font-size: 11px; font-weight: 700; color: #a87521; letter-spacing: 0.06em; text-transform: uppercase; display: flex; align-items: center; gap: 8px">
                        <span style="width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid #a87521; display: inline-flex; align-items: center; justify-content: center">
                            <Icon name="alert" :size="11" color="#a87521" />
                        </span>
                        תצוגה: הנחיות לבית המרקחת
                    </div>
                    <div style="padding: 12px 14px; font-size: 13px; color: var(--ink-2); line-height: 1.55">
                        {{ formula.internalNotes }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Drug-interaction safety declaration — display-only, when on meds -->
        <MedsSafetyDeclaration v-if="patientOnMeds" :patient-meds="patientMeds" />

        <!-- Pharmaceutical-preparation confirmation (required) -->
        <label
            :style="{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 18px',
                background: rxConfirmed ? 'var(--accent-tint)' : 'var(--surface)',
                border: '1px solid ' + (rxConfirmed ? 'var(--accent)' : 'var(--line-strong)'),
                borderRadius: 'var(--r-card)',
                cursor: 'pointer',
                transition: 'all .15s',
            }"
            @click.prevent="onRxToggle"
        >
            <span
                :style="{
                    width: '22px', height: '22px', borderRadius: '6px',
                    border: '1.5px solid ' + (rxConfirmed ? 'var(--accent)' : 'var(--line-strong)'),
                    background: rxConfirmed ? 'var(--accent)' : '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all .15s',
                }"
            >
                <Icon v-if="rxConfirmed" name="check" :size="14" color="#fff" :stroke="2.6" />
            </span>
            <span style="font-size: 14px; font-weight: 600; color: var(--ink)">
                אני מאשר/ת הכנה רוקחית
                <span style="color: var(--accent); margin-inline-start: 4px">*</span>
            </span>
        </label>

        <!-- CTA -->
        <div class="col gap-12">
            <button
                class="btn btn--accent"
                :disabled="!rxConfirmed"
                :style="{
                    width: '100%', height: '48px', fontSize: '16px', fontWeight: 600,
                    opacity: rxConfirmed ? 1 : 0.45,
                    cursor: rxConfirmed ? 'pointer' : 'not-allowed',
                }"
                @click="addToCart"
            >
                <Icon name="cart" :size="18" color="#fff" /> הוסף לסל הקניות
            </button>
        </div>

        <RxConfirmModal
            v-if="showRxModal"
            @confirm="rxConfirmed = true; showRxModal = false"
            @close="showRxModal = false"
        />
    </div>
</template>
