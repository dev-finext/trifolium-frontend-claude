<script setup>
// VOLUME SELECTOR — appears in Zone A after a formula type is chosen. Drives
// whether Zone B/C is unlocked. The practitioner picks from the preset volume
// options only (no custom "other" volume — the pharmacy compounds set sizes).
import { ref, computed } from 'vue';
import VolumeChangeConfirm from '@/components/shared/wizard/VolumeChangeConfirm.vue';
import { reflowParts } from '@/components/shared/wizard/wizard-lib';
import { VOLUME_RULES } from '@/components/shared/wizard/wizard-rules';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const rules = computed(() => VOLUME_RULES[props.formula.typeId]);
const current = computed(() => props.formula.formulaVolume);

const editMode = ref(current.value == null);
const pending = ref(null); // candidate value awaiting confirmation (kept for parity)

function writeVolume(v) {
    const patch = { formulaVolume: v };

    if (props.formula.typeId === 'tincture') {
        patch.tinctureVolume = v;
    }

    if (props.formula.typeId === 'capsule') {
        patch.capsuleCount = v;
        patch.capsuleMultiPacks = false;
    }

    // Chinese: amounts come from parts ÷ Σparts × volume. Western: from pct.
    patch.ingredients = reflowParts(props.formula.ingredients, v);
    props.setF(patch);
    editMode.value = false;
}
function requestVolume(v) {
    if (v === current.value) {
        editMode.value = false;

        return;
    }

    writeVolume(v);
}

// Mobile dropdown current value.
const selectValue = computed(() =>
    current.value != null && rules.value.options.includes(current.value)
        ? String(current.value)
        : '',
);
function onSelect(v) {
    if (v !== '') {
        requestVolume(+v);
    }
}
</script>

<template>
    <div v-if="!rules"></div>

    <!-- Confirmation pill (volume already chosen, not editing) -->
    <div v-else-if="current != null && !editMode" class="mt-[14px]">
        <div
            class="inline-flex items-center gap-[6px] rounded-[999px] border border-accent bg-accent-tint py-[4px] pr-[10px] pl-[6px] text-[13px] leading-[1.4] font-semibold text-accent-ink"
        >
            <Icon name="check" :size="12" color="var(--accent)" />
            נפח: <span class="num">{{ current }}</span> {{ rules.unit }}
            <button
                aria-label="ערוך נפח"
                class="ms-[2px] inline-flex cursor-pointer items-center border-none bg-transparent p-0 text-accent"
                @click="editMode = true"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M14 4l6 6-10 10H4v-6L14 4z" />
                </svg>
            </button>
        </div>
        <VolumeChangeConfirm
            v-if="pending != null"
            :unit="rules.unit"
            :new-volume="pending"
            @confirm="
                writeVolume(pending);
                pending = null;
            "
            @cancel="pending = null"
        />
    </div>

    <!-- Edit / initial-pick mode -->
    <div v-else class="mt-[14px]" id="tf-anchor-volume">
        <!-- Desktop: volume pills. On mobile a dropdown (.vol-select-wrap) replaces them. -->
        <div class="vol-pills flex flex-wrap items-center gap-[8px]">
            <button
                v-for="n in rules.options"
                :key="n"
                class="h-[32px] cursor-pointer rounded-[999px] border px-[12px] py-0 font-latin text-[13px] transition-[background-color,border-color] duration-[120ms]"
                :class="
                    current === n
                        ? 'border-ink bg-ink font-semibold text-white'
                        : 'border-line-strong bg-surface font-medium text-ink-2'
                "
                @click="requestVolume(n)"
            >
                <span class="num">{{ n }}</span
                >&nbsp;<span class="[font-family:inherit] text-[12px]">{{
                    rules.unit
                }}</span>
            </button>
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
                <option v-for="n in rules.options" :key="n" :value="n">
                    {{ n }} {{ rules.unit }}
                </option>
            </select>
        </div>

        <div
            v-if="current == null"
            class="mt-[9px] flex items-center gap-[7px] text-[12.5px] font-semibold text-danger"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M12 7v6" />
                <path d="M12 17h.01" />
                <circle cx="12" cy="12" r="9.5" stroke-width="1.6" />
            </svg>
            נא לבחור נפח פורמולה
        </div>

        <VolumeChangeConfirm
            v-if="pending != null"
            :unit="rules.unit"
            :new-volume="pending"
            @confirm="
                writeVolume(pending);
                pending = null;
            "
            @cancel="pending = null"
        />
    </div>
</template>
