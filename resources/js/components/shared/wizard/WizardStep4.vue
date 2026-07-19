<script setup>
// Wizard Step 4 — Instructions / Directions.
// "מינון יומי" card with 4 icon-columns + notes textarea, plus a separate
// "הוראות לבית המרקחת" card. Embedded into step 3's directions slot (nav hidden).
//
// The prototype mutated the formula via a `setF(patch)` callback; here the same
// patch object is emitted as `patch` and merged by the wizard shell's setF.
import { computed, nextTick, ref } from 'vue';
import DoseCol from '@/components/shared/wizard/DoseCol.vue';
// Dose rules replace the prototype's window.DOSE_RULES global.
import { DOSE_RULES } from '@/components/shared/wizard/wizard-rules.js';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    formula: { type: Object, required: true },
    /** Vestigial prop kept for API parity with the prototype (unused there too). */
    showDose: { type: Boolean, default: true },
    /** When embedded in step 3, the component hides its own nav bar. */
    embedded: { type: Boolean, default: false },
});

const emit = defineEmits(['patch', 'back', 'next']);

// Unit labels (used by both the select and legacy callers).
const STEP4_UNIT_LABELS = {
    drops: 'טיפות',
    ml: 'מ״ל',
    capsules: 'כמוסות',
    grams: 'גרם',
    spoons: 'כפיות',
    cups: 'כוסות',
    apps: 'מריחות',
};

// Timing pill-tags shown in the זמן לקיחה column.
const TIMING_TAGS = ['לפני ארוחה', 'עם הארוחה', 'אחרי הארוחה', 'על בטן ריקה'];

const setF = (patch) => emit('patch', patch);
const setDose = (patch) =>
    setF({ dose: { ...(props.formula.dose || {}), ...patch } });

function toggleTag(tag) {
    const cur = props.formula.tags || [];
    setF({
        tags: cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag],
    });
}
function clearTags() {
    setF({ tags: [] });
}
const hasTags = computed(() => (props.formula.tags || []).length > 0);

// Custom tag state.
const addingTag = ref(false);
const tagDraft = ref('');
const tagInputRef = ref(null);

function startAddingTag() {
    addingTag.value = true;
    nextTick(() => tagInputRef.value && tagInputRef.value.focus());
}
function commitTag() {
    const v = tagDraft.value.trim();

    if (v && !(props.formula.tags || []).includes(v)) {
        setF({ tags: [...(props.formula.tags || []), v] });
    }

    tagDraft.value = '';
    addingTag.value = false;
}
function onTagKeydown(e) {
    if (e.key === 'Enter') {
        commitTag();
    }

    if (e.key === 'Escape') {
        tagDraft.value = '';
        addingTag.value = false;
    }
}
const customTags = computed(() =>
    (props.formula.tags || []).filter((t) => !TIMING_TAGS.includes(t)),
);

// Units allowed for this formula type (was exposed by window.DOSE_RULES).
const unitIds = computed(() => {
    const doseRules = DOSE_RULES[props.formula.typeId];

    return doseRules ? doseRules.units : Object.keys(STEP4_UNIT_LABELS);
});

const freqOpts = [1, 2, 3, 4, 5, 6];

const doseUnitValue = computed(
    () => props.formula.dose?.unit || unitIds.value[0] || 'ml',
);

// Textarea border swaps to the accent while focused (prototype used inline handlers).
function focusBorder(e, on) {
    e.target.style.borderColor = on ? 'var(--accent)' : 'var(--line)';
}
</script>

