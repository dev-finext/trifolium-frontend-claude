<script setup>
// Order View — full order detail page reached from "צפה בהזמנה".
// Reads the just-submitted order from the shared order module
// (getLastOrder), with a realistic fallback so the page never renders empty.
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import StatusPill from '@/Components/orders/StatusPill.vue';
import StatusTimeline from '@/Components/orders/StatusTimeline.vue';
import FormulaCard from '@/Components/orders/FormulaCard.vue';
import NotesCard from '@/Components/orders/NotesCard.vue';
import PatientCard from '@/Components/orders/PatientCard.vue';
import PricingCard from '@/Components/orders/PricingCard.vue';
import PharmacistCard from '@/Components/orders/PharmacistCard.vue';
import { visit } from '@/lib/routes';
import { getLastOrder, phoneFromName } from '@/lib/orders';
import { useWizardStore } from '@/stores/wizard';
import { HERBS } from '@/data/mock';

// TODO(backend): fetch the order by id server-side; for now the id is only
// part of the URL and the order body comes from the client-side hand-off.
defineProps({
    id: { type: String, default: '' },
});

const wizard = useWizardStore();

const order = getLastOrder();
const f = order.formula;
const pricing = order.pricing;
const patientName = order.patientLabel || '—';
const phone = phoneFromName(patientName);

// A compounded (personally-prepared) formula — not an off-the-shelf product.
// Shelf orders carry typeHeb === 'מוצר מדף'; everything else is editable.
const isCompoundedFormula = (formula) => !!formula && formula.typeHeb !== 'מוצר מדף';
const canEditFormula = isCompoundedFormula(f);

// Current pipeline position: explicit stageIndex (from dashboard rows) wins;
// otherwise derive from whether we're still waiting on patient payment.
const activeIndex = order.stageIndex != null
    ? order.stageIndex
    : (order.paymentRoute === 'patient' ? 1 : 2);
const tone = order.statusTone || (order.paymentRoute === 'patient' ? 'amber' : 'green');
const cancelled = !!order.cancelled;

const goHome = () => visit('home');

// Build a wizard-loadable formula from the order's formula block and open the
// lab (compounding) with every field pre-filled for full editing. The wizard's
// loadSavedFormula expects ingredients as { herbId, qty }, so we resolve each
// row back to its herbId via the HERBS table (matching on Latin or Hebrew name).
const openFormulaInLab = () => {
    const ff = order.formula || {};
    const byName = {};
    HERBS.forEach((h) => { byName[h.lat] = h.id; byName[h.heb] = h.id; });

    const ingredients = (ff.ingredients || [])
        .map((ing) => ({ herbId: ing.herbId || byName[ing.lat] || byName[ing.heb], qty: +ing.qty || 0 }))
        .filter((ing) => !!ing.herbId);

    const volNum = parseInt(String(ff.totalVol || '').replace(/[^0-9]/g, ''), 10) || null;

    wizard.setPendingFormula({
        name: ff.name || '',
        typeId: ff.typeId || 'tincture',
        tinctureVolume: ff.typeId === 'capsule' ? null : volNum,
        capsuleCount: ff.typeId === 'capsule' ? volNum : null,
        evaporation: ff.evaporation || 'none',
        capsuleMultiPacks: !!ff.capsuleMultiPacks,
        externalNotes: ff.externalNotes || '',
        internalNotes: ff.internalNotes || '',
        ingredients,
    });
    visit('compounding');
};
</script>

<template>
    <Head :title="`הזמנה ${order.id}`" />
    <div class="page" data-screen-label="הזמנה — צפייה">
        <div class="page__inner page__inner--wide">

            <!-- Breadcrumb back -->
            <a
                :style="{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '13px', color: 'var(--ink-3)', cursor: 'pointer',
                    marginBottom: '18px',
                }"
                @click="goHome"
            >
                <Icon name="arrow_right" :size="15" />
                חזרה ללוח הבקרה
            </a>

            <!-- Header row -->
            <div
                :style="{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                    gap: '24px', flexWrap: 'wrap', marginBottom: '28px',
                }"
            >
                <div>
                    <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap">
                        <h1 class="page-title" style="margin: 0">
                            הזמנה <span class="num" style="letter-spacing: 0.01em">{{ order.id }}</span>
                        </h1>
                        <StatusPill :route="order.paymentRoute" :tone="tone" :label="order.status" />
                    </div>
                    <p class="page-sub" style="margin-top: 8px; display: flex; align-items: center; gap: 14px; flex-wrap: wrap">
                        <span style="display: inline-flex; align-items: center; gap: 6px">
                            <Icon name="clock" :size="14" /> {{ order.date }}
                        </span>
                        <span style="color: var(--line-strong)">·</span>
                        <span style="display: inline-flex; align-items: center; gap: 6px">
                            <Icon name="user" :size="14" /> {{ patientName }}
                        </span>
                        <span style="color: var(--line-strong)">·</span>
                        <span style="display: inline-flex; align-items: center; gap: 6px">
                            <Icon name="flask" :size="14" /> {{ f.typeHeb }}
                        </span>
                    </p>
                </div>

                <div style="display: flex; gap: 10px; flex-wrap: wrap">
                    <!-- Edit-in-lab — compounded formulas only; shelf products are not editable -->
                    <button v-if="canEditFormula" class="btn btn--ghost btn--sm" @click="openFormulaInLab">
                        <Icon name="flask" :size="15" /> עריכה במעבדה
                    </button>
                    <button class="btn btn--ghost btn--sm">
                        <Icon name="clipboard_list" :size="15" /> שמור פורמולה לרשימה שלי
                    </button>
                </div>
            </div>

            <!-- Status timeline -->
            <StatusTimeline :active-index="activeIndex" :route="order.paymentRoute" :cancelled="cancelled" />

            <!-- Two-column body -->
            <div
                :style="{
                    display: 'grid',
                    gridTemplateColumns: '1fr 340px',
                    gap: '24px',
                    alignItems: 'flex-start',
                    marginTop: '24px',
                }"
            >
                <!-- MAIN -->
                <div class="col gap-24">
                    <FormulaCard :f="f" />

                    <NotesCard
                        v-if="f.externalNotes"
                        tone="accent"
                        eyebrow="הנחיות למטופל"
                        icon="user"
                        :text="f.externalNotes"
                    />
                    <NotesCard
                        v-if="f.internalNotes"
                        tone="amber"
                        eyebrow="הנחיות פנימיות — בית מרקחת בלבד"
                        icon="alert"
                        :text="f.internalNotes"
                    />
                </div>

                <!-- SIDEBAR -->
                <div class="col gap-16">
                    <PatientCard :name="patientName" :phone="phone" />
                    <PricingCard :pricing="pricing" />
                    <PharmacistCard />
                </div>
            </div>

            <!-- Bottom nav -->
            <div style="margin-top: 32px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px">
                <button class="btn btn--ghost" @click="goHome">
                    <Icon name="arrow_right" :size="16" /> חזרה ללוח הבקרה
                </button>
                <button class="btn btn--primary" @click="visit('compounding')">
                    <Icon name="plus" :size="16" color="#fff" /> פורמולה חדשה
                </button>
            </div>

        </div>
    </div>
</template>
