<script setup>
// Selected ingredients (formerly Zone C) — the parts-model table. Preset base
// rows are locked; user-added rows carry an editable parts stepper. Percentages
// and line prices are derived (see wizard-lib reflowParts).
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import HerbName from '@/Components/mode/HerbName.vue';
import ChipButton from '@/Components/wizard/ChipButton.vue';
import PartsInput from '@/Components/wizard/PartsInput.vue';
import RemoveButton from '@/Components/wizard/RemoveButton.vue';
import HerbInfoModal from '@/Components/wizard/HerbInfoModal.vue';
import InteractionWarningPopup from '@/Components/wizard/InteractionWarningPopup.vue';
import { fmtPct, findInteractions, matchedDrug } from '@/Components/wizard/wizard-lib';
import { HERBS, HERB_WARNINGS } from '@/data/mock';

const props = defineProps({
    formula: { type: Object, required: true },
    ftype: { type: Object, default: null },
    totalPct: { type: Number, default: 0 },
    patientMeds: { type: String, default: '' },
    presetBase: { type: Object, default: null },
});
const emit = defineEmits(['update', 'remove', 'clear-preset']);

const infoHerb = ref(null);
const interactionPopup = ref(null);

const ingredients = computed(() => props.formula.ingredients);
const totalParts = computed(() => ingredients.value.reduce((s, r) => s + (+r.parts || 0), 0));
// Price only counts user-added (non-preset) rows.
const totalPrice = computed(() => ingredients.value.filter((r) => !r.preset).reduce((s, r) => {
    const hh = HERBS.find((x) => x.id === r.herbId);
    return s + (hh ? hh.price * (+r.qty || 0) : 0);
}, 0));
const hasNonPreset = computed(() => ingredients.value.some((r) => !r.preset));

// Per-row derived view model.
const rows = computed(() => ingredients.value.map((row, i) => {
    const isPreset = !!row.preset;
    const prevIsPreset = i > 0 ? !!ingredients.value[i - 1].preset : isPreset;
    const showAddedHeader = !isPreset && prevIsPreset && ingredients.value.some((r) => r.preset);
    const h = HERBS.find((x) => x.id === row.herbId);
    const interactions = findInteractions(row.herbId, props.patientMeds);
    const linePrice = isPreset ? null : (h ? h.price * (+row.qty || 0) : 0);
    const warns = (HERB_WARNINGS && HERB_WARNINGS[row.herbId]) || [];
    return { row, i, isPreset, showAddedHeader, h, interactions, linePrice, warns };
}));

function openInteraction(h, herbId) {
    interactionPopup.value = { herb: h, drug: matchedDrug(herbId, props.patientMeds) };
}
</script>

