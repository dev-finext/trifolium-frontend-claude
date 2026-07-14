<script setup>
// One held-order card: thumbnail + details on the start side, action rail on
// the end side (total, return-to-cart, edit-in-lab for formulas, view, remove).
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FormulaGlyph from '@/Components/cart/FormulaGlyph.vue';
import { ProductIllustration } from '@/Components/art';
import { HERBS } from '@/data/mock';
import { visit } from '@/lib/routes';
import { useWizardStore } from '@/stores/wizard';
import { buildOrderFromRow, setLastOrder } from '@/lib/orders';

const props = defineProps({
    item: { type: Object, required: true },
});
const emit = defineEmits(['return', 'remove']);

const wizard = useWizardStore();

const fmtP = (n) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isFormula = computed(() => props.item.kind === 'formula');
const total = computed(() => props.item.price * props.item.qty);

// Formulas summarize as their herb list; shelf products show their description.
const summary = computed(() => (
    isFormula.value
        ? props.item.ingredients.map((ing) => {
            const h = HERBS.find((x) => x.id === ing.herbId);
            return h ? h.heb : '';
        }).filter(Boolean).join(' · ')
        : props.item.desc
));

// Build a wizard-loadable formula from a held formula item and open the lab
// (compounding) with every field pre-filled. The wizard's loadSavedFormula
// expects ingredients as { herbId, qty }; held items carry percentages (pct),
// so we map those through as relative quantities.
function openPendingFormulaInLab(item) {
    const volNum = parseInt(String(item.vol || '').replace(/[^0-9]/g, ''), 10) || null;
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
    setLastOrder(buildOrderFromRow({
        id: item.orderId, patient: item.patient || '—',
        formula: item.name, type: item.kind === 'shelf' ? 'מדף' : 'מותאמת',
        date: item.heldAt, status: 'ממתין לתשלום',
    }));
    visit('order', { id: item.orderId });
}
</script>

<template>
    <div class="card" style="display: flex; align-items: stretch; flex-wrap: wrap">
        <!-- thumbnail + body -->
        <div :style="{ flex: 1, minWidth: '300px', padding: '20px', display: 'flex', gap: '18px', alignItems: 'flex-start' }">
            <div
                :style="{
                    width: '92px', height: '100px', flexShrink: 0, overflow: 'hidden',
                    borderRadius: 'var(--r-card)', border: '1px solid var(--line)',
                    background: 'var(--surface-sunk)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }"
            >
                <FormulaGlyph v-if="isFormula" :type-id="item.typeId" />
                <ProductIllustration v-else :heb="item.name" />
            </div>

            <div style="flex: 1; min-width: 0">
                <!-- title + type badge -->
                <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
                    <h3 style="margin: 0; font-size: 17px; font-weight: 600">{{ item.name }}</h3>
                    <span
                        :style="{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 600,
                            background: isFormula ? 'var(--accent-tint-strong)' : 'var(--surface-sunk)',
                            color: isFormula ? 'var(--accent-ink)' : 'var(--ink-2)',
                            border: isFormula ? '1px solid transparent' : '1px solid var(--line)',
                        }"
                    >
                        <Icon :name="isFormula ? 'flask' : 'package'" :size="12" :color="isFormula ? 'var(--accent)' : 'var(--ink-3)'" />
                        {{ isFormula ? 'פורמולה בהכנה אישית' : 'מוצר מדף' }}
                    </span>
                </div>

                <!-- meta line -->
                <div class="small muted" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 10px">
                    <span style="display: inline-flex; align-items: center; gap: 6px">
                        <Icon name="user" :size="13" color="var(--ink-4)" />
                        {{ item.patient }}
                    </span>
                    <span v-if="item.phone" class="num" dir="ltr">{{ item.phone }}</span>
                    <span style="color: var(--line-strong)">·</span>
                    <span style="display: inline-flex; align-items: center; gap: 6px">
                        <Icon name="clock" :size="13" color="var(--ink-4)" />
                        הוקפא {{ item.heldAt }}
                    </span>
                    <template v-if="item.orderId">
                        <span style="color: var(--line-strong)">·</span>
                        <span class="num">{{ item.orderId }}</span>
                    </template>
                    <span style="color: var(--line-strong)">·</span>
                    <span>{{ item.reason }}</span>
                </div>

                <!-- summary -->
                <p
                    :style="{
                        margin: '10px 0 0', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-2)',
                        textWrap: 'pretty',
                    }"
                >
                    {{ summary }}
                    <span class="muted" style="margin-inline-start: 8px">
                        · {{ item.vol }}<template v-if="item.qty > 1"> · ×<span class="num">{{ item.qty }}</span></template>
                    </span>
                </p>
            </div>
        </div>

        <!-- action rail -->
        <div
            :style="{
                width: '200px', flexShrink: 0, padding: '20px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                borderInlineStart: '1px solid var(--line)',
            }"
        >
            <div>
                <div class="field-label" style="margin-bottom: 2px">סה״כ</div>
                <div class="num" style="font-size: 22px; font-weight: 700">₪{{ fmtP(total) }}</div>
            </div>

            <button class="btn btn--ghost btn--sm" style="width: 100%" @click="emit('return', item)">
                <Icon name="cart" :size="14" /> העבר לסל
            </button>

            <button
                v-if="isFormula"
                class="btn btn--primary btn--sm"
                style="width: 100%"
                @click="openPendingFormulaInLab(item)"
            >
                <Icon name="edit" :size="14" color="#fff" /> עריכה במעבדה
            </button>

            <div style="display: flex; gap: 8px">
                <button
                    v-if="item.orderId"
                    class="btn btn--ghost btn--sm"
                    style="flex: 1"
                    @click="viewOrder(item)"
                >
                    צפה
                </button>
                <button
                    class="btn btn--ghost btn--sm"
                    style="flex: 1; color: var(--danger)"
                    @click="emit('remove', item.id)"
                >
                    <Icon name="x" :size="13" color="var(--danger)" /> הסר
                </button>
            </div>
        </div>
    </div>
</template>
