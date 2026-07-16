<script setup>
// Selected ingredients (formerly Zone C) — the parts-model table. Preset base
// rows are locked; user-added rows carry an editable parts stepper. Percentages
// and line prices are derived (see wizard-lib reflowParts).
import { ref, computed } from 'vue';
import HerbName from '@/components/shared/mode/HerbName.vue';
import ChipButton from '@/components/shared/wizard/ChipButton.vue';
import HerbInfoModal from '@/components/shared/wizard/HerbInfoModal.vue';
import InteractionWarningPopup from '@/components/shared/wizard/InteractionWarningPopup.vue';
import PartsInput from '@/components/shared/wizard/PartsInput.vue';
import RemoveButton from '@/components/shared/wizard/RemoveButton.vue';
import {
    fmtPct,
    findInteractions,
    matchedDrug,
} from '@/components/shared/wizard/wizard-lib';
import Icon from '@/components/ui/Icon.vue';
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
const totalParts = computed(() =>
    ingredients.value.reduce((s, r) => s + (+r.parts || 0), 0),
);
// Price only counts user-added (non-preset) rows.
const totalPrice = computed(() =>
    ingredients.value
        .filter((r) => !r.preset)
        .reduce((s, r) => {
            const hh = HERBS.find((x) => x.id === r.herbId);

            return s + (hh ? hh.price * (+r.qty || 0) : 0);
        }, 0),
);
const hasNonPreset = computed(() => ingredients.value.some((r) => !r.preset));

// Per-row derived view model.
const rows = computed(() =>
    ingredients.value.map((row, i) => {
        const isPreset = !!row.preset;
        const prevIsPreset =
            i > 0 ? !!ingredients.value[i - 1].preset : isPreset;
        const showAddedHeader =
            !isPreset &&
            prevIsPreset &&
            ingredients.value.some((r) => r.preset);
        const h = HERBS.find((x) => x.id === row.herbId);
        const interactions = findInteractions(row.herbId, props.patientMeds);
        const linePrice = isPreset ? null : h ? h.price * (+row.qty || 0) : 0;
        const warns = (HERB_WARNINGS && HERB_WARNINGS[row.herbId]) || [];

        return {
            row,
            i,
            isPreset,
            showAddedHeader,
            h,
            interactions,
            linePrice,
            warns,
        };
    }),
);

function openInteraction(h, herbId) {
    interactionPopup.value = {
        herb: h,
        drug: matchedDrug(herbId, props.patientMeds),
    };
}
</script>

