<script setup>
// Formula-type card — soft duotone: white card; the pigment lives in a soft
// rounded tile behind the glyph. Selected → faint hue wash + hue border. The
// little "i" badge reveals a viewport-fixed tooltip (Teleported to <body> so
// the card's / section's overflow never clips it).
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FormulaTypeIcon from '@/Components/wizard/FormulaTypeIcon.vue';
import { typePig, TYPE_INFO } from '@/Components/wizard/wizard-lib';

const props = defineProps({
    type: { type: Object, required: true },
    selected: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

const hover = ref(false);
const tip = ref(null); // { cx, top } viewport coords, or null

const P = typePig;
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
        class="ftype-card"
        :style="{
            position: 'relative',
            width: '100%',
            minWidth: 0,
            height: '108px',
            background: selected ? P.tint(id) : 'var(--surface)',
            color: selected ? P.inkDeep(id) : 'var(--ink)',
            border: '1px solid ' + (selected ? P.line(id) : (hover ? P.line(id) : 'var(--line)')),
            boxShadow: selected
                ? 'inset 0 0 0 1px ' + P.line(id)
                : (hover ? '0 4px 12px -8px rgba(20,18,14,0.35)' : 'none'),
            borderRadius: 'var(--r-card)',
            padding: '12px 8px 10px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
        }"
        @click="emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false; tip = null"
    >
        <!-- Info badge — hover opens an explanatory tooltip for this type -->
        <span
            v-if="info"
            :aria-label="'מידע על ' + type.heb"
            :style="{
                position: 'absolute',
                top: '6px',
                insetInlineStart: '6px',
                width: '19px',
                height: '19px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: selected ? '#fff' : 'var(--surface-sunk)',
                border: '1px solid ' + (selected ? P.line(id) : 'var(--line)'),
                color: selected ? P.ink(id) : 'var(--ink-3)',
                cursor: 'help',
            }"
            @mouseenter="showTip"
            @mouseleave="tip = null"
            @click.stop
            @mousedown.stop
        >
            <Icon name="info" :size="11" />
        </span>

        <span
            :style="{
                width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0,
                background: selected ? P.tintStrong(id) : P.tintMid(id),
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }"
        >
            <FormulaTypeIcon :id="id" :size="25" :color="P.ink(id)" />
        </span>

        <div style="text-align: center; line-height: 1.25; max-width: 100%">
            <div :style="{ fontSize: '14px', fontWeight: selected ? 700 : 600, color: selected ? P.inkDeep(id) : 'var(--ink)', whiteSpace: 'nowrap' }">{{ type.heb }}</div>
            <div style="font-size: 12px; color: var(--ink-3); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ type.sub }}</div>
        </div>

        <!-- Floating tooltip — fixed to the viewport, Teleported to <body>. -->
        <Teleport to="body">
            <div
                v-if="tipBox && info"
                role="tooltip"
                :style="{
                    position: 'fixed',
                    top: (tipBox.top - 10) + 'px',
                    left: tipBox.left + 'px',
                    transform: 'translateY(-100%)',
                    width: tipBox.W + 'px',
                    background: 'var(--ink)',
                    color: 'var(--surface)',
                    padding: '11px 14px',
                    borderRadius: '9px',
                    fontSize: '12.5px',
                    fontWeight: 400,
                    lineHeight: 1.55,
                    textAlign: 'right',
                    direction: 'rtl',
                    boxShadow: '0 14px 30px -10px rgba(20,18,14,0.55)',
                    zIndex: 1000,
                    pointerEvents: 'none',
                }"
            >
                <div style="font-weight: 700; margin-bottom: 3px">{{ type.heb }}</div>
                {{ info }}
                <span
                    :style="{
                        position: 'absolute',
                        top: '100%',
                        left: tipBox.arrowX + 'px',
                        transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderInlineStart: '6px solid transparent',
                        borderInlineEnd: '6px solid transparent',
                        borderTop: '6px solid var(--ink)',
                    }"
                />
            </div>
        </Teleport>
    </button>
</template>
