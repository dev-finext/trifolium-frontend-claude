<script setup>
// סל הקניות — Shopping cart. Summary of purchases awaiting payment:
// ready-made shelf products (מוצרי מדף) and custom personal formulas (פורמולות אישיות).
import { Head } from '@inertiajs/vue3';
import { ref, computed, watch, watchEffect } from 'vue';
import CartCard from '@/components/shared/cart/CartCard.vue';
import CourierAuthRow from '@/components/shared/cart/CourierAuthRow.vue';
import CourierPoaModal from '@/components/shared/cart/CourierPoaModal.vue';
import EmptyCart from '@/components/shared/cart/EmptyCart.vue';
import FieldGroupLabel from '@/components/shared/cart/FieldGroupLabel.vue';
import { fmt } from '@/components/shared/cart/fmt';
import MeAddressPicker from '@/components/shared/cart/MeAddressPicker.vue';
import PatientSelect from '@/components/shared/cart/PatientSelect.vue';
import RadioRow from '@/components/shared/cart/RadioRow.vue';
import SideCard from '@/components/shared/cart/SideCard.vue';
import SumRow from '@/components/shared/cart/SumRow.vue';
import Icon from '@/components/ui/Icon.vue';
import { useAddresses, tfPrimaryAddress } from '@/composables/useAddresses';
import { visit } from '@/lib/routes';
import { useCartStore } from '@/stores/cart';

// Cart lines live in the shared store; this page edits them in place
// (qty steppers, remove, move to on-hold), mirroring the prototype's
// items/setItems ownership.
const cart = useCartStore();
const items = cart.state.items;

const ship = ref('patient'); // 'me' | 'patient' | 'pickup'
const payer = ref('me'); // 'me' | 'patient'
const benefit = ref('points'); // 'points' | 'discount'  (only when payer === 'me')

// Free-text delivery/pickup notes (F32) — bound so the value is actually kept.
// TODO(backend): submit alongside the order payload.
const deliveryNotes = ref('');

