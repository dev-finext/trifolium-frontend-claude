<script setup>
// VOLUME SELECTOR — appears in Zone A after a formula type is chosen. Drives
// whether Zone B/C is unlocked, and the bottle chart's "physical volume" line.
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import VolumeChangeConfirm from '@/Components/wizard/VolumeChangeConfirm.vue';
import { VOLUME_RULES } from '@/Components/wizard/wizard-rules';
import { reflowParts } from '@/Components/wizard/wizard-lib';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const rules = computed(() => VOLUME_RULES[props.formula.typeId]);
const current = computed(() => props.formula.formulaVolume);
const isPreset = computed(() => current.value != null && rules.value && rules.value.options.includes(current.value));

// Local UI state (initialised once from the incoming formula, like the source).
const initOther = !!(rules.value && rules.value.allowOther && current.value != null && !isPreset.value);
const otherMode = ref(initOther);
const otherDraft = ref(initOther ? String(current.value) : '');
const editMode = ref(current.value == null);
const pending = ref(null); // candidate value awaiting confirmation (kept for parity)

const minOther = computed(() => (rules.value && rules.value.min) || 1);
const stepOther = computed(() => (rules.value && rules.value.step) || 1);

function writeVolume(v) {
    const patch = { formulaVolume: v };
    if (props.formula.typeId === 'tincture') patch.tinctureVolume = v;
    if (props.formula.typeId === 'capsule') { patch.capsuleCount = v; patch.capsuleMultiPacks = false; }
    // Chinese: amounts come from parts ÷ Σparts × volume. Western: from pct.
    patch.ingredients = reflowParts(props.formula.ingredients, v);
    props.setF(patch);
    editMode.value = false;
}
function requestVolume(v) {
    if (v === current.value) { editMode.value = false; return; }
    writeVolume(v);
}

// "Other/custom" volume validation.
const otherNumeric = computed(() => +otherDraft.value);
const otherTooLow = computed(() => otherMode.value && otherDraft.value !== '' && otherNumeric.value < minOther.value);
const otherBadStep = computed(() => otherMode.value && otherDraft.value !== '' && stepOther.value > 1 && otherNumeric.value % stepOther.value !== 0);
const otherInvalid = computed(() => otherTooLow.value || otherBadStep.value);

function commitOther() {
    const v = +otherDraft.value;
    if (v >= minOther.value && (stepOther.value <= 1 || v % stepOther.value === 0)) requestVolume(v);
}

// Mobile dropdown current value.
const selectValue = computed(() => {
    if (otherMode.value) return '__other__';
    return current.value != null && rules.value.options.includes(current.value) ? String(current.value) : '';
});
function onSelect(v) {
    if (v === '__other__') { otherMode.value = true; }
    else if (v !== '') { otherMode.value = false; requestVolume(+v); }
}
</script>

