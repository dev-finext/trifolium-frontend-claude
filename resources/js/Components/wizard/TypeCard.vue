<script setup>
// Formula-type card — soft duotone: white card; the pigment lives in a soft
// rounded tile behind the glyph. Selected → faint hue wash + hue border. The
// little "i" badge reveals a viewport-fixed tooltip (Teleported to <body> so
// the card's / section's overflow never clips it).
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FormulaTypeArt from '@/Components/wizard/FormulaTypeArt.vue';
import { TYPE_INFO } from '@/Components/wizard/wizard-lib';

const props = defineProps({
    type: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

const hover = ref(false);
const tip = ref(null); // { cx, top } viewport coords, or null

const id = computed(() => props.type.id);
const info = computed(() => TYPE_INFO[props.type.id]);

function showTip(e) {
    const r = e.currentTarget.getBoundingClientRect();
    tip.value = { cx: r.left + r.width / 2, top: r.top };
}

// Tooltip geometry — clamp horizontally so text never runs off either edge.
const tipBox = computed(() => {
    if (!tip.value) return null;
    const margin = 14;
    const vw = Math.min(window.innerWidth, document.documentElement.clientWidth);
    const W = Math.min(236, vw - margin * 2);
    let left = tip.value.cx - W / 2;
    left = Math.max(margin, Math.min(left, vw - W - margin));
    const arrowX = Math.max(14, Math.min(W - 14, tip.value.cx - left));
    return { W, left, arrowX, top: tip.value.top };
});
</script>

<template>
    <button
        class="ftype-card relative flex flex-col items-center justify-center gap-[8px] w-full min-w-0 h-[116px] pt-[12px] px-[8px] pb-[10px] [font-family:inherit] text-ink bg-surface rounded-card cursor-pointer"
        :class="selected
            ? 'border-2 border-accent shadow-[inset_0_0_0_1px_var(--accent),0_6px_16px_-10px_rgba(31,46,29,0.30)]'
            : hover
                ? 'border border-line-strong shadow-[0_4px_12px_-8px_rgba(20,18,14,0.30)]'
                : 'border border-line shadow-none'"
        @click="emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false; tip = null"
    >
        <!-- Info badge — hover opens an explanatory tooltip for this type -->
        <span
            v-if="info"
            :aria-label="'מידע על ' + type.heb"
            class="absolute top-[6px] start-[6px] inline-flex items-center justify-center w-[19px] h-[19px] text-ink-3 bg-surface-sunk border border-line rounded-[50%] cursor-help"
            @mouseenter="showTip"
            @mouseleave="tip = null"
            @click.stop
            @mousedown.stop
        >
            <Icon name="info" :size="11" />
        </span>

        <span
            class="inline-flex items-center justify-center shrink-0 w-[58px] h-[58px] bg-[#f8f7ef] border border-line rounded-[15px]"
        >
            <FormulaTypeArt :id="id" :size="50" />
        </span>

        <div class="max-w-full text-center leading-[1.25]">
            <div class="text-[14px] text-ink whitespace-nowrap" :class="selected ? 'font-bold' : 'font-semibold'">{{ type.heb }}</div>
            <div class="mt-[3px] text-[12px] text-ink-3 whitespace-nowrap overflow-hidden text-ellipsis">{{ type.sub }}</div>
        </div>

        <!-- Floating tooltip — fixed to the viewport, Teleported to <body>. -->
        <Teleport to="body">
            <div
                v-if="tipBox && info"
                role="tooltip"
                class="fixed -translate-y-full py-[11px] px-[14px] text-[12.5px] font-normal leading-[1.55] text-right [direction:rtl] text-(--surface) bg-(--ink) rounded-[9px] shadow-[0_14px_30px_-10px_rgba(20,18,14,0.55)] z-[1000] pointer-events-none"
                :style="{
                    top: (tipBox.top - 10) + 'px',
                    left: tipBox.left + 'px',
                    width: tipBox.W + 'px',
                }"
            >
                <div class="font-bold mb-[3px]">{{ type.heb }}</div>
                {{ info }}
                <span
                    class="absolute top-full -translate-x-1/2 w-0 h-0 border-s-[6px] border-s-transparent border-e-[6px] border-e-transparent border-t-[6px] border-t-ink"
                    :style="{ left: tipBox.arrowX + 'px' }"
                />
            </div>
        </Teleport>
    </button>
</template>
