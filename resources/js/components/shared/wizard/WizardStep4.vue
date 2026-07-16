<script setup>
// Wizard Step 4 — Instructions / Directions.
// "מינון יומי" card with 4 icon-columns + notes textarea, plus a separate
// "הוראות לבית המרקחת" card. Embedded into step 3's directions slot (nav hidden).
//
// The prototype mutated the formula via a `setF(patch)` callback; here the same
// patch object is emitted as `patch` and merged by the wizard shell's setF.
import { computed, nextTick, ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import DoseCol from '@/components/shared/wizard/DoseCol.vue';
// Dose rules replace the prototype's window.DOSE_RULES global.
import { DOSE_RULES } from '@/components/shared/wizard/wizard-rules.js';

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
const setDose = (patch) => setF({ dose: { ...(props.formula.dose || {}), ...patch } });

function toggleTag(tag) {
    const cur = props.formula.tags || [];
    setF({ tags: cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag] });
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
    if (e.key === 'Enter') commitTag();
    if (e.key === 'Escape') { tagDraft.value = ''; addingTag.value = false; }
}
const customTags = computed(() => (props.formula.tags || []).filter((t) => !TIMING_TAGS.includes(t)));

// Units allowed for this formula type (was exposed by window.DOSE_RULES).
const unitIds = computed(() => {
    const doseRules = DOSE_RULES[props.formula.typeId];
    return doseRules ? doseRules.units : Object.keys(STEP4_UNIT_LABELS);
});

const freqOpts = [1, 2, 3, 4, 5, 6];

const doseUnitValue = computed(() => props.formula.dose?.unit || unitIds.value[0] || 'ml');

// Textarea border swaps to the accent while focused (prototype used inline handlers).
function focusBorder(e, on) {
    e.target.style.borderColor = on ? 'var(--accent)' : 'var(--line)';
}
</script>