<template>
    <div v-if="!rules"></div>

    <!-- Confirmation pill (volume already chosen, not editing) -->
    <div v-else-if="current != null && !editMode" style="margin-top: 14px">
        <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px 4px 6px; background: var(--accent-tint); border: 1px solid var(--accent); border-radius: 999px; font-size: 13px; color: var(--accent-ink); font-weight: 600; line-height: 1.4">
            <Icon name="check" :size="12" color="var(--accent)" />
            נפח: <span class="num">{{ current }}</span> {{ rules.unit }}
            <button
                aria-label="ערוך נפח"
                style="border: none; background: transparent; color: var(--accent); cursor: pointer; display: inline-flex; align-items: center; padding: 0; margin-inline-start: 2px"
                @click="editMode = true"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 4l6 6-10 10H4v-6L14 4z" />
                </svg>
            </button>
        </div>
        <VolumeChangeConfirm
            v-if="pending != null"
            :unit="rules.unit"
            :new-volume="pending"
            @confirm="writeVolume(pending); pending = null"
            @cancel="pending = null"
        />
    </div>

    <!-- Edit / initial-pick mode -->
    <div v-else style="margin-top: 14px" id="tf-anchor-volume">
        <!-- Desktop: volume pills. On mobile a dropdown (.vol-select-wrap) replaces them. -->
        <div class="vol-pills" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center">
            <button
                v-for="n in rules.options" :key="n"
                :style="{
                    height: '32px',
                    padding: '0 12px',
                    borderRadius: '999px',
                    border: '1px solid ' + (!otherMode && current === n ? 'var(--ink)' : 'var(--line-strong)'),
                    background: !otherMode && current === n ? 'var(--ink)' : 'var(--surface)',
                    color: !otherMode && current === n ? '#fff' : 'var(--ink-2)',
                    fontSize: '13px',
                    fontWeight: !otherMode && current === n ? 600 : 500,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-latin)',
                    transition: 'background-color .12s, border-color .12s',
                }"
                @click="otherMode = false; requestVolume(n)"
            >
                <span class="num">{{ n }}</span>&nbsp;<span style="font-family: inherit; font-size: 12px">{{ rules.unit }}</span>
            </button>

            <button
                v-if="rules.allowOther"
                :style="{
                    height: '32px',
                    padding: '0 14px',
                    borderRadius: '999px',
                    border: '1px solid ' + (otherMode ? 'var(--ink)' : 'var(--line-strong)'),
                    background: otherMode ? 'var(--ink)' : 'var(--surface)',
                    color: otherMode ? '#fff' : 'var(--ink-2)',
                    fontSize: '13px',
                    fontWeight: otherMode ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'background-color .12s, border-color .12s',
                }"
                @click="otherMode = true"
            >אחר</button>

            <!-- Shared "other/custom volume" editor (desktop, inline in the pill row) -->
            <div v-if="otherMode" style="display: inline-flex; align-items: center; gap: 6px">
                <div style="position: relative">
                    <input
                        type="number"
                        :min="minOther"
                        :step="stepOther"
                        v-model="otherDraft"
                        :placeholder="stepOther > 1 ? `${minOther}, ${minOther + stepOther}…` : `${minOther}+`"
                        class="num no-spin"
                        aria-label="נפח אחר"
                        :aria-invalid="otherInvalid"
                        :aria-describedby="otherInvalid ? 'vol-other-error' : undefined"
                        :style="{
                            width: '96px', height: '32px', borderRadius: 'var(--r-control)',
                            border: '1px solid ' + (otherInvalid ? 'var(--danger)' : 'var(--line-strong)'),
                            padding: '0 38px 0 10px', background: 'var(--surface)', fontSize: '13px', textAlign: 'center', outline: 'none',
                        }"
                    />
                    <span style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--ink-3); pointer-events: none">{{ rules.unit }}</span>
                </div>
                <button
                    :disabled="otherInvalid || otherDraft === ''"
                    class="btn btn--primary"
                    :style="{ height: '32px', paddingInline: '14px', fontSize: '12.5px', opacity: (otherInvalid || otherDraft === '') ? 0.4 : 1, cursor: (otherInvalid || otherDraft === '') ? 'not-allowed' : 'pointer' }"
                    @click="commitOther"
                >אישור</button>
            </div>
        </div>

        <!-- Mobile: a single dropdown replaces the pill row (hidden on desktop). -->
        <div class="vol-select-wrap">
            <select
                class="select vol-select"
                :value="selectValue"
                aria-label="נפח פורמולה"
                @change="onSelect($event.target.value)"
            >
                <option value="" disabled>בחר נפח…</option>
                <option v-for="n in rules.options" :key="n" :value="n">{{ n }} {{ rules.unit }}</option>
                <option v-if="rules.allowOther" value="__other__">אחר…</option>
            </select>
            <div v-if="otherMode" style="margin-top: 10px">
                <div style="display: inline-flex; align-items: center; gap: 6px">
                    <div style="position: relative">
                        <input
                            type="number"
                            :min="minOther"
                            :step="stepOther"
                            v-model="otherDraft"
                            :placeholder="stepOther > 1 ? `${minOther}, ${minOther + stepOther}…` : `${minOther}+`"
                            class="num no-spin"
                            :style="{
                                width: '96px', height: '32px', borderRadius: 'var(--r-control)',
                                border: '1px solid ' + (otherInvalid ? 'var(--danger)' : 'var(--line-strong)'),
                                padding: '0 38px 0 10px', background: 'var(--surface)', fontSize: '13px', textAlign: 'center', outline: 'none',
                            }"
                        />
                        <span style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); font-size: 11px; color: var(--ink-3); pointer-events: none">{{ rules.unit }}</span>
                    </div>
                    <button
                        :disabled="otherInvalid || otherDraft === ''"
                        class="btn btn--primary"
                        :style="{ height: '32px', paddingInline: '14px', fontSize: '12.5px', opacity: (otherInvalid || otherDraft === '') ? 0.4 : 1, cursor: (otherInvalid || otherDraft === '') ? 'not-allowed' : 'pointer' }"
                        @click="commitOther"
                    >אישור</button>
                </div>
            </div>
        </div>

        <div
            v-if="current == null && !otherInvalid"
            style="display: flex; align-items: center; gap: 7px; margin-top: 9px; font-size: 12.5px; font-weight: 600; color: var(--danger)"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 7v6" />
                <path d="M12 17h.01" />
                <circle cx="12" cy="12" r="9.5" stroke-width="1.6" />
            </svg>
            נא לבחור נפח פורמולה
        </div>

        <div v-if="otherInvalid" id="vol-other-error" role="alert" style="font-size: 12px; color: var(--danger); margin-top: 6px">
            <template v-if="otherBadStep">הערך חייב להיות בכפולות של <span class="num">{{ stepOther }}</span> {{ rules.unit }}</template>
            <template v-else>כמות מינימלית היא <span class="num">{{ minOther }}</span> {{ rules.unit }}</template>
        </div>

        <VolumeChangeConfirm
            v-if="pending != null"
            :unit="rules.unit"
            :new-volume="pending"
            @confirm="writeVolume(pending); pending = null"
            @cancel="pending = null"
        />
    </div>
</template>
