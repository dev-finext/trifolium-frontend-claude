<script setup>
// סל הקניות — Shopping cart. Summary of purchases awaiting payment:
// ready-made shelf products (מוצרי מדף) and custom personal formulas (פורמולות אישיות).
import { ref, computed, watch, watchEffect } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';
import { useAddresses, tfPrimaryAddress } from '@/composables/useAddresses';
import CartCard from '@/Components/cart/CartCard.vue';
import SideCard from '@/Components/cart/SideCard.vue';
import RadioRow from '@/Components/cart/RadioRow.vue';
import FieldGroupLabel from '@/Components/cart/FieldGroupLabel.vue';
import PatientSelect from '@/Components/cart/PatientSelect.vue';
import MeAddressPicker from '@/Components/cart/MeAddressPicker.vue';
import CourierAuthRow from '@/Components/cart/CourierAuthRow.vue';
import CourierPoaModal from '@/Components/cart/CourierPoaModal.vue';
import SumRow from '@/Components/cart/SumRow.vue';
import EmptyCart from '@/Components/cart/EmptyCart.vue';
import { fmt } from '@/Components/cart/fmt';

// Cart lines live in the shared store; this page edits them in place
// (qty steppers, remove, move to on-hold), mirroring the prototype's
// items/setItems ownership.
const cart = useCartStore();
const items = cart.state.items;

const ship = ref('patient');    // 'me' | 'patient' | 'pickup'
const payer = ref('me');        // 'me' | 'patient'
const benefit = ref('points');  // 'points' | 'discount'  (only when payer === 'me')

// Practitioner's saved addresses (source of truth = profile).
const addresses = useAddresses();
const meAddrId = ref(null);
// Default the "ship to me" choice to the primary address; keep it valid
// if the selected address was removed in the profile.
watchEffect(() => {
    const valid = meAddrId.value && addresses.some((a) => a.id === meAddrId.value);
    if (!valid) {
        const primary = tfPrimaryAddress(addresses);
        meAddrId.value = primary ? primary.id : null;
    }
});

// Courier power-of-attorney (ייפוי כוח לשליח) — only relevant when couriered.
const courierAuth = ref(false);
const poaOpen = ref(false);
const poaData = ref(null);

// Order placement / success popup.
// TODO(backend): the order number comes from the server once checkout posts
// the cart; this mock mirrors the prototype's client-generated number.
const placed = ref(false);
const orderNo = 'TF-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
function goToOrder() {
    placed.value = false;
    items.splice(0); // empty the cart, as the prototype's setItems([])
    // The prototype routed to the order screen with no id; here the route
    // carries the (mock) order number. TODO(backend): route to the real order.
    visit('order', { id: orderNo });
}

// Self-pickup needs no courier authorization — clear it.
watch(ship, (s) => {
    if (s === 'pickup' && (courierAuth.value || poaData.value)) {
        courierAuth.value = false;
        poaData.value = null;
    }
});
function toggleCourier() {
    if (courierAuth.value) { courierAuth.value = false; poaData.value = null; }
    else { poaOpen.value = true; }
}

// Distinct patients referenced by the formulas in this cart.
const cartPatients = computed(() => {
    const seen = new Map();
    items.forEach((it) => {
        if (it.patient && !seen.has(it.patient)) {
            seen.set(it.patient, { name: it.patient, phone: it.phone || '' });
        }
    });
    return [...seen.values()];
});
const multiPatient = computed(() => cartPatients.value.length > 1);

// Which patient the whole cart ships to (only meaningful when multiPatient).
const shipPatient = ref('');
// Which patient pays (only meaningful when payer === 'patient').
const payPatient = ref('');
// With exactly one patient in the cart, auto-select them as the payer.
watchEffect(() => {
    if (payer.value === 'patient' && !payPatient.value && cartPatients.value.length === 1) {
        payPatient.value = cartPatients.value[0].name;
    }
});
// When the patient pays, the shipping recipient is LOCKED to that same patient.
const effectivePatientName = computed(() => (
    payer.value === 'patient'
        ? payPatient.value
        : (multiPatient.value ? shipPatient.value : ((cartPatients.value[0] && cartPatients.value[0].name) || ''))
));
const activePatient = computed(() => cartPatients.value.find((p) => p.name === effectivePatientName.value) || null);