<template>
    <div class="col gap-[16px]">

        <!-- ─── Card 1: מינון יומי ─────────────────────────── -->
        <section class="card p-0 overflow-hidden">

            <!-- Title row -->
            <div class="flex justify-start px-[20px] py-[10px] border-b border-line">
                <span class="text-[13.5px] font-bold text-accent">מינון יומי</span>
            </div>

            <!-- 4-column grid -->
            <div class="dose-grid grid grid-cols-[1fr_1fr_1fr_2fr]">

                <!-- כמות -->
                <DoseCol icon="scale" label="כמות">
                    <input
                        type="number"
                        min="0"
                        class="input num w-full h-[40px] text-center text-[15px] font-semibold box-border"
                        :value="formula.dose?.qty ?? 10"
                        placeholder="כמות"
                        @input="setDose({ qty: +$event.target.value || 0 })"
                    />
                </DoseCol>

                <!-- יחידת מידה -->
                <DoseCol icon="drop" label="יחידת מידה">
                    <select
                        class="select w-full h-[40px] text-[14px] box-border"
                        :value="doseUnitValue"
                        @change="setDose({ unit: $event.target.value })"
                    >
                        <option v-for="u in unitIds" :key="u" :value="u">{{ STEP4_UNIT_LABELS[u] || u }}</option>
                    </select>
                </DoseCol>

                <!-- פעמים ביום -->
                <DoseCol icon="gauge" label="פעמים ביום">
                    <select
                        class="select w-full h-[40px] text-[14px] box-border"
                        :value="formula.dose?.perDay || ''"
                        @change="setDose({ perDay: +$event.target.value || 0 })"
                    >
                        <option value="">אנא בחר/י</option>
                        <option v-for="n in freqOpts" :key="n" :value="n">{{ n }}</option>
                    </select>
                </DoseCol>

                <!-- זמן לקיחה -->
                <DoseCol icon="moon" label="זמן לקיחה" is-last>
                    <div class="flex flex-col gap-[8px]">
                        <div class="flex flex-wrap gap-[6px]">
                            <button
                                v-for="tag in TIMING_TAGS"
                                :key="tag"
                                class="h-[34px] px-[14px] rounded-[999px] border text-[13px] font-semibold cursor-pointer transition-[background-color,border-color,color] duration-[120ms] [font-family:inherit] whitespace-nowrap"
                                :class="(formula.tags || []).includes(tag) ? 'border-[#546b7c] bg-[#546b7c] text-white' : 'border-line-strong bg-surface text-ink-2'"
                                @click="toggleTag(tag)"
                            >{{ tag }}</button>

                            <!-- Custom tags added by the user -->
                            <button
                                v-for="t in customTags"
                                :key="t"
                                title="הסר"
                                class="inline-flex items-center gap-[6px] h-[34px] px-[14px] rounded-[999px] border border-[#546b7c] bg-[#546b7c] text-white text-[13px] font-semibold cursor-pointer [font-family:inherit] whitespace-nowrap"
                                @click="toggleTag(t)"
                            >
                                {{ t }}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>

                            <!-- "אחר" — add a free-text tag -->
                            <input
                                v-if="addingTag"
                                ref="tagInputRef"
                                :value="tagDraft"
                                maxlength="15"
                                placeholder="הקלד ולחץ Enter"
                                class="h-[34px] w-[160px] px-[12px] rounded-[999px] border border-accent outline-none text-[13px] [font-family:inherit] bg-surface text-ink"
                                @input="tagDraft = $event.target.value"
                                @keydown="onTagKeydown"
                                @blur="commitTag"
                            />
                            <button
                                v-else
                                class="inline-flex items-center gap-[5px] h-[34px] px-[14px] rounded-[999px] border border-dashed border-line-strong bg-surface text-ink-3 text-[13px] font-semibold cursor-pointer [font-family:inherit]"
                                @click="startAddingTag"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                                אחר
                            </button>
                        </div>
                        <button
                            :disabled="!hasTags"
                            class="self-start h-[28px] px-[12px] rounded-[999px] border border-line bg-surface-sunk text-[12px] font-medium [font-family:inherit] transition-opacity duration-[120ms]"
                            :class="hasTags ? 'text-ink-3 cursor-pointer opacity-100' : 'text-ink-4 cursor-default opacity-45'"
                            @click="clearTags"
                        >נקה</button>
                    </div>
                </DoseCol>

            </div>

            <!-- הנחיות נוספות עבור המטופל/ת -->
            <div class="border-t border-line pt-[14px] px-[20px] pb-[18px]">
                <div class="mb-[8px] text-[13px] font-semibold text-ink-2 text-right">
                    הנחיות נוספות עבור המטופל/ת
                </div>
                <textarea
                    :value="formula.externalNotes || ''"
                    placeholder="הנחיות נוספות עבור המטופל/ת"
                    class="block w-full min-h-[72px] border border-line rounded-control px-[14px] py-[10px] text-[14px] leading-[1.55] [font-family:inherit] outline-none resize-y bg-surface text-ink box-border"
                    @input="setF({ externalNotes: $event.target.value })"
                    @focus="focusBorder($event, true)"
                    @blur="focusBorder($event, false)"
                />
            </div>
        </section>

        <!-- ─── Card 2: הוראות לבית המרקחת ────────────────── -->
        <section class="card pharmacy-notes-card p-0 overflow-hidden">
            <div class="flex justify-start px-[20px] py-[10px] border-b border-line">
                <span class="text-[13.5px] font-bold text-accent">הוראות לבית המרקחת</span>
            </div>
            <div class="pt-[16px] px-[20px] pb-[20px]">
                <textarea
                    :value="formula.internalNotes || ''"
                    class="block w-full min-h-[110px] border border-line rounded-control px-[14px] py-[10px] text-[14px] leading-[1.55] [font-family:inherit] outline-none resize-y bg-surface text-ink box-border"
                    @input="setF({ internalNotes: $event.target.value })"
                />
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
