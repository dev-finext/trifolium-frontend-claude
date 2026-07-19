<script setup>
// ZONE A — Formula identity: treatment style, type picker, volume, name.
import { ref, computed } from 'vue';
import FormulaTypeSwitchConfirmModal from '@/components/shared/mode/FormulaTypeSwitchConfirmModal.vue';
import ModeSwitch from '@/components/shared/mode/ModeSwitch.vue';
import PackageSplitSubsection from '@/components/shared/wizard/PackageSplitSubsection.vue';
import TinctureSubsection from '@/components/shared/wizard/TinctureSubsection.vue';
import TypeCard from '@/components/shared/wizard/TypeCard.vue';
import VolumeSelector from '@/components/shared/wizard/VolumeSelector.vue';
import FieldLabel from '@/components/ui/FieldLabel.vue';
import { FORMULA_TYPES } from '@/data/mock';
import { useModeStore } from '@/stores/mode';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const { mode, isChinese, requestMode } = useModeStore();

// Hide chineseOnly types (e.g. בישול אישי) in Western mode.
const availableTypes = computed(() =>
    FORMULA_TYPES.filter((t) => !t.chineseOnly || isChinese.value),
);

// Pending type-switch awaiting confirmation (set when the user already started
// entering info into the formula).
const pendingType = ref(null);

// Required-name validation — surface an error once the user has touched the
// field and left it empty (the Continue button also blocks on this).
const nameTouched = ref(false);
const nameError = computed(
    () => nameTouched.value && !props.formula.name.trim(),
);

// Changing type resets the volume — units & options differ per type. When the
// practitioner confirms a switch, the components are genuinely cleared so they
// restart from a clean ingredient slate for the new type.
function applyTypeChange(id) {
    const patch = { typeId: id, formulaVolume: null, ingredients: [] };

    // Package split applies to powder/tea only — clear it when switching away.
    if (id !== 'powder' && id !== 'tea') {
        patch.splitPackaging = false;
    }

    props.setF(patch);
}

const hasStarted = computed(() => props.formula.ingredients.length > 0);

function onTypeChange(id) {
    if (id === props.formula.typeId) {
        return;
    }

    if (hasStarted.value) {
        pendingType.value = id;

        return;
    }

    applyTypeChange(id);
}

const pendingLabel = computed(() =>
    pendingType.value
        ? FORMULA_TYPES.find((t) => t.id === pendingType.value)?.heb || ''
        : '',
);
</script>

<template>
    <!-- ── Block 1: Formula TYPE ─────────────────────────────── -->
    <section class="card p-[28px]" id="tf-anchor-type">
        <!-- Treatment style — Chinese ↔ Western. Centered above the type grid. -->
        <div class="mb-[26px] flex items-center justify-center gap-[12px]">
            <span class="text-[13.5px] font-semibold text-ink-2"
                >בחירת סגנון טיפול:</span
            >
            <ModeSwitch :mode="mode" @request="requestMode" />
        </div>

        <div>
            <FieldLabel>סוג פורמולה</FieldLabel>

            <!-- Mobile: a compact dropdown replaces the card grid. Hidden on desktop via CSS. -->
            <div class="ftype-select-wrap">
                <select
                    class="select ftype-select"
                    :value="formula.typeId"
                    aria-label="סוג פורמולה"
                    @change="onTypeChange($event.target.value)"
                >
                    <option
                        v-for="t in availableTypes"
                        :key="t.id"
                        :value="t.id"
                    >
                        {{ t.heb }}{{ t.sub ? ' · ' + t.sub : '' }}
                    </option>
                </select>
            </div>

            <!-- Desktop: the visual card picker. -->
            <div
                class="ftype-grid mt-[4px] grid grid-cols-[repeat(auto-fit,minmax(102px,1fr))] gap-[10px]"
            >
                <TypeCard
                    v-for="t in availableTypes"
                    :key="t.id"
                    :type="t"
                    :selected="formula.typeId === t.id"
                    @click="onTypeChange(t.id)"
                />
            </div>
        </div>

        <VolumeSelector :formula="formula" :set-f="setF" />

        <TinctureSubsection
            v-if="formula.typeId === 'tincture'"
            :formula="formula"
            :set-f="setF"
        />

        <PackageSplitSubsection
            v-if="formula.typeId === 'powder' || formula.typeId === 'tea'"
            :formula="formula"
            :set-f="setF"
        />
    </section>

    <!-- ── Block 2: Formula NAME ─────────────────────────────── -->
    <section class="card mt-[24px] p-[28px]" id="tf-anchor-name">
        <div>
            <label class="field-label"
                >שם הפורמולה — (לא מופיע על המדבקה)
                <span class="text-[var(--danger,#c0392b)]">*</span></label
            >
            <input
                class="input h-[48px] text-[16px]"
                :class="
                    nameError
                        ? 'border-[var(--danger,#c0392b)] shadow-[0_0_0_3px_rgba(192,57,43,0.12)]'
                        : ''
                "
                :value="formula.name"
                :maxlength="15"
                placeholder="לדוגמה: פורמולת שינה"
                :aria-invalid="nameError"
                aria-required="true"
                @input="setF({ name: $event.target.value.slice(0, 15) })"
                @blur="nameTouched = true"
            />

            <div
                v-if="nameError"
                class="small mt-[8px] font-semibold text-[var(--danger,#c0392b)]"
            >
                שם הפורמולה הוא שדה חובה — לא ניתן להמשיך ללא שם.
            </div>
            <div v-else class="small muted mt-[8px]">
                שם הפורמולה הוא לשימוש המטפל בלבד ולא יהיה חשוף ללקוח. לא יוצג
                על המדבקה.
            </div>
        </div>
    </section>

    <FormulaTypeSwitchConfirmModal
        v-if="pendingType"
        :target-label="pendingLabel"
        @confirm="
            applyTypeChange(pendingType);
            pendingType = null;
        "
        @cancel="pendingType = null"
    />
</template>