<template>
    <div class="flex flex-col">
        <!-- Preset base banner -->
        <div
            v-if="presetBase"
            class="flex items-center gap-[10px] border-b border-b-accent bg-[oklch(0.965_0.025_146)] px-[16px] py-[9px]"
        >
            <span
                class="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[50%] bg-accent text-white"
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </span>
            <div class="min-w-0 flex-1">
                <div
                    class="text-[12.5px] leading-[1.3] font-bold text-accent-ink"
                >
                    פורמולת בסיס:
                    <template v-if="presetBase.nameEn">
                        <span class="font-latin italic">
                            {{ presetBase.nameEn }}</span
                        >
                        <span class="font-latin text-[11.5px] text-accent">
                            {{ presetBase.namePinyin }}</span
                        >
                    </template>
                    <template v-else> {{ presetBase.name }}</template>
                </div>
                <div
                    class="mt-[1px] overflow-hidden text-[11.5px] leading-[1.35] text-ellipsis whitespace-nowrap text-accent opacity-85"
                >
                    {{ presetBase.indication }}
                </div>
            </div>
            <button
                class="inline-flex h-[28px] shrink-0 cursor-pointer items-center gap-[5px] rounded-[999px] border border-accent bg-transparent px-[12px] [font-family:inherit] text-[12px] font-semibold text-accent"
                @click="emit('clear-preset')"
            >
                <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                הסר פורמולת בסיס
            </button>
        </div>

        <!-- Empty state -->
        <div
            v-if="ingredients.length === 0"
            class="flex flex-1 flex-col items-center justify-center gap-[8px] p-[32px] text-center text-ink-3"
        >
            <Icon name="leaf" :size="32" color="var(--ink-4)" />
            <div class="font-semibold text-ink-2">עדיין לא נוספו רכיבים</div>
            <div class="small">
                השתמש בשורת החיפוש שלמעלה כדי להוסיף רכיבים.
            </div>
        </div>

        <!-- Table -->
        <div v-else class="flex-1 overflow-y-auto">
            <table
                class="sel-table w-full table-fixed border-collapse"
                dir="ltr"
            >
                <colgroup>
                    <col class="sel-col-num w-[36px]" />
                    <col class="sel-col-name" />
                    <col class="sel-col-parts w-[120px]" />
                    <col class="sel-col-pct w-[78px]" />
                    <col class="sel-col-price w-[96px]" />
                    <col class="sel-col-remove w-[52px]" />
                </colgroup>
                <thead>
                    <tr>
                        <th
                            v-for="(hh, i) in [
                                '#',
                                'שם רכיב',
                                'כמות',
                                'אחוז',
                                'מחיר',
                                'הסר',
                            ]"
                            :key="i"
                            class="sticky top-0 border-b border-line bg-surface-sunk px-[16px] py-[13px] text-center text-[13px] font-semibold tracking-[0.04em] text-ink-3 uppercase"
                            :class="
                                [
                                    'sel-col-num',
                                    'sel-col-name',
                                    'sel-col-parts',
                                    'sel-col-pct',
                                    'sel-col-price',
                                    'sel-col-remove',
                                ][i]
                            "
                        >
                            {{ hh }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="r in rows" :key="r.row.herbId">
                        <tr v-if="r.showAddedHeader">
                            <td
                                colspan="6"
                                class="border-y border-accent bg-[oklch(0.965_0.025_146)] px-[16px] py-[6px] text-center"
                            >
                                <span
                                    class="text-[11px] font-bold tracking-[.1em] text-accent-ink uppercase"
                                >
                                    רכיבים נוספים
                                </span>
                            </td>
                        </tr>
                        <tr
                            :class="[
                                r.i === ingredients.length - 1
                                    ? ''
                                    : 'border-b border-line',
                                r.isPreset
                                    ? 'bg-[oklch(0.99_0.008_146)]'
                                    : 'bg-transparent',
                            ]"
                        >
                            <td
                                class="num muted sel-c-num px-[16px] py-[13px] text-[14px]"
                            >
                                {{ r.i + 1 }}
                            </td>
                            <td
                                class="sel-c-name m-0 rounded-none border-0 border-solid px-[16px] py-[13px] [font-family:Assistant] text-[15px] font-normal"
                            >
                                <div
                                    class="sel-name-inner flex flex-wrap items-center gap-[6px]"
                                >
                                    <div class="sel-name-text min-w-0">
                                        <HerbName
                                            :herb="r.h"
                                            :primary-size="15"
                                            :secondary-size="12.5"
                                            :primary-weight="500"
                                            parallel
                                        />
                                    </div>
                                    <span
                                        class="sel-chips inline-flex items-center gap-[6px]"
                                    >
                                        <ChipButton
                                            v-if="r.warns.length > 0"
                                            variant="warn"
                                            title="אזהרות ומידע"
                                            @click="infoHerb = r.h"
                                        />
                                        <ChipButton
                                            variant="info"
                                            title="מידע על הצמח"
                                            @click="infoHerb = r.h"
                                        />
                                        <ChipButton
                                            v-if="r.interactions.length > 0"
                                            variant="danger"
                                            title="אינטראקציה אפשרית עם תרופה"
                                            @click="
                                                openInteraction(
                                                    r.h,
                                                    r.row.herbId,
                                                )
                                            "
                                        />
                                    </span>
                                </div>
                            </td>
                            <td class="sel-c-parts px-[8px] py-[13px]">
                                <div class="flex items-center justify-center">
                                    <div
                                        v-if="r.isPreset"
                                        class="inline-flex h-[32px] items-center gap-[6px] rounded-control border border-line bg-surface-sunk ps-[14px] pe-[14px] text-[14px] font-bold text-ink-2"
                                    >
                                        {{ r.row.parts }}
                                        <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="shrink-0 text-ink-4"
                                        >
                                            <rect
                                                x="3"
                                                y="11"
                                                width="18"
                                                height="11"
                                                rx="2"
                                                ry="2"
                                            />
                                            <path
                                                d="M7 11V7a5 5 0 0 1 10 0v4"
                                            />
                                        </svg>
                                    </div>
                                    <PartsInput
                                        v-else
                                        :value="r.row.parts ?? 0"
                                        @change="
                                            emit('update', {
                                                idx: r.i,
                                                value: $event,
                                            })
                                        "
                                    />
                                </div>
                            </td>
                            <td
                                class="num sel-c-pct px-[12px] py-[13px] text-center text-[14px] font-semibold text-ink-2"
                            >
                                {{ fmtPct(r.row.pct || 0) }}%
                            </td>
                            <td
                                class="num sel-c-price px-[16px] py-[13px] text-[14px] font-semibold whitespace-nowrap"
                                :class="
                                    r.isPreset
                                        ? 'text-ink-4'
                                        : (+r.row.qty || 0) > 0
                                          ? 'text-ink-2'
                                          : 'text-ink-4'
                                "
                            >
                                {{
                                    r.isPreset
                                        ? '—'
                                        : '₪' + r.linePrice.toFixed(2)
                                }}
                            </td>
                            <td
                                class="sel-c-remove px-[16px] py-[13px] text-center"
                            >
                                <span
                                    v-if="r.isPreset"
                                    class="inline-flex h-[26px] w-[26px] items-center justify-center text-ink-4"
                                >
                                    <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="1.8"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <rect
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="11"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </span>
                                <RemoveButton
                                    v-else
                                    @click="emit('remove', r.i)"
                                />
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot>
                    <tr class="border-t-2 border-t-line bg-surface-sunk">
                        <td class="px-[16px] py-[13px]"></td>
                        <td class="px-[16px] py-[13px]"></td>
                        <td
                            class="num px-[8px] py-[13px] text-center text-[14px] font-bold text-ink"
                        >
                            {{ totalParts }}
                        </td>
                        <td
                            class="num sel-c-pct px-[12px] py-[13px] text-center text-[14px] font-bold text-ink"
                        >
                            100%
                        </td>
                        <td
                            class="num sel-c-price px-[16px] py-[13px] text-[14px] font-bold whitespace-nowrap text-ink"
                        >
                            {{
                                hasNonPreset ? '₪' + totalPrice.toFixed(2) : '—'
                            }}
                        </td>
                        <td class="px-[16px] py-[13px]"></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <HerbInfoModal
            v-if="infoHerb"
            :herb="infoHerb"
            @close="infoHerb = null"
        />
        <InteractionWarningPopup
            v-if="interactionPopup"
            :herb="interactionPopup.herb"
            :drug="interactionPopup.drug"
            @close="interactionPopup = null"
        />
    </div>
</template>
