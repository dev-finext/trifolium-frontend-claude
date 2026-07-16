<script setup>
// Order View — full order detail page reached from "צפה בהזמנה".
// Reads the just-submitted order from the shared order module
// (getLastOrder), with a realistic fallback so the page never renders empty.
import { Head } from '@inertiajs/vue3';
import Icon from '@/components/ui/Icon.vue';
import StatusPill from '@/components/shared/orders/StatusPill.vue';
import StatusTimeline from '@/components/shared/orders/StatusTimeline.vue';
import FormulaCard from '@/components/shared/orders/FormulaCard.vue';
import NotesCard from '@/components/shared/orders/NotesCard.vue';
import PatientCard from '@/components/shared/orders/PatientCard.vue';
import PricingCard from '@/components/shared/orders/PricingCard.vue';
import PharmacistCard from '@/components/shared/orders/PharmacistCard.vue';
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
                class="inline-flex items-center gap-[6px] mb-[18px] text-[13px] text-ink-3 cursor-pointer"
                @click="goHome"
            >
                <Icon name="arrow_right" :size="15" />
                חזרה ללוח הבקרה
            </a>

            <!-- Header row -->
            <div
                class="flex items-start justify-between gap-[24px] flex-wrap mb-[28px]"
            >
                <div>
                    <div class="flex items-center gap-[14px] flex-wrap">
                        <h1 class="page-title m-0">
                            הזמנה <span class="num tracking-[0.01em]">{{ order.id }}</span>
                        </h1>
                        <StatusPill :route="order.paymentRoute" :tone="tone" :label="order.status" />
                    </div>
                    <p class="page-sub flex items-center gap-[14px] flex-wrap mt-[8px]">
                        <span class="inline-flex items-center gap-[6px]">
                            <Icon name="clock" :size="14" /> {{ order.date }}
                        </span>
                        <span class="text-line-strong">·</span>
                        <span class="inline-flex items-center gap-[6px]">
                            <Icon name="user" :size="14" /> {{ patientName }}
                        </span>
                        <span class="text-line-strong">·</span>
                        <span class="inline-flex items-center gap-[6px]">
                            <Icon name="flask" :size="14" /> {{ f.typeHeb }}
                        </span>
                    </p>
                </div>

                <div class="flex gap-[10px] flex-wrap">
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
                class="grid grid-cols-[1fr_340px] items-start gap-[24px] mt-[24px]"
            >
                <!-- MAIN -->
                <div class="col gap-[24px]">
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
                <div class="col gap-[16px]">
                    <PatientCard :name="patientName" :phone="phone" />
                    <PricingCard :pricing="pricing" />
                    <PharmacistCard />
                </div>
            </div>

            <!-- Bottom nav -->
            <div class="flex flex-wrap justify-between gap-[12px] mt-[32px]">
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
