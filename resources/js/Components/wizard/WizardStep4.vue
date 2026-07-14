<script setup>
// Wizard Step 4 — Instructions / Directions.
// "מינון יומי" card with 4 icon-columns + notes textarea, plus a separate
// "הוראות לבית המרקחת" card. Embedded into step 3's directions slot (nav hidden).
//
// The prototype mutated the formula via a `setF(patch)` callback; here the same
// patch object is emitted as `patch` and merged by the wizard shell's setF.
import { computed, nextTick, ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import DoseCol from '@/Components/wizard/DoseCol.vue';
// Dose rules replace the prototype's window.DOSE_RULES global.
import { DOSE_RULES } from '@/Components/wizard/wizard-rules.js';

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
    <div class="col gap-16">

        <!-- ─── Card 1: מינון יומי ─────────────────────────── -->
        <section class="card" style="padding: 0; overflow: hidden">

            <!-- Title row -->
            <div style="padding: 10px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: flex-start">
                <span style="font-size: 13.5px; font-weight: 700; color: var(--accent)">מינון יומי</span>
            </div>

            <!-- 4-column grid -->
            <div class="dose-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr 2fr">

                <!-- כמות -->
                <DoseCol icon="scale" label="כמות">
                    <input
                        type="number"
                        min="0"
                        class="input num"
                        :value="formula.dose?.qty ?? 10"
                        placeholder="כמות"
                        style="width: 100%; text-align: center; font-size: 15px; font-weight: 600; height: 40px; box-sizing: border-box"
                        @input="setDose({ qty: +$event.target.value || 0 })"
                    />
                </DoseCol>

                <!-- יחידת מידה -->
                <DoseCol icon="drop" label="יחידת מידה">
                    <select
                        class="select"
                        :value="doseUnitValue"
                        style="width: 100%; height: 40px; font-size: 14px; box-sizing: border-box"
                        @change="setDose({ unit: $event.target.value })"
                    >
                        <option v-for="u in unitIds" :key="u" :value="u">{{ STEP4_UNIT_LABELS[u] || u }}</option>
                    </select>
                </DoseCol>

                <!-- פעמים ביום -->
                <DoseCol icon="gauge" label="פעמים ביום">
                    <select
                        class="select"
                        :value="formula.dose?.perDay || ''"
                        style="width: 100%; height: 40px; font-size: 14px; box-sizing: border-box"
                        @change="setDose({ perDay: +$event.target.value || 0 })"
                    >
                        <option value="">אנא בחר/י</option>
                        <option v-for="n in freqOpts" :key="n" :value="n">{{ n }}</option>
                    </select>
                </DoseCol>

                <!-- זמן לקיחה -->
                <DoseCol icon="moon" label="זמן לקיחה" is-last>
                    <div style="display: flex; flex-direction: column; gap: 8px">
                        <div style="display: flex; flex-wrap: wrap; gap: 6px">
                            <button
                                v-for="tag in TIMING_TAGS"
                                :key="tag"
                                :style="{
                                    height: '34px',
                                    paddingInline: '14px',
                                    borderRadius: '999px',
                                    border: '1px solid ' + ((formula.tags || []).includes(tag) ? '#546b7c' : 'var(--line-strong)'),
                                    background: (formula.tags || []).includes(tag) ? '#546b7c' : 'var(--surface)',
                                    color: (formula.tags || []).includes(tag) ? '#fff' : 'var(--ink-2)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'background-color .12s, border-color .12s, color .12s',
                                    fontFamily: 'inherit',
                                    whiteSpace: 'nowrap',
                                }"
                                @click="toggleTag(tag)"
                            >{{ tag }}</button>

                            <!-- Custom tags added by the user -->
                            <button
                                v-for="t in customTags"
                                :key="t"
                                title="הסר"
                                style="height: 34px; padding-inline: 14px; border-radius: 999px; border: 1px solid #546b7c; background: #546b7c; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; white-space: nowrap; display: inline-flex; align-items: center; gap: 6px"
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
                                style="height: 34px; padding-inline: 12px; border-radius: 999px; border: 1px solid var(--accent); outline: none; font-size: 13px; font-family: inherit; width: 160px; background: #fff; color: var(--ink)"
                                @input="tagDraft = $event.target.value"
                                @keydown="onTagKeydown"
                                @blur="commitTag"
                            />
                            <button
                                v-else
                                style="height: 34px; padding-inline: 14px; border-radius: 999px; border: 1px dashed var(--line-strong); background: var(--surface); color: var(--ink-3); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 5px"
                                @click="startAddingTag"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
                                אחר
                            </button>
                        </div>
                        <button
                            :disabled="!hasTags"
                            :style="{
                                alignSelf: 'flex-start',
                                height: '28px',
                                paddingInline: '12px',
                                borderRadius: '999px',
                                border: '1px solid var(--line)',
                                background: 'var(--surface-sunk)',
                                color: hasTags ? 'var(--ink-3)' : 'var(--ink-4)',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: hasTags ? 'pointer' : 'default',
                                fontFamily: 'inherit',
                                opacity: hasTags ? 1 : 0.45,
                                transition: 'opacity .12s',
                            }"
                            @click="clearTags"
                        >נקה</button>
                    </div>
                </DoseCol>

            </div>

            <!-- הנחיות נוספות עבור המטופל/ת -->
            <div style="border-top: 1px solid var(--line); padding: 14px 20px 18px">
                <div style="font-size: 13px; font-weight: 600; color: var(--ink-2); text-align: right; margin-bottom: 8px">
                    הנחיות נוספות עבור המטופל/ת
                </div>
                <textarea
                    :value="formula.externalNotes || ''"
                    placeholder="הנחיות נוספות עבור המטופל/ת"
                    style="display: block; width: 100%; min-height: 72px; border: 1px solid var(--line); border-radius: var(--r-control); padding: 10px 14px; font-size: 14px; line-height: 1.55; font-family: inherit; outline: none; resize: vertical; background: #fff; color: var(--ink); box-sizing: border-box"
                    @input="setF({ externalNotes: $event.target.value })"
                    @focus="focusBorder($event, true)"
                    @blur="focusBorder($event, false)"
                />
            </div>
        </section>

        <!-- ─── Card 2: הוראות לבית המרקחת ────────────────── -->
        <section class="card pharmacy-notes-card" style="padding: 0; overflow: hidden">
            <div style="padding: 10px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: flex-start">
                <span style="font-size: 13.5px; font-weight: 700; color: var(--accent)">הוראות לבית המרקחת</span>
            </div>
            <div style="padding: 16px 20px 20px">
                <textarea
                    :value="formula.internalNotes || ''"
                    style="display: block; width: 100%; min-height: 110px; border: 1px solid var(--line); border-radius: var(--r-control); padding: 10px 14px; font-size: 14px; line-height: 1.55; font-family: inherit; outline: none; resize: vertical; background: #fff; color: var(--ink); box-sizing: border-box"
                    @input="setF({ internalNotes: $event.target.value })"
                />
            </div>
        </section>

        <!-- Nav — hidden when embedded in step 3 -->
        <div v-if="!embedded" style="display: flex; justify-content: space-between">
            <button class="btn btn--ghost" @click="emit('back')">
                <Icon name="arrow_right" :size="16" /> חזור
            </button>
            <button class="btn btn--primary" style="padding-inline: 28px" @click="emit('next')">
                המשך לאישור
                <Icon name="arrow_left" :size="16" />
            </button>
        </div>
    </div>
</template>