// Editable shipping address for the patient case — kept from the prototype
// (prefilled from the chosen patient; the current design collects the address
// from the patient via WhatsApp, so it is not rendered).
const patientAddr = ref({ name: '', street: '', city: '', zip: '', phone: '' });
watch([ship, () => activePatient.value && activePatient.value.name], () => {
    if (ship.value !== 'patient' || !activePatient.value) return;
    const a = patientAddr.value;
    if (a.name !== activePatient.value.name) {
        patientAddr.value = { ...a, name: activePatient.value.name, phone: a.phone || activePatient.value.phone };
    }
});

function setQty(item, q) {
    item.qty = Math.max(1, q);
}
function removeItem(item) {
    const i = items.indexOf(item);
    if (i !== -1) items.splice(i, 1);
}
// The prototype removed the line AND broadcast tf:moveToPending; the store's
// moveToPending only adds to the on-hold list, so remove the line here too.
function hold(item) {
    removeItem(item);
    cart.moveToPending(item);
}

const subtotal = computed(() => items.reduce((s, it) => s + it.price * it.qty, 0));
const shelfSubtotal = computed(() => items.filter((it) => it.kind === 'shelf').reduce((s, it) => s + it.price * it.qty, 0));
const shipping = computed(() => (
    (items.length === 0 || ship.value === 'pickup') ? 0 : (subtotal.value >= 250 ? 0 : 29)
));

// Benefit applies whoever pays:
//   • practitioner pays → discount 5% (shelf products only) OR 10% points
//   • patient pays      → discount 10% (whole order)        OR 10% points
const customerDiscount = computed(() => {
    if (benefit.value !== 'discount') return 0;
    const discountRate = payer.value === 'patient' ? 0.10 : 0.05;
    const discountBase = payer.value === 'patient' ? subtotal.value : shelfSubtotal.value;
    return discountBase * discountRate;
});
const pointsEarned = computed(() => (benefit.value === 'points' ? Math.round(subtotal.value * 0.10) : 0));

const total = computed(() => subtotal.value - customerDiscount.value + shipping.value);
const unitCount = computed(() => items.reduce((s, it) => s + it.qty, 0));

// Self-pickup collection point at the pharmacy (איסוף עצמי).
const TF_PICKUP_LOCATION = {
    name: 'בית המרקחת Trifolium',
    street: 'יגאל אלון 94, קומה 3',
    city: 'תל אביב',
    hours: 'א׳–ה׳ 9:00–18:00 · ו׳ 9:00–13:00',
    phone: '03-624-7780',
};
</script>

