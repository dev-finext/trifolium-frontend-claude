<script setup>
// One held-order card: thumbnail + details on the start side, action rail on
// the end side (total, return-to-cart, edit-in-lab for formulas, view, remove).
import { computed } from 'vue';
import { ProductIllustration } from '@/components/shared/art';
import FormulaGlyph from '@/components/shared/cart/FormulaGlyph.vue';
import Icon from '@/components/ui/Icon.vue';
import { HERBS } from '@/data/mock';
import { buildOrderFromRow, setLastOrder } from '@/lib/orders';
import { visit } from '@/lib/routes';
import { useWizardStore } from '@/stores/wizard';

const props = defineProps({
    item: { type: Object, required: true },
});
const emit = defineEmits(['return', 'remove']);

const wizard = useWizardStore();

const fmtP = (n) =>
    n.toLocaleString('he-IL', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const isFormula = computed(() => props.item.kind === 'formula');
const total = computed(() => props.item.price * props.item.qty);

// Formulas summarize as their herb list; shelf products show their description.
const summary = computed(() =>
    isFormula.value
        ? props.item.ingredients
              .map((ing) => {
                  const h = HERBS.find((x) => x.id === ing.herbId);

                  return h ? h.heb : '';
              })
              .filter(Boolean)
              .join(' · ')
        : props.item.desc,
);

// Build a wizard-loadable formula from a held formula item and open the lab
// (compounding) with every field pre-filled. The wizard's loadSavedFormula
// expects ingredients as { herbId, qty }; held items carry percentages (pct),
// so we map those through as relative quantities.
function openPendingFormulaInLab(item) {
    const volNum =
        parseInt(String(item.vol || '').replace(/[^0-9]/g, ''), 10) || null;
    const ingredients = (item.ingredients || [])
        .map((ing) => ({ herbId: ing.herbId, qty: +ing.qty || +ing.pct || 0 }))
        .filter((ing) => !!ing.herbId);

    wizard.setPendingFormula({
        name: item.name || '',
        typeId: item.typeId || 'tincture',
        tinctureVolume: item.typeId === 'capsule' ? null : volNum,
        capsuleCount: item.typeId === 'capsule' ? volNum : null,
        evaporation: item.evaporation || 'none',
        capsuleMultiPacks: !!item.capsuleMultiPacks,
        externalNotes: item.externalNotes || '',
        internalNotes: item.internalNotes || '',
        ingredients,
    });
    visit('compounding');
}

// "צפה" — synthesize an order view for this held line and open it.
function viewOrder(item) {
    setLastOrder(
        buildOrderFromRow({
            id: item.orderId,
            patient: item.patient || '—',
            formula: item.name,
            type: item.kind === 'shelf' ? 'מדף' : 'מותאמת',
            date: item.heldAt,
            status: 'ממתין לתשלום',
        }),
    );
    visit('order', { id: item.orderId });
}
</script>

<template>
    <div class="card pending-card flex flex-wrap items-stretch">
        <!-- thumbnail + body -->
        <div class="flex min-w-[300px] flex-1 items-start gap-[18px] p-[20px]">
            <div
                class="flex h-[100px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-card border border-line bg-surface-sunk"
            >
                <FormulaGlyph v-if="isFormula" :type-id="item.typeId" />
                <ProductIllustration v-else :heb="item.name" />
            </div>

            <div class="min-w-0 flex-1">
                <!-- title + type badge -->
                <div class="flex flex-wrap items-center gap-[10px]">
                    <h3 class="m-0 text-[17px] font-semibold">
                        {{ item.name }}
                    </h3>
                    <span
                        class="inline-flex items-center gap-[6px] rounded-[999px] border px-[10px] py-[3px] text-[11.5px] font-semibold"
                        :class="
                            isFormula
                                ? 'border-transparent bg-accent-tint-strong text-accent-ink'
                                : 'border-line bg-surface-sunk text-ink-2'
                        "
                    >
                        <Icon
                            :name="isFormula ? 'flask' : 'package'"
                            :size="12"
                            :color="
                                isFormula ? 'var(--accent)' : 'var(--ink-3)'
                            "
                        />
                        {{ isFormula ? 'פורמולה בהכנה אישית' : 'מוצר מדף' }}
                    </span>
                </div>

                <!-- meta line -->
                <div
                    class="small muted mt-[10px] flex flex-wrap items-center gap-[12px]"
                >
                    <span class="inline-flex items-center gap-[6px]">
                        <Icon name="user" :size="13" color="var(--ink-4)" />
                        {{ item.patient }}
                    </span>
                    <span v-if="item.phone" class="num" dir="ltr">{{
                        item.phone
                    }}</span>
                    <span class="text-(--line-strong)">·</span>
                    <span class="inline-flex items-center gap-[6px]">
                        <Icon name="clock" :size="13" color="var(--ink-4)" />
                        הוקפא {{ item.heldAt }}
                    </span>
                    <template v-if="item.orderId">
                        <span class="text-(--line-strong)">·</span>
                        <span class="num">{{ item.orderId }}</span>
                    </template>
                    <span class="text-(--line-strong)">·</span>
                    <span>{{ item.reason }}</span>
                </div>

                <!-- summary -->
                <p
                    class="m-0 mt-[10px] text-[13.5px] leading-[1.6] text-pretty text-ink-2"
                >
                    {{ summary }}
                    <span class="muted ms-[8px]">
                        · {{ item.vol
                        }}<template v-if="item.qty > 1">
                            · ×<span class="num">{{ item.qty }}</span></template
                        >
                    </span>
                </p>
            </div>
        </div>

        <!-- action rail -->
        <div
            class="pending-card__rail flex w-[200px] shrink-0 flex-col gap-[12px] border-s border-line p-[20px]"
        >
            <div>
                <div class="field-label mb-[2px]">סה״כ</div>
                <div class="num text-[22px] font-bold">₪{{ fmtP(total) }}</div>
            </div>

            <button
                class="btn btn--ghost btn--sm w-full"
                @click="emit('return', item)"
            >
                <Icon name="cart" :size="14" /> העבר לסל
            </button>

            <button
                v-if="isFormula"
                class="btn btn--primary btn--sm w-full"
                @click="openPendingFormulaInLab(item)"
            >
                <Icon name="edit" :size="14" color="#fff" /> עריכה במעבדה
            </button>

            <div class="flex gap-[8px]">
                <button
                    v-if="item.orderId"
                    class="btn btn--ghost btn--sm flex-1"
                    @click="viewOrder(item)"
                >
                    צפה
                </button>
                <button
                    class="btn btn--ghost btn--sm flex-1 text-danger"
                    @click="emit('remove', item.id)"
                >
                    <Icon name="x" :size="13" color="var(--danger)" /> הסר
                </button>
            </div>
        </div>
    </div>
</template>
