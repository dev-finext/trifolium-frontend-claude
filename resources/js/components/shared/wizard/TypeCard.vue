<script setup>
// Formula-type card — soft duotone: white card; the pigment lives in a soft
// rounded tile behind the glyph. Selected → faint hue wash + hue border. The
// little "i" badge reveals a viewport-fixed tooltip (Teleported to <body> so
// the card's / section's overflow never clips it).
import { ref, computed } from 'vue';
import FormulaTypeArt from '@/components/shared/wizard/FormulaTypeArt.vue';
import { TYPE_INFO } from '@/components/shared/wizard/wizard-lib';
import Icon from '@/components/ui/Icon.vue';

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
    if (!tip.value) {
        return null;
    }

    const margin = 14;
    const vw = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth,
    );
    const W = Math.min(236, vw - margin * 2);
    let left = tip.value.cx - W / 2;
    left = Math.max(margin, Math.min(left, vw - W - margin));
    const arrowX = Math.max(14, Math.min(W - 14, tip.value.cx - left));

    return { W, left, arrowX, top: tip.value.top };
});
</script>

<template>
    <button
        class="ftype-card relative flex h-[116px] w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-[8px] rounded-card bg-surface px-[8px] pt-[12px] pb-[10px] [font-family:inherit] text-ink"
        :class="
            selected
                ? 'border-2 border-accent shadow-[inset_0_0_0_1px_var(--accent),0_6px_16px_-10px_rgba(31,46,29,0.30)]'
                : hover
                  ? 'border border-line-strong shadow-[0_4px_12px_-8px_rgba(20,18,14,0.30)]'
                  : 'border border-line shadow-none'
        "
        @click="emit('click')"
        @mouseenter="hover = true"
        @mouseleave="
            hover = false;
            tip = null;
        "
    >
        <!-- Info badge — hover opens an explanatory tooltip for this type -->
        <span
            v-if="info"
            :aria-label="'מידע על ' + type.heb"
            class="absolute start-[6px] top-[6px] inline-flex h-[19px] w-[19px] cursor-help items-center justify-center rounded-[50%] border border-line bg-surface-sunk text-ink-3"
            @mouseenter="showTip"
            @mouseleave="tip = null"
            @click.stop
            @mousedown.stop
        >
            <Icon name="info" :size="11" />
        </span>

        <span
            class="inline-flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-[15px] border border-line bg-[#f8f7ef]"
        >
            <FormulaTypeArt :id="id" :size="50" />
        </span>

        <div class="max-w-full text-center leading-[1.25]">
            <div
                class="text-[14px] whitespace-nowrap text-ink"
                :class="selected ? 'font-bold' : 'font-semibold'"
            >
                {{ type.heb }}
            </div>
            <div
                class="mt-[3px] overflow-hidden text-[12px] text-ellipsis whitespace-nowrap text-ink-3"
            >
                {{ type.sub }}
            </div>
        </div>

        <!-- Floating tooltip — fixed to the viewport, Teleported to <body>. -->
        <Teleport to="body">
            <div
                v-if="tipBox && info"
                role="tooltip"
                class="pointer-events-none fixed z-[1000] -translate-y-full rounded-[9px] bg-(--ink) px-[14px] py-[11px] text-right text-[12.5px] leading-[1.55] font-normal text-(--surface) shadow-[0_14px_30px_-10px_rgba(20,18,14,0.55)] [direction:rtl]"
                :style="{
                    top: tipBox.top - 10 + 'px',
                    left: tipBox.left + 'px',
                    width: tipBox.W + 'px',
                }"
            >
                <div class="mb-[3px] font-bold">{{ type.heb }}</div>
                {{ info }}
                <span
                    class="absolute top-full h-0 w-0 -translate-x-1/2 border-s-[6px] border-e-[6px] border-t-[6px] border-s-transparent border-e-transparent border-t-ink"
                    :style="{ left: tipBox.arrowX + 'px' }"
                />
            </div>
        </Teleport>
    </button>
</template>