<template>
    <Head title="סל הקניות" />
    <div class="page">
        <div class="page__inner page__inner--wide">

            <!-- Centered header -->
            <div style="text-align: center; margin-bottom: 32px">
                <div style="display: inline-flex; align-items: center; gap: 12px; white-space: nowrap">
                    <Icon name="cart" :size="28" color="var(--accent)" :stroke="1.6" />
                    <h1 class="page-title" style="margin: 0; white-space: nowrap">סל הקניות</h1>
                </div>
                <p class="page-sub" style="margin-top: 8px">
                    <template v-if="items.length > 0">
                        סיכום הרכישות שלך · <span class="num">{{ items.length }}</span> פריטים · <span class="num">{{ unitCount }}</span> יחידות ממתינות לתשלום
                    </template>
                    <template v-else>הסל ריק כעת</template>
                </p>
            </div>

            <EmptyCart v-if="items.length === 0" />
            <div v-else style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start">

                <!-- MAIN — item list -->
                <div class="col gap-16">
                    <CartCard
                        v-for="it in items"
                        :key="it.id"
                        :item="it"
                        @qty="(q) => setQty(it, q)"
                        @remove="removeItem(it)"
                        @hold="hold(it)"
                    />
                </div>

                <!-- SIDEBAR -->
                <div class="col gap-16" style="position: sticky; top: 80px">

                    <!-- Payment — chosen first; who pays drives the shipping options -->
                    <SideCard title="פרטי תשלום">
                        <FieldGroupLabel>מבצע התשלום:</FieldGroupLabel>
                        <div style="display: flex; gap: 24px">
                            <RadioRow label="אני" :checked="payer === 'me'" @change="payer = 'me'" />
                            <RadioRow label="המטופל/ת" :checked="payer === 'patient'" @change="payer = 'patient'" />
                        </div>

                        <!-- When the practitioner pays → choose loyalty points or a customer discount -->
                        <div v-if="payer === 'me'" style="margin-top: 16px">
                            <FieldGroupLabel>לצבור נקודות או לתת הנחה ללקוח?</FieldGroupLabel>
                            <div style="display: flex; flex-direction: column; gap: 4px">
                                <RadioRow label="צבירת נקודות זכות" :checked="benefit === 'points'" @change="benefit = 'points'" />
                                <RadioRow label="הנחה ללקוח" :checked="benefit === 'discount'" @change="benefit = 'discount'" />
                            </div>
                            <div
                                :style="{
                                    marginTop: '12px', padding: '10px 12px', borderRadius: 'var(--r-control)',
                                    background: 'var(--accent-tint)', display: 'flex', gap: '8px',
                                    fontSize: '12.5px', lineHeight: 1.55, color: 'var(--accent-ink)',
                                }"
                            >
                                <Icon :name="benefit === 'points' ? 'coin' : 'sparkles'" :size="15" color="var(--accent)" :style="{ flexShrink: 0, marginTop: '1px' }" />
                                <span v-if="benefit === 'points'"><strong class="num">{{ pointsEarned }}</strong> נקודות זכות יועברו לחשבונך <span class="muted">(10%)</span>.</span>
                                <span v-else>הנחה של <strong>₪<span class="num">{{ fmt(customerDiscount) }}</span></strong> על כלל ההזמנה <span class="muted">(5% · מוצרי מדף בלבד)</span>. לא חל על פורמולות בהנחה אישית.</span>
                            </div>
                        </div>

                        <div v-if="payer === 'patient'" style="margin-top: 16px">
                            <div v-if="cartPatients.length > 0" style="margin-bottom: 14px">
                                <FieldGroupLabel>איזה מטופל/ת משלם/ת?</FieldGroupLabel>
                                <div
                                    v-if="cartPatients.length === 1"
                                    :style="{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                                        border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                                        background: 'var(--surface)', fontSize: '14px', fontWeight: 600,
                                    }"
                                >
                                    <Icon name="user" :size="15" color="var(--accent)" /> {{ cartPatients[0].name }}
                                </div>
                                <PatientSelect v-else v-model="payPatient" :patients="cartPatients" />
                            </div>

                            <FieldGroupLabel>לצבור נקודות או לתת הנחה למטופל/ת?</FieldGroupLabel>
                            <div style="display: flex; flex-direction: column; gap: 4px">
                                <RadioRow label="צבירת נקודות זכות" :checked="benefit === 'points'" @change="benefit = 'points'" />
                                <RadioRow label="הנחה למטופל/ת" :checked="benefit === 'discount'" @change="benefit = 'discount'" />
                            </div>
                            <div
                                :style="{
                                    marginTop: '12px', padding: '10px 12px', borderRadius: 'var(--r-control)',
                                    background: 'var(--accent-tint)', display: 'flex', gap: '8px',
                                    fontSize: '12.5px', lineHeight: 1.55, color: 'var(--accent-ink)',
                                }"
                            >
                                <Icon :name="benefit === 'points' ? 'coin' : 'sparkles'" :size="15" color="var(--accent)" :style="{ flexShrink: 0, marginTop: '1px' }" />
                                <span v-if="benefit === 'points'"><strong class="num">{{ pointsEarned }}</strong> נקודות זכות יצברו בחשבונך <span class="muted">(10%)</span>.</span>
                                <span v-else>הנחה של <strong>₪<span class="num">{{ fmt(customerDiscount) }}</span></strong> למטופל/ת על כלל ההזמנה <span class="muted">(10%)</span>.</span>
                            </div>
                            <div
                                :style="{
                                    marginTop: '10px', padding: '10px 12px', borderRadius: 'var(--r-control)',
                                    background: 'var(--surface-sunk)', display: 'flex', gap: '8px',
                                    fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-3)',
                                }"
                            >
                                <Icon name="whatsapp" :size="15" color="var(--ink-4)" :style="{ flexShrink: 0, marginTop: '1px' }" />
                                קישור לתשלום יישלח לוואטסאפ של המטופל/ת לאחר אישור ההזמנה.
                            </div>
                        </div>
                    </SideCard>

                    <!-- Delivery — depends on the payer chosen above -->
                    <SideCard title="משלוח">
                        <FieldGroupLabel>אופן המשלוח:</FieldGroupLabel>
                        <div style="display: flex; gap: 18px; margin-bottom: 16px; flex-wrap: wrap">
                            <RadioRow label="אליי" :checked="ship === 'me'" @change="ship = 'me'" />
                            <RadioRow label="אל המטופל/ת" :checked="ship === 'patient'" @change="ship = 'patient'" />
                            <RadioRow label="איסוף עצמי" :checked="ship === 'pickup'" @change="ship = 'pickup'" />
                        </div>

                        <!-- Ship to me → saved-address picker (defaults to primary) -->
                        <div v-if="ship === 'me'" style="margin-bottom: 16px">
                            <MeAddressPicker :addresses="addresses" :selected-id="meAddrId" @select="meAddrId = $event" />
                        </div>

                        <!-- Self pickup → pharmacy collection point -->
                        <div v-if="ship === 'pickup'" style="margin-bottom: 16px">
                            <div
                                :style="{
                                    border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                                    padding: '14px 15px', background: 'var(--surface)',
                                }"
                            >
                                <div style="display: flex; align-items: center; gap: 9px; margin-bottom: 8px">
                                    <Icon name="map_pin" :size="16" color="var(--accent)" />
                                    <span style="font-size: 14px; font-weight: 600">{{ TF_PICKUP_LOCATION.name }}</span>
                                </div>
                                <div class="small" style="color: var(--ink-2); line-height: 1.6">
                                    {{ TF_PICKUP_LOCATION.street }}, {{ TF_PICKUP_LOCATION.city }}
                                </div>
                                <div class="small muted" style="margin-top: 6px; display: flex; align-items: center; gap: 7px">
                                    <Icon name="clock" :size="13" color="var(--ink-4)" /> {{ TF_PICKUP_LOCATION.hours }}
                                </div>
                                <div class="small muted num" dir="ltr" style="margin-top: 4px; text-align: right">{{ TF_PICKUP_LOCATION.phone }}</div>
                            </div>
                            <div
                                :style="{
                                    marginTop: '10px', padding: '9px 12px', borderRadius: 'var(--r-control)',
                                    background: 'var(--surface-sunk)', display: 'flex', alignItems: 'center',
                                    gap: '8px', fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ink-3)',
                                }"
                            >
                                <Icon name="info" :size="14" color="var(--ink-4)" :style="{ flexShrink: 0 }" />
                                נודיע לך בהודעה כשההזמנה מוכנה לאיסוף.
                            </div>
                        </div>

                        <!-- Ship to patient — address entry only when the practitioner pays -->
                        <div v-if="ship === 'patient'" style="margin-bottom: 16px">
                            <div v-if="payer === 'patient' && activePatient" style="margin-bottom: 14px">
                                <FieldGroupLabel>נמען המשלוח</FieldGroupLabel>
                                <div
                                    :style="{
                                        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
                                        border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                                        background: 'var(--surface-sunk)', fontSize: '14px', fontWeight: 600,
                                    }"
                                >
                                    <Icon name="lock" :size="14" color="var(--ink-4)" /> {{ activePatient.name }}
                                </div>
                                <div class="small muted" style="margin-top: 6px; font-size: 11.5px">
                                    המשלוח נשלח למטופל/ת שמשלם/ת. לשינוי יש לעדכן את בחירת המשלם בפרטי התשלום.
                                </div>
                            </div>
                            <div v-if="payer !== 'patient' && multiPatient" style="margin-bottom: 14px">
                                <FieldGroupLabel>לאיזה מטופל/ת לשלוח את כל הסל?</FieldGroupLabel>
                                <PatientSelect v-model="shipPatient" :patients="cartPatients" />
                                <div class="small muted" style="margin-top: 6px; font-size: 11.5px">
                                    כל פריטי הסל יישלחו לכתובת אחת.
                                </div>
                            </div>
                            <div
                                v-if="payer === 'patient'"
                                :style="{
                                    padding: '11px 13px', borderRadius: 'var(--r-control)',
                                    background: 'var(--accent-tint)', display: 'flex', gap: '9px',
                                    fontSize: '12.5px', lineHeight: 1.6, color: 'var(--accent-ink)',
                                }"
                            >
                                <Icon name="whatsapp" :size="16" color="var(--accent)" :style="{ flexShrink: 0, marginTop: '1px' }" />
                                <span>המטופל/ת ימלא/ת את כתובת המשלוח בעצמו/ה — הבקשה תישלח אליו/ה יחד עם קישור לתשלום בוואטסאפ. אין צורך להזין כתובת כעת.</span>
                            </div>
                            <div
                                v-else-if="cartPatients.length === 0"
                                :style="{
                                    padding: '10px 12px', borderRadius: 'var(--r-control)',
                                    background: 'var(--surface-sunk)', fontSize: '12.5px',
                                    lineHeight: 1.5, color: 'var(--ink-3)',
                                }"
                            >
                                אין מטופל/ת משויך/ת לפריטים בסל. שייכו מטופל/ת כדי שנשלח אליו/ה קישור למילוי כתובת המשלוח.
                            </div>
                            <div
                                v-else-if="!multiPatient || shipPatient"
                                :style="{
                                    padding: '11px 13px', borderRadius: 'var(--r-control)',
                                    background: 'var(--accent-tint)', display: 'flex', gap: '9px',
                                    fontSize: '12.5px', lineHeight: 1.6, color: 'var(--accent-ink)',
                                }"
                            >
                                <Icon name="whatsapp" :size="16" color="var(--accent)" :style="{ flexShrink: 0, marginTop: '1px' }" />
                                <span>המטופל/ת ימלא/ת את כתובת המשלוח בעצמו/ה — יישלח אליו/ה קישור למילוי הכתובת. אין צורך להזין כתובת כעת.</span>
                            </div>
                        </div>

                        <!-- Courier power-of-attorney — required for any couriered delivery -->
                        <CourierAuthRow
                            v-if="ship !== 'pickup'"
                            :checked="courierAuth"
                            :signed-name="(poaData && poaData.name) || ''"
                            @toggle="toggleCourier"
                            @view="poaOpen = true"
                        />

                        <FieldGroupLabel>{{ ship === 'pickup' ? 'הערות לאיסוף:' : 'הערות למשלוח:' }}</FieldGroupLabel>
                        <textarea
                            placeholder="הערות (לא חובה)"
                            rows="3"
                            :style="{
                                width: '100%', resize: 'vertical', minHeight: '70px',
                                border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                                padding: '10px 12px', fontSize: '14px', color: 'var(--ink)',
                                background: 'var(--surface)', outline: 'none', fontFamily: 'inherit',
                            }"
                        />
                    </SideCard>

                    <!-- Summary -->
                    <div class="card" style="padding: 20px">
                        <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 600">סיכום הזמנה</h3>
                        <SumRow label="סכום ביניים" :value="`₪${fmt(subtotal)}`" />
                        <SumRow
                            v-if="customerDiscount > 0"
                            :label="payer === 'patient' ? 'הנחת מטופל/ת 10%' : 'הנחת לקוח 5% · מוצרי מדף'"
                            :value="`−₪${fmt(customerDiscount)}`"
                            accent
                        />
                        <SumRow
                            :label="ship === 'pickup' ? 'איסוף עצמי' : 'משלוח'"
                            :value="ship === 'pickup' ? 'ללא עלות' : (shipping === 0 ? 'חינם' : `₪${fmt(shipping)}`)"
                            :accent="shipping === 0"
                        />
                        <div v-if="shipping > 0" class="small muted" style="margin-top: 2px; font-size: 11.5px">
                            משלוח חינם בהזמנה מעל <span class="num">₪250</span>
                        </div>
                        <div
                            :style="{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                                marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--ink)',
                            }"
                        >
                            <span style="font-size: 14px; font-weight: 600; color: var(--ink-2)">סה״כ לתשלום</span>
                            <span style="font-size: 26px; font-weight: 700; color: var(--accent)">
                                ₪<span class="num">{{ fmt(total) }}</span>
                            </span>
                        </div>

                        <div
                            v-if="pointsEarned > 0"
                            :style="{
                                marginTop: '14px', padding: '10px 12px', borderRadius: 'var(--r-control)',
                                background: 'var(--accent-tint)', display: 'flex', alignItems: 'center',
                                gap: '8px', fontSize: '13px', color: 'var(--accent-ink)',
                            }"
                        >
                            <Icon name="coin" :size="16" color="var(--accent)" :style="{ flexShrink: 0 }" />
                            <span>תצברו <strong class="num">{{ pointsEarned }}</strong> נקודות זכות בהזמנה זו <span class="muted">(10%)</span></span>
                        </div>

                        <!-- TODO(backend): post the order (lines, payer, shipping choice, POA,
                             benefit) to checkout; the success popup keys off the response. -->
                        <button
                            class="btn btn--accent"
                            style="width: 100%; height: 48px; font-size: 16px; font-weight: 600; margin-top: 16px"
                            @click="placed = true"
                        >
                            <Icon :name="payer === 'patient' ? 'whatsapp' : 'check'" :size="18" color="#fff" />
                            {{ payer === 'patient' ? 'שלח לתשלום למטופל/ת' : 'המשך לתשלום' }}
                        </button>
                        <div class="small muted" style="text-align: center; margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 6px">
                            <Icon name="info" :size="13" color="var(--ink-4)" />
                            הנחת מטפל 20% כלולה במחירים
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order-placed success popup -->
            <div
                v-if="placed"
                :style="{
                    position: 'fixed', inset: 0, zIndex: 1200,
                    background: 'rgba(20,28,18,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '24px 20px', overflowY: 'auto',
                }"
                @click="goToOrder"
            >
                <div
                    dir="rtl"
                    :style="{
                        width: '100%', maxWidth: '440px', background: 'var(--surface)',
                        borderRadius: 'var(--r-card)', overflow: 'hidden',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
                        textAlign: 'center', padding: '38px 30px 30px',
                    }"
                    @click.stop
                >
                    <div
                        :style="{
                            width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
                            background: 'var(--accent-tint)', color: 'var(--accent)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }"
                    >
                        <Icon name="check" :size="36" color="var(--accent)" />
                    </div>
                    <h3 style="margin: 0 0 8px; font-size: 21px; font-weight: 700; color: var(--ink)">
                        {{ payer === 'patient' ? 'הבקשה נשלחה למטופל/ת' : 'ההזמנה התקבלה בהצלחה' }}
                    </h3>
                    <p class="small muted" style="margin: 0 auto 6px; max-width: 320px; line-height: 1.6">
                        {{ payer === 'patient'
                            ? 'קישור לתשלום נשלח למטופל/ת. ההזמנה תעבור לרקיחה מיד עם השלמת התשלום.'
                            : 'תודה! ההזמנה שלך התקבלה ונכנסה לטיפול. נעדכן אותך בכל שלב.' }}
                    </p>
                    <div class="small muted" style="margin: 0 0 24px">
                        מספר הזמנה: <strong class="num" style="color: var(--ink)">{{ orderNo }}</strong>
                    </div>
                    <button class="btn btn--accent" style="width: 100%; height: 46px; font-size: 15px; font-weight: 600" @click="goToOrder">
                        <Icon name="package" :size="17" color="#fff" /> צפייה בהזמנה
                    </button>
                </div>
            </div>

            <CourierPoaModal
                :open="poaOpen"
                :patient-name="(activePatient && activePatient.name) || ''"
                @close="poaOpen = false"
                @confirm="(data) => { poaData = data; courierAuth = true; poaOpen = false; }"
            />
        </div>
    </div>
</template>
