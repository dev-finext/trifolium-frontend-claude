<script setup>
// The pill switch — "מערבי" / "סיני".
// RTL: Hebrew reads right-to-left. Per spec: Left "מערבי", Right "סיני".
// In RTL DOM order the first child renders visually on the RIGHT, so the
// labels are ordered "מערבי" first (visual right), "סיני" second.
import { computed } from 'vue';

const props = defineProps({
    /** 'western' | 'chinese' */
    mode: { type: String, required: true },
});

const emit = defineEmits(['request']);

const TRACK_WIDTH = 132;
const knobWidth = TRACK_WIDTH / 2;
const isChinese = computed(() => props.mode === 'chinese');

function labelStyle(active) {
    return {
        position: 'relative',
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12.5px',
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--surface)' : 'var(--ink-3)',
        transition: 'color .18s',
        letterSpacing: '0.02em',
    };
}
</script>

<template>
    <button
        role="switch"
        :aria-checked="isChinese"
        :title="isChinese ? 'מעבר לסגנון מערבי' : 'מעבר לסגנון סיני'"
        :style="{
            position: 'relative',
            width: `${TRACK_WIDTH}px`,
            height: '30px',
            border: '1px solid var(--line-strong)',
            borderRadius: '999px',
            background: 'var(--surface-sunk)',
            padding: '2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'stretch',
            fontFamily: 'inherit',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
            flexShrink: 0,
        }"
        @click="emit('request', isChinese ? 'western' : 'chinese')"
    >
        <!-- Sliding knob -->
        <span
            :style="{
                position: 'absolute',
                top: '2px', bottom: '2px',
                insetInlineStart: isChinese ? `${knobWidth}px` : '2px',
                width: `${knobWidth - 4}px`,
                background: 'var(--ink)',
                borderRadius: '999px',
                transition: 'inset-inline-start .22s cubic-bezier(.4,0,.2,1)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }"
        />
        <span :style="labelStyle(!isChinese)">מערבי</span>
        <span :style="labelStyle(isChinese)">סיני</span>
    </button>
</template>