<template>
    <div style="display: flex; flex-direction: column">
        <!-- Preset base banner -->
        <div
            v-if="presetBase"
            style="display: flex; align-items: center; gap: 10px; padding: 9px 16px; background: oklch(0.965 0.025 146); border-bottom: 1px solid var(--accent)"
        >
            <span style="width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; background: var(--accent); color: #fff; display: inline-flex; align-items: center; justify-content: center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </span>
            <div style="flex: 1; min-width: 0">
                <div style="font-size: 12.5px; font-weight: 700; color: var(--accent-ink); line-height: 1.3">
                    פורמולת בסיס:
                    <template v-if="presetBase.nameEn">
                        <span style="font-family: var(--font-latin); font-style: italic"> {{ presetBase.nameEn }}</span>
                        <span style="font-size: 11.5px; color: var(--accent); font-family: var(--font-latin)"> {{ presetBase.namePinyin }}</span>
                    </template>
                    <template v-else> {{ presetBase.name }}</template>
                </div>
                <div style="font-size: 11.5px; color: var(--accent); opacity: 0.85; line-height: 1.35; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                    {{ presetBase.indication }}
                </div>
            </div>
            <button
                style="display: inline-flex; align-items: center; gap: 5px; height: 28px; padding-inline: 12px; border: 1px solid var(--accent); border-radius: 999px; background: transparent; color: var(--accent); font-size: 12px; font-weight: 600; cursor: pointer; flex-shrink: 0; font-family: inherit"
                @click="emit('clear-preset')"
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                הסר פורמולת בסיס
            </button>
        </div>

        <!-- Empty state -->
        <div
            v-if="ingredients.length === 0"
            style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 32px; text-align: center; color: var(--ink-3)"
        >
            <Icon name="leaf" :size="32" color="var(--ink-4)" />
            <div style="font-weight: 600; color: var(--ink-2)">עדיין לא נוספו רכיבים</div>
            <div class="small">השתמש בשורת החיפוש שלמעלה כדי להוסיף רכיבים.</div>
        </div>

        <!-- Table -->
        <div v-else style="flex: 1; overflow-y: auto">
            <table class="sel-table" dir="ltr" style="width: 100%; border-collapse: collapse; table-layout: fixed">
                <colgroup>
                    <col class="sel-col-num" style="width: 36px" />
                    <col class="sel-col-name" />
                    <col class="sel-col-parts" style="width: 120px" />
                    <col class="sel-col-pct" style="width: 78px" />
                    <col class="sel-col-price" style="width: 96px" />
                    <col class="sel-col-remove" style="width: 52px" />
                </colgroup>
                <thead>
                    <tr>
                        <th
                            v-for="(hh, i) in ['#', 'שם רכיב', 'כמות', 'אחוז', 'מחיר', 'הסר']"
                            :key="i"
                            :class="['sel-col-num', 'sel-col-name', 'sel-col-parts', 'sel-col-pct', 'sel-col-price', 'sel-col-remove'][i]"
                            style="text-align: center; padding: 13px 16px; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ink-3); font-weight: 600; border-bottom: 1px solid var(--line); background: var(--surface-sunk); position: sticky; top: 0"
                        >{{ hh }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="r in rows" :key="r.row.herbId">
                        <tr v-if="r.showAddedHeader">
                            <td colspan="6" style="padding: 6px 16px; background: oklch(0.965 0.025 146); border-top: 1px solid var(--accent); border-bottom: 1px solid var(--accent); text-align: center">
                                <span style="font-size: 11px; font-weight: 700; color: var(--accent-ink); text-transform: uppercase; letter-spacing: .1em">
                                    רכיבים נוספים
                                </span>
                            </td>
                        </tr>
                        <tr :style="{ borderBottom: r.i === ingredients.length - 1 ? 'none' : '1px solid var(--line)', background: r.isPreset ? 'oklch(0.99 0.008 146)' : 'transparent' }">
                            <td class="num muted sel-c-num" style="padding: 13px 16px; font-size: 14px">{{ r.i + 1 }}</td>
                            <td class="sel-c-name" style="padding: 13px 16px; margin: 0; border-style: solid; border-radius: 0; border-width: 0; font-size: 15px; font-weight: 400; font-family: Assistant">
                                <div class="sel-name-inner" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap">
                                    <div class="sel-name-text" style="min-width: 0">
                                        <HerbName :herb="r.h" :primary-size="15" :secondary-size="12.5" :primary-weight="500" parallel />
                                    </div>
                                    <span class="sel-chips" style="display: inline-flex; align-items: center; gap: 6px">
                                        <ChipButton v-if="r.warns.length > 0" variant="warn" title="אזהרות ומידע" @click="infoHerb = r.h" />
                                        <ChipButton variant="info" title="מידע על הצמח" @click="infoHerb = r.h" />
                                        <ChipButton v-if="r.interactions.length > 0" variant="danger" title="אינטראקציה אפשרית עם תרופה" @click="openInteraction(r.h, r.row.herbId)" />
                                    </span>
                                </div>
                            </td>
                            <td class="sel-c-parts" style="padding: 13px 8px">
                                <div style="display: flex; align-items: center; justify-content: center">
                                    <div v-if="r.isPreset" style="display: inline-flex; align-items: center; gap: 6px; height: 32px; padding-inline: 14px; background: var(--surface-sunk); border: 1px solid var(--line); border-radius: var(--r-control); font-size: 14px; font-weight: 700; color: var(--ink-2)">
                                        {{ r.row.parts }}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--ink-4); flex-shrink: 0">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </div>
                                    <PartsInput v-else :value="r.row.parts ?? 0" @change="emit('update', { idx: r.i, value: $event })" />
                                </div>
                            </td>
                            <td class="num sel-c-pct" style="padding: 13px 12px; font-size: 14px; font-weight: 600; text-align: center; color: var(--ink-2)">
                                {{ fmtPct(r.row.pct || 0) }}%
                            </td>
                            <td class="num sel-c-price" :style="{ padding: '13px 16px', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', color: r.isPreset ? 'var(--ink-4)' : ((+r.row.qty || 0) > 0 ? 'var(--ink-2)' : 'var(--ink-4)') }">
                                {{ r.isPreset ? '—' : '₪' + r.linePrice.toFixed(2) }}
                            </td>
                            <td class="sel-c-remove" style="padding: 13px 16px; text-align: center">
                                <span v-if="r.isPreset" style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; color: var(--ink-4)">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <RemoveButton v-else @click="emit('remove', r.i)" />
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot>
                    <tr style="border-top: 2px solid var(--line); background: var(--surface-sunk)">
                        <td style="padding: 13px 16px"></td>
                        <td style="padding: 13px 16px"></td>
                        <td class="num" style="padding: 13px 8px; font-size: 14px; font-weight: 700; text-align: center; color: var(--ink)">
                            {{ totalParts }}
                        </td>
                        <td class="num sel-c-pct" style="padding: 13px 12px; font-size: 14px; font-weight: 700; text-align: center; color: var(--ink)">
                            100%
                        </td>
                        <td class="num sel-c-price" style="padding: 13px 16px; font-size: 14px; font-weight: 700; white-space: nowrap; color: var(--ink)">
                            {{ hasNonPreset ? '₪' + totalPrice.toFixed(2) : '—' }}
                        </td>
                        <td style="padding: 13px 16px"></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <HerbInfoModal v-if="infoHerb" :herb="infoHerb" @close="infoHerb = null" />
        <InteractionWarningPopup
            v-if="interactionPopup"
            :herb="interactionPopup.herb"
            :drug="interactionPopup.drug"
            @close="interactionPopup = null"
        />
    </div>
</template>