<template>
    <div class="col gap-[16px]">
        <!-- ─── Card 1: מינון יומי ─────────────────────────── -->
        <section class="card overflow-hidden p-0">
            <!-- Title row -->
            <div
                class="flex justify-start border-b border-line px-[20px] py-[10px]"
            >
                <span class="text-[13.5px] font-bold text-accent"
                    >מינון יומי</span
                >
            </div>

            <!-- 4-column grid -->
            <div class="dose-grid grid grid-cols-[1fr_1fr_1fr_2fr]">
                <!-- כמות -->
                <DoseCol icon="scale" label="כמות">
                    <input
                        type="number"
                        min="0"
                        class="input num box-border h-[40px] w-full text-center text-[15px] font-semibold"
                        :value="formula.dose?.qty ?? 10"
                        placeholder="כמות"
                        @input="setDose({ qty: +$event.target.value || 0 })"
                    />
                </DoseCol>

                <!-- יחידת מידה -->
                <DoseCol icon="drop" label="יחידת מידה">
                    <select
                        class="select box-border h-[40px] w-full text-[14px]"
                        :value="doseUnitValue"
                        @change="setDose({ unit: $event.target.value })"
                    >
                        <option v-for="u in unitIds" :key="u" :value="u">
                            {{ STEP4_UNIT_LABELS[u] || u }}
                        </option>
                    </select>
                </DoseCol>

                <!-- פעמים ביום -->
                <DoseCol icon="gauge" label="פעמים ביום">
                    <select
                        class="select box-border h-[40px] w-full text-[14px]"
                        :value="formula.dose?.perDay || ''"
                        @change="setDose({ perDay: +$event.target.value || 0 })"
                    >
                        <option value="">אנא בחר/י</option>
                        <option v-for="n in freqOpts" :key="n" :value="n">
                            {{ n }}
                        </option>
                    </select>
                </DoseCol>

                <!-- זמן לקיחה -->
                <DoseCol icon="moon" label="זמן לקיחה" is-last>
                    <div class="flex flex-col gap-[8px]">
                        <div class="flex flex-wrap gap-[6px]">
                            <button
                                v-for="tag in TIMING_TAGS"
                                :key="tag"
                                class="h-[34px] cursor-pointer rounded-[999px] border px-[14px] [font-family:inherit] text-[13px] font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-[120ms]"
                                :class="
                                    (formula.tags || []).includes(tag)
                                        ? 'border-[#546b7c] bg-[#546b7c] text-white'
                                        : 'border-line-strong bg-surface text-ink-2'
                                "
                                @click="toggleTag(tag)"
                            >
                                {{ tag }}
                            </button>

                            <!-- Custom tags added by the user -->
                            <button
                                v-for="t in customTags"
                                :key="t"
                                title="הסר"
                                class="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-[999px] border border-[#546b7c] bg-[#546b7c] px-[14px] [font-family:inherit] text-[13px] font-semibold whitespace-nowrap text-white"
                                @click="toggleTag(t)"
                            >
                                {{ t }}
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>

                            <!-- "אחר" — add a free-text tag -->
                            <input
                                v-if="addingTag"
                                ref="tagInputRef"
                                :value="tagDraft"
                                maxlength="15"
                                placeholder="הקלד ולחץ Enter"
                                class="h-[34px] w-[160px] rounded-[999px] border border-accent bg-surface px-[12px] [font-family:inherit] text-[13px] text-ink outline-none"
                                @input="tagDraft = $event.target.value"
                                @keydown="onTagKeydown"
                                @blur="commitTag"
                            />
                            <button
                                v-else
                                class="inline-flex h-[34px] cursor-pointer items-center gap-[5px] rounded-[999px] border border-dashed border-line-strong bg-surface px-[14px] [font-family:inherit] text-[13px] font-semibold text-ink-3"
                                @click="startAddingTag"
                            >
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2.4"
                                    stroke-linecap="round"
                                >
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                אחר
                            </button>
                        </div>
                        <button
                            :disabled="!hasTags"
                            class="h-[28px] self-start rounded-[999px] border border-line bg-surface-sunk px-[12px] [font-family:inherit] text-[12px] font-medium transition-opacity duration-[120ms]"
                            :class="
                                hasTags
                                    ? 'cursor-pointer text-ink-3 opacity-100'
                                    : 'cursor-default text-ink-4 opacity-45'
                            "
                            @click="clearTags"
                        >
                            נקה
                        </button>
                    </div>
                </DoseCol>
            </div>
        </section>

        <!-- ─── Card 2: הוראות לבית המרקחת (internal — above the patient area) ── -->
        <section class="card pharmacy-notes-card overflow-hidden p-0">
            <div
                class="flex items-baseline justify-between gap-[10px] border-b border-line px-[20px] py-[10px]"
            >
                <span class="text-[13.5px] font-bold text-accent"
                    >הוראות לבית המרקחת</span
                >
                <span class="text-[11.5px] text-ink-3"
                    >לשימוש פנימי — לא מוצג למטופל/ת</span
                >
            </div>
            <div class="px-[20px] pt-[16px] pb-[20px]">
                <textarea
                    :value="formula.internalNotes || ''"
                    class="box-border block min-h-[110px] w-full resize-y rounded-control border border-line bg-surface px-[14px] py-[10px] [font-family:inherit] text-[14px] leading-[1.55] text-ink outline-none"
                    @input="setF({ internalNotes: $event.target.value })"
                />
            </div>
        </section>

        <!-- ─── Card 3: הנחיות למטופל/ת — CUSTOMER-FACING zone. Everything
             here reaches the patient (label name + printed directions), so the
             card is visually flagged as such: accent frame + header badge. ── -->
        <section class="card overflow-hidden border-[1.5px] border-accent p-0">
            <div
                class="flex flex-wrap items-center justify-between gap-[8px] border-b border-accent-tint-strong bg-accent-tint px-[20px] py-[10px]"
            >
                <span
                    class="flex items-center gap-[8px] text-[13.5px] font-bold text-accent-ink"
                >
                    <Icon name="eye" :size="15" color="var(--accent)" />
                    הנחיות למטופל/ת
                </span>
                <span
                    class="rounded-[999px] bg-accent px-[10px] py-[3px] text-[11px] font-bold text-white"
                    >מוצג למטופל/ת — לא לשימוש פנימי</span
                >
            </div>

            <div class="col gap-[16px] px-[20px] pt-[16px] pb-[20px]">
                <!-- The name printed on the label sticker -->
                <div>
                    <label class="field-label" for="tf-label-name"
                        >שם הפורמולה למדבקה</label
                    >
                    <input
                        id="tf-label-name"
                        class="input h-[44px]"
                        :value="formula.labelName || ''"
                        :maxlength="15"
                        @input="
                            setF({
                                labelName: $event.target.value.slice(0, 15),
                            })
                        "
                    />
                    <div class="small muted mt-[8px]">
                        לתשומת ליבך: שם הפורמולה מודפס על המדבקה ועל גבי
                        החשבונית. אין לכתוב בשם הפורמולה כל התוויה רפואית.
                    </div>
                </div>

                <!-- הנחיות נוספות עבור המטופל/ת -->
                <div>
                    <div
                        class="mb-[8px] text-right text-[13px] font-semibold text-ink-2"
                    >
                        הנחיות נוספות עבור המטופל/ת
                    </div>
                    <textarea
                        :value="formula.externalNotes || ''"
                        placeholder="הנחיות נוספות עבור המטופל/ת"
                        class="box-border block min-h-[72px] w-full resize-y rounded-control border border-line bg-surface px-[14px] py-[10px] [font-family:inherit] text-[14px] leading-[1.55] text-ink outline-none"
                        @input="setF({ externalNotes: $event.target.value })"
                        @focus="focusBorder($event, true)"
                        @blur="focusBorder($event, false)"
                    />
                </div>
            </div>
        </section>

        <!-- Nav — hidden when embedded in step 3 -->
        <div v-if="!embedded" class="flex justify-between">
            <button class="btn btn--ghost" @click="emit('back')">
                <Icon name="arrow_right" :size="16" /> חזור
            </button>
            <button class="btn btn--primary px-[28px]" @click="emit('next')">
                המשך לאישור
                <Icon name="arrow_left" :size="16" />
            </button>
        </div>
    </div>
</template>