// Practitioner's saved addresses (source of truth = profile).
// NOTE: useAddresses() returns a ref — script access goes through .value
// (templates auto-unwrap it).
const addresses = useAddresses();
const meAddrId = ref(null);
// Default the "ship to me" choice to the primary address; keep it valid
// if the selected address was removed in the profile.
watchEffect(() => {
    const valid =
        meAddrId.value && addresses.value.some((a) => a.id === meAddrId.value);

    if (!valid) {
        const primary = tfPrimaryAddress(addresses.value);
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
const orderNo =
    'TF-' +
    new Date().getFullYear() +
    '-' +
    String(Math.floor(1000 + Math.random() * 9000));
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
    if (courierAuth.value) {
        courierAuth.value = false;
        poaData.value = null;
    } else {
        poaOpen.value = true;
    }
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
    if (
        payer.value === 'patient' &&
        !payPatient.value &&
        cartPatients.value.length === 1
    ) {
        payPatient.value = cartPatients.value[0].name;
    }
});
// When the patient pays, the shipping recipient is LOCKED to that same patient.
const effectivePatientName = computed(() =>
    payer.value === 'patient'
        ? payPatient.value
        : multiPatient.value
          ? shipPatient.value
          : (cartPatients.value[0] && cartPatients.value[0].name) || '',
);
const activePatient = computed(
    () =>
        cartPatients.value.find((p) => p.name === effectivePatientName.value) ||
        null,
);

// Editable shipping address for the patient case — kept from the prototype
// (prefilled from the chosen patient; the current design collects the address
// from the patient via WhatsApp, so it is not rendered).
const patientAddr = ref({ name: '', street: '', city: '', zip: '', phone: '' });
watch([ship, () => activePatient.value && activePatient.value.name], () => {
    if (ship.value !== 'patient' || !activePatient.value) {
        return;
    }

    const a = patientAddr.value;

    if (a.name !== activePatient.value.name) {
        patientAddr.value = {
            ...a,
            name: activePatient.value.name,
            phone: a.phone || activePatient.value.phone,
        };
    }
});

function setQty(item, q) {
    item.qty = Math.max(1, q);
}
// U1 · explicit removal is undo-able via the store (toast offers "ביטול").
function removeItem(item) {
    cart.removeFromCart(item);
}
// The prototype removed the line AND broadcast tf:moveToPending; the store's
// moveToPending only adds to the on-hold list, so remove the line here too.
// (Silent splice — moveToPending shows its own toast; no undo needed since the
// line isn't lost, just parked.)
function hold(item) {
    const i = items.indexOf(item);

    if (i !== -1) {
        items.splice(i, 1);
    }

    cart.moveToPending(item);
}

// ── Pricing (per the SAP discount sheet) ──────────────────────────────
// Item prices are LIST prices (מחיר מחירון). המטפל משלם: הנחה בסיסית 20%
// (everything except shelf) + הנחה על מוצר מדף 40%. הלקוח משלם: no
// practitioner discounts (הנחה על מוצר מדף — אין); the practitioner chooses
// הנחה 10% למטופל/ת OR צבירה 10% (points). The 10+1 promo applies either
// way: every full 11 shelf units make the cheapest one free.
// TODO(backend): checkout recomputes all of this server-side; this mirror
// exists so the receipt is honest in the demo.
const listTotal = computed(() =>
    items.reduce((s, it) => s + it.price * it.qty, 0),
);
const shelfList = computed(() =>
    items
        .filter((it) => it.kind === 'shelf')
        .reduce((s, it) => s + it.price * it.qty, 0),
);
const formulaList = computed(() => listTotal.value - shelfList.value);

// 10+1 — one free unit per full 11 shelf units, always the cheapest.
const shelfUnits = computed(() =>
    items.filter((it) => it.kind === 'shelf').reduce((s, it) => s + it.qty, 0),
);
const freeUnits = computed(() => Math.floor(shelfUnits.value / 11));
const cheapestShelf = computed(() => {
    const shelf = items.filter((it) => it.kind === 'shelf');

    if (!shelf.length) {
        return null;
    }

    return shelf.reduce((m, it) => (it.price < m.price ? it : m), shelf[0]);
});
// List value of the free unit(s)…
const tenPlusOneList = computed(() =>
    freeUnits.value && cheapestShelf.value
        ? cheapestShelf.value.price * freeUnits.value
        : 0,
);
// …and what the promo actually saves: when the practitioner pays, the 40%
// line already covers 40% of it, so the promo line carries the remaining 60%.
const tenPlusOneValue = computed(() =>
    payer.value === 'me' ? 0.6 * tenPlusOneList.value : tenPlusOneList.value,
);

// המטפל משלם — the two SAP discounts.
const shelfDiscount = computed(() =>
    payer.value === 'me' ? 0.4 * shelfList.value : 0,
);
const baseDiscount = computed(() =>
    payer.value === 'me' ? 0.2 * formulaList.value : 0,
);

// הלקוח משלם — the chosen benefit (on the order minus the free 10+1 items).
const customerDiscount = computed(() =>
    payer.value === 'patient' && benefit.value === 'discount'
        ? 0.1 * (listTotal.value - tenPlusOneList.value)
        : 0,
);
const pointsEarned = computed(() =>
    payer.value === 'patient' && benefit.value === 'points'
        ? Math.round(0.1 * (listTotal.value - tenPlusOneList.value))
        : 0,
);

const savings = computed(
    () =>
        shelfDiscount.value +
        baseDiscount.value +
        tenPlusOneValue.value +
        customerDiscount.value,
);
const goodsTotal = computed(() => listTotal.value - savings.value);
const shipping = computed(() =>
    items.length === 0 || ship.value === 'pickup'
        ? 0
        : goodsTotal.value >= 250
          ? 0
          : 29,
);
const total = computed(() => goodsTotal.value + shipping.value);
const unitCount = computed(() => items.reduce((s, it) => s + it.qty, 0));

// Checkout gate (F36) — the "continue to payment" action must not fire while
// the payer/shipping selection is incomplete (e.g. ship='patient' with no
// patient assigned, ship='me' with no address, or payer='patient' with no
// paying patient chosen).
const payerValid = computed(() =>
    payer.value === 'patient' ? !!payPatient.value : true,
);
const shipValid = computed(() => {
    if (ship.value === 'pickup') {
        return true;
    }

    if (ship.value === 'me') {
        return !!meAddrId.value;
    }

    if (ship.value === 'patient') {
        return !!effectivePatientName.value;
    }

    return false;
});
const canCheckout = computed(
    () => items.length > 0 && payerValid.value && shipValid.value,
);
// When checkout is blocked, tell the practitioner exactly what's missing
// (F36 follow-up) — one actionable line per unmet requirement.
const checkoutBlockers = computed(() => {
    const out = [];

    if (!payerValid.value) {
        out.push('בחרו איזה מטופל/ת משלם/ת — תחת "פרטי תשלום"');
    }

    if (ship.value === 'me' && !meAddrId.value) {
        out.push('בחרו כתובת למשלוח — תחת "משלוח"');
    }

    if (ship.value === 'patient' && !effectivePatientName.value) {
        out.push('שייכו מטופל/ת למשלוח — לפריטים בסל אין מטופל/ת מקושר/ת');
    }

    return out;
});

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
            <div class="mb-[32px] text-center">
                <div
                    class="inline-flex items-center gap-[12px] whitespace-nowrap"
                >
                    <Icon
                        name="cart"
                        :size="28"
                        color="var(--accent)"
                        :stroke="1.6"
                    />
                    <h1 class="page-title m-0 whitespace-nowrap">סל הקניות</h1>
                </div>
                <p class="page-sub mt-[8px]">
                    <template v-if="items.length > 0">
                        סיכום הרכישות שלך ·
                        <span class="num">{{ items.length }}</span> פריטים ·
                        <span class="num">{{ unitCount }}</span> יחידות ממתינות
                        לתשלום
                    </template>
                    <template v-else>הסל ריק כעת</template>
                </p>
            </div>

            <EmptyCart v-if="items.length === 0" />
            <div
                v-else
                class="grid grid-cols-[1fr_340px] items-start gap-[24px]"
            >
                <!-- MAIN — item list -->
                <div class="col gap-[16px]">
                    <CartCard
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        @qty="(q) => setQty(item, q)"
                        @remove="removeItem(item)"
                        @hold="hold(item)"
                    />
                </div>

                <!-- SIDEBAR — on phones this whole column becomes the tinted
                     "summary zone", introduced by the labelled divider below
                     (both styled in overrides.css; divider hidden on desktop). -->
                <div class="cart-sidebar col sticky top-[80px] gap-[16px]">
                    <div class="cart-summary-divider hidden" aria-hidden="true">
                        <span class="cart-summary-divider__chip">
                            <Icon
                                name="clipboard_list"
                                :size="15"
                                color="#fff"
                            />
                            סיכום והזמנה · לתשלום
                        </span>
                    </div>
                    <!-- Payment — chosen first; who pays drives the shipping options -->
                    <SideCard title="פרטי תשלום">
                        <FieldGroupLabel>מבצע התשלום:</FieldGroupLabel>
                        <div class="flex gap-[24px]">
                            <RadioRow
                                label="אני"
                                :checked="payer === 'me'"
                                @change="payer = 'me'"
                            />
                            <RadioRow
                                label="המטופל/ת"
                                :checked="payer === 'patient'"
                                @change="payer = 'patient'"
                            />
                        </div>

                        <!-- When the practitioner pays — the SAP discounts apply automatically -->
                        <div v-if="payer === 'me'" class="mt-[16px]">
                            <div
                                class="flex gap-[8px] rounded-control bg-accent-tint px-[12px] py-[10px] text-[12.5px] leading-[1.6] text-accent-ink"
                            >
                                <Icon
                                    name="sparkles"
                                    :size="15"
                                    color="var(--accent)"
                                    class="mt-[1px] shrink-0"
                                />
                                <span
                                    >הנחות המטפל שלך —
                                    <strong>הנחה בסיסית 20%</strong> ו<strong
                                        >הנחה על מוצר מדף 40%</strong
                                    >
                                    — יורדות אוטומטית בסיכום ההזמנה.</span
                                >
                            </div>
                        </div>

                        <div v-if="payer === 'patient'" class="mt-[16px]">
                            <div
                                v-if="cartPatients.length > 0"
                                class="mb-[14px]"
                            >
                                <FieldGroupLabel
                                    >איזה מטופל/ת משלם/ת?</FieldGroupLabel
                                >
                                <div
                                    v-if="cartPatients.length === 1"
                                    class="flex items-center gap-[8px] rounded-control border border-line bg-surface px-[12px] py-[10px] text-[14px] font-semibold"
                                >
                                    <Icon
                                        name="user"
                                        :size="15"
                                        color="var(--accent)"
                                    />
                                    {{ cartPatients[0].name }}
                                </div>
                                <PatientSelect
                                    v-else
                                    v-model="payPatient"
                                    :patients="cartPatients"
                                />
                            </div>

                            <FieldGroupLabel
                                >לצבור נקודות או לתת הנחה
                                למטופל/ת?</FieldGroupLabel
                            >
                            <div class="flex flex-col gap-[4px]">
                                <RadioRow
                                    label="צבירת נקודות זכות"
                                    :checked="benefit === 'points'"
                                    @change="benefit = 'points'"
                                />
                                <RadioRow
                                    label="הנחה למטופל/ת"
                                    :checked="benefit === 'discount'"
                                    @change="benefit = 'discount'"
                                />
                            </div>
                            <div
                                class="mt-[12px] flex gap-[8px] rounded-control bg-accent-tint px-[12px] py-[10px] text-[12.5px] leading-[1.55] text-accent-ink"
                            >
                                <Icon
                                    :name="
                                        benefit === 'points'
                                            ? 'coin'
                                            : 'sparkles'
                                    "
                                    :size="15"
                                    color="var(--accent)"
                                    class="mt-[1px] shrink-0"
                                />
                                <span v-if="benefit === 'points'"
                                    ><strong class="num">{{
                                        pointsEarned
                                    }}</strong>
                                    נקודות זכות יצברו בחשבונך
                                    <span class="muted">(צבירה 10%)</span
                                    >.</span
                                >
                                <span v-else
                                    >הנחה של
                                    <strong
                                        >₪<span class="num">{{
                                            fmt(customerDiscount)
                                        }}</span></strong
                                    >
                                    למטופל/ת על כלל ההזמנה
                                    <span class="muted">(הנחה 10%)</span>.</span
                                >
                            </div>
                            <div
                                v-if="shelfList > 0"
                                class="mt-[8px] text-[11.5px] leading-[1.5] text-ink-3"
                            >
                                בתשלום של הלקוח — הנחה על מוצר מדף אין.
                            </div>
                            <div
                                class="mt-[10px] flex gap-[8px] rounded-control bg-surface-sunk px-[12px] py-[10px] text-[12.5px] leading-[1.5] text-ink-3"
                            >
                                <Icon
                                    name="whatsapp"
                                    :size="15"
                                    color="var(--ink-4)"
                                    class="mt-[1px] shrink-0"
                                />
                                קישור לתשלום יישלח לוואטסאפ של המטופל/ת לאחר
                                אישור ההזמנה.
                            </div>
                        </div>
                    </SideCard>

                    <!-- Delivery — depends on the payer chosen above -->
                    <SideCard title="משלוח">
                        <FieldGroupLabel>אופן המשלוח:</FieldGroupLabel>
                        <div class="mb-[16px] flex flex-wrap gap-[18px]">
                            <RadioRow
                                label="אליי"
                                :checked="ship === 'me'"
                                @change="ship = 'me'"
                            />
                            <RadioRow
                                label="אל המטופל/ת"
                                :checked="ship === 'patient'"
                                @change="ship = 'patient'"
                            />
                            <RadioRow
                                label="איסוף עצמי"
                                :checked="ship === 'pickup'"
                                @change="ship = 'pickup'"
                            />
                        </div>

                        <!-- Ship to me → saved-address picker (defaults to primary) -->
                        <div v-if="ship === 'me'" class="mb-[16px]">
                            <MeAddressPicker
                                :addresses="addresses"
                                :selected-id="meAddrId"
                                @select="meAddrId = $event"
                            />
                        </div>

                        <!-- Self pickup → pharmacy collection point -->
                        <div v-if="ship === 'pickup'" class="mb-[16px]">
                            <div
                                class="rounded-control border border-line bg-surface px-[15px] py-[14px]"
                            >
                                <div
                                    class="mb-[8px] flex items-center gap-[9px]"
                                >
                                    <Icon
                                        name="map_pin"
                                        :size="16"
                                        color="var(--accent)"
                                    />
                                    <span class="text-[14px] font-semibold">{{
                                        TF_PICKUP_LOCATION.name
                                    }}</span>
                                </div>
                                <div class="small leading-[1.6] text-ink-2">
                                    {{ TF_PICKUP_LOCATION.street }},
                                    {{ TF_PICKUP_LOCATION.city }}
                                </div>
                                <div
                                    class="small muted mt-[6px] flex items-center gap-[7px]"
                                >
                                    <Icon
                                        name="clock"
                                        :size="13"
                                        color="var(--ink-4)"
                                    />
                                    {{ TF_PICKUP_LOCATION.hours }}
                                </div>
                                <div
                                    class="small muted num mt-[4px] text-right"
                                    dir="ltr"
                                >
                                    {{ TF_PICKUP_LOCATION.phone }}
                                </div>
                            </div>
                            <div
                                class="mt-[10px] flex items-center gap-[8px] rounded-control bg-surface-sunk px-[12px] py-[9px] text-[12.5px] leading-[1.5] text-ink-3"
                            >
                                <Icon
                                    name="info"
                                    :size="14"
                                    color="var(--ink-4)"
                                    class="shrink-0"
                                />
                                נודיע לך בהודעה כשההזמנה מוכנה לאיסוף.
                            </div>
                        </div>

                        <!-- Ship to patient — address entry only when the practitioner pays -->
                        <div v-if="ship === 'patient'" class="mb-[16px]">
                            <div
                                v-if="payer === 'patient' && activePatient"
                                class="mb-[14px]"
                            >
                                <FieldGroupLabel>נמען המשלוח</FieldGroupLabel>
                                <div
                                    class="flex items-center gap-[8px] rounded-control border border-line bg-surface-sunk px-[12px] py-[10px] text-[14px] font-semibold"
                                >
                                    <Icon
                                        name="lock"
                                        :size="14"
                                        color="var(--ink-4)"
                                    />
                                    {{ activePatient.name }}
                                </div>
                                <div class="small muted mt-[6px] text-[11.5px]">
                                    המשלוח נשלח למטופל/ת שמשלם/ת. לשינוי יש
                                    לעדכן את בחירת המשלם בפרטי התשלום.
                                </div>
                            </div>
                            <div
                                v-if="payer !== 'patient' && multiPatient"
                                class="mb-[14px]"
                            >
                                <FieldGroupLabel
                                    >לאיזה מטופל/ת לשלוח את כל
                                    הסל?</FieldGroupLabel
                                >
                                <PatientSelect
                                    v-model="shipPatient"
                                    :patients="cartPatients"
                                />
                                <div class="small muted mt-[6px] text-[11.5px]">
                                    כל פריטי הסל יישלחו לכתובת אחת.
                                </div>
                            </div>
                            <div
                                v-if="payer === 'patient'"
                                class="flex gap-[9px] rounded-control bg-accent-tint px-[13px] py-[11px] text-[12.5px] leading-[1.6] text-accent-ink"
                            >
                                <Icon
                                    name="whatsapp"
                                    :size="16"
                                    color="var(--accent)"
                                    class="mt-[1px] shrink-0"
                                />
                                <span
                                    >המטופל/ת ימלא/ת את כתובת המשלוח בעצמו/ה —
                                    הבקשה תישלח אליו/ה יחד עם קישור לתשלום
                                    בוואטסאפ. אין צורך להזין כתובת כעת.</span
                                >
                            </div>
                            <div
                                v-else-if="cartPatients.length === 0"
                                class="rounded-control bg-surface-sunk px-[12px] py-[10px] text-[12.5px] leading-[1.5] text-ink-3"
                            >
                                אין מטופל/ת משויך/ת לפריטים בסל. שייכו מטופל/ת
                                כדי שנשלח אליו/ה קישור למילוי כתובת המשלוח.
                            </div>
                            <div
                                v-else-if="!multiPatient || shipPatient"
                                class="flex gap-[9px] rounded-control bg-accent-tint px-[13px] py-[11px] text-[12.5px] leading-[1.6] text-accent-ink"
                            >
                                <Icon
                                    name="whatsapp"
                                    :size="16"
                                    color="var(--accent)"
                                    class="mt-[1px] shrink-0"
                                />
                                <span
                                    >המטופל/ת ימלא/ת את כתובת המשלוח בעצמו/ה —
                                    יישלח אליו/ה קישור למילוי הכתובת. אין צורך
                                    להזין כתובת כעת.</span
                                >
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

                        <FieldGroupLabel id="cart-delivery-notes-label">{{
                            ship === 'pickup'
                                ? 'הערות לאיסוף:'
                                : 'הערות למשלוח:'
                        }}</FieldGroupLabel>
                        <textarea
                            id="cart-delivery-notes"
                            v-model="deliveryNotes"
                            aria-labelledby="cart-delivery-notes-label"
                            maxlength="300"
                            placeholder="הערות (לא חובה)"
                            rows="3"
                            class="min-h-[70px] w-full resize-y rounded-control border border-line bg-surface px-[12px] py-[10px] [font-family:inherit] text-[14px] text-ink outline-none"
                        />
                    </SideCard>

                    <!-- Summary — a full receipt: list price, then every benefit
                         as its own line (SAP wording), so the practitioner sees
                         exactly what they pay for and what they saved. -->
                    <div class="card p-[20px]">
                        <h3 class="m-0 mb-[16px] text-[16px] font-semibold">
                            סיכום הזמנה
                        </h3>
                        <SumRow
                            label="מחיר מחירון"
                            :value="`₪${fmt(listTotal)}`"
                            :strike="savings > 0"
                        />
                        <SumRow
                            v-if="shelfDiscount > 0"
                            label="הנחה על מוצר מדף — 40%"
                            :value="`−₪${fmt(shelfDiscount)}`"
                            accent
                        />
                        <SumRow
                            v-if="baseDiscount > 0"
                            label="הנחה בסיסית — 20%"
                            :value="`−₪${fmt(baseDiscount)}`"
                            accent
                        />
                        <SumRow
                            v-if="tenPlusOneValue > 0"
                            :label="`מבצע 10+1 · ${cheapestShelf.name} חינם*`"
                            :value="`−₪${fmt(tenPlusOneValue)}`"
                            accent
                        />
                        <div
                            v-if="tenPlusOneValue > 0"
                            class="small muted mt-[-4px] text-[11px]"
                        >
                            *הזול מביניהם
                        </div>
                        <SumRow
                            v-if="customerDiscount > 0"
                            label="הנחה 10%"
                            :value="`−₪${fmt(customerDiscount)}`"
                            accent
                        />
                        <SumRow
                            :label="ship === 'pickup' ? 'איסוף עצמי' : 'משלוח'"
                            :value="
                                ship === 'pickup'
                                    ? 'ללא עלות'
                                    : shipping === 0
                                      ? 'חינם'
                                      : `₪${fmt(shipping)}`
                            "
                            :accent="shipping === 0"
                        />
                        <div
                            v-if="shipping > 0"
                            class="small muted mt-[2px] text-[11.5px]"
                        >
                            משלוח חינם בהזמנה מעל <span class="num">₪250</span>
                        </div>
                        <div
                            class="mt-[14px] flex items-baseline justify-between border-t border-t-ink pt-[14px]"
                        >
                            <span class="text-[14px] font-semibold text-ink-2"
                                >סה״כ לתשלום</span
                            >
                            <span class="text-[26px] font-bold text-accent">
                                ₪<span class="num">{{ fmt(total) }}</span>
                            </span>
                        </div>

                        <!-- The savings banner — the whole point of the receipt -->
                        <div
                            v-if="savings > 0"
                            class="mt-[12px] rounded-control bg-accent px-[12px] py-[9px] text-center text-[14px] font-bold text-white"
                        >
                            🎉 חסכתם בהזמנה זו ₪<span class="num">{{
                                fmt(savings)
                            }}</span>
                        </div>

                        <div
                            v-if="pointsEarned > 0"
                            class="mt-[14px] flex items-center gap-[8px] rounded-control bg-accent-tint px-[12px] py-[10px] text-[13px] text-accent-ink"
                        >
                            <Icon
                                name="coin"
                                :size="16"
                                color="var(--accent)"
                                class="shrink-0"
                            />
                            <span
                                >תצברו
                                <strong class="num">{{ pointsEarned }}</strong>
                                נקודות זכות בהזמנה זו
                                <span class="muted">(צבירה 10%)</span></span
                            >
                        </div>

                        <!-- TODO(backend): post the order (lines, payer, shipping choice, POA,
                             benefit) to checkout; the success popup keys off the response. -->
                        <button
                            class="btn btn--accent mt-[16px] h-[48px] w-full text-[16px] font-semibold"
                            :class="
                                canCheckout
                                    ? 'cursor-pointer opacity-100'
                                    : 'cursor-not-allowed opacity-50'
                            "
                            :disabled="!canCheckout"
                            @click="canCheckout && (placed = true)"
                        >
                            <Icon
                                :name="
                                    payer === 'patient' ? 'whatsapp' : 'check'
                                "
                                :size="18"
                                color="#fff"
                            />
                            {{
                                payer === 'patient'
                                    ? 'שלח לתשלום למטופל/ת'
                                    : 'המשך לתשלום'
                            }}
                        </button>

                        <!-- Why checkout is blocked — actionable, per requirement -->
                        <div
                            v-if="!canCheckout && checkoutBlockers.length"
                            role="status"
                            class="mt-[12px] rounded-card border border-[#ecd9b0] bg-[#fbf3e3] px-[14px] py-[11px]"
                        >
                            <div
                                class="mb-[5px] flex items-center gap-[6px] text-[12.5px] font-bold text-warning"
                            >
                                <Icon
                                    name="info"
                                    :size="13"
                                    color="var(--warning)"
                                />
                                כדי להמשיך לתשלום:
                            </div>
                            <ul
                                class="m-0 flex list-none flex-col gap-[3px] p-0 text-[12.5px] leading-[1.55] text-ink-2"
                            >
                                <li
                                    v-for="(b, i) in checkoutBlockers"
                                    :key="i"
                                    class="flex gap-[6px]"
                                >
                                    <span
                                        class="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-[50%] bg-warning"
                                    ></span>
                                    {{ b }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order-placed success popup. U3: the backdrop is NOT a navigate
                 target — an accidental scrim tap must not whisk the user away
                 from the confirmation. They use the explicit action inside. -->
            <div
                v-if="placed"
                class="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto bg-[rgba(20,28,18,0.5)] px-[20px] py-[24px]"
            >
                <div
                    dir="rtl"
                    role="dialog"
                    aria-modal="true"
                    aria-label="ההזמנה נשלחה"
                    class="w-full max-w-[440px] overflow-hidden rounded-card bg-surface px-[30px] pt-[38px] pb-[30px] text-center shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
                    @click.stop
                >
                    <div
                        class="mx-auto mt-0 mb-[20px] inline-flex h-[72px] w-[72px] items-center justify-center rounded-[50%] bg-accent-tint text-accent"
                    >
                        <Icon name="check" :size="36" color="var(--accent)" />
                    </div>
                    <h3 class="m-0 mb-[8px] text-[21px] font-bold text-ink">
                        {{
                            payer === 'patient'
                                ? 'הבקשה נשלחה למטופל/ת'
                                : 'ההזמנה התקבלה בהצלחה'
                        }}
                    </h3>
                    <p
                        class="small muted mx-auto mt-0 mb-[6px] max-w-[320px] leading-[1.6]"
                    >
                        {{
                            payer === 'patient'
                                ? 'קישור לתשלום נשלח למטופל/ת. ההזמנה תעבור לרקיחה מיד עם השלמת התשלום.'
                                : 'תודה! ההזמנה שלך התקבלה ונכנסה לטיפול. נעדכן אותך בכל שלב.'
                        }}
                    </p>
                    <div class="small muted m-0 mb-[24px]">
                        מספר הזמנה:
                        <strong class="num text-ink">{{ orderNo }}</strong>
                    </div>
                    <button
                        class="btn btn--accent h-[46px] w-full text-[15px] font-semibold"
                        @click="goToOrder"
                    >
                        <Icon name="package" :size="17" color="#fff" /> צפייה
                        בהזמנה
                    </button>
                </div>
            </div>

            <CourierPoaModal
                :open="poaOpen"
                :patient-name="(activePatient && activePatient.name) || ''"
                @close="poaOpen = false"
                @confirm="
                    (data) => {
                        poaData = data;
                        courierAuth = true;
                        poaOpen = false;
                    }
                "
            />
        </div>
    </div>
</template>
