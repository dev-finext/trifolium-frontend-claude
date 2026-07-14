<script setup>
// One filter option line — custom-drawn radio/checkbox glyph, label and a
// count badge. The real input is visually hidden but keeps the row
// keyboard/screen-reader accessible.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    label: { type: String, required: true },
    count: { type: Number, default: 0 },
    checked: { type: Boolean, default: false },
    radio: { type: Boolean, default: false },
});

const emit = defineEmits(['change']);

const hover = ref(false);
</script>

<template>
    <label
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '5px 6px',
            margin: '0 -6px',
            borderRadius: '4px',
            cursor: 'pointer',
            background: hover ? 'var(--accent-tint)' : 'transparent',
            transition: 'background .12s',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <span
            :style="{
                width: '14px',
                height: '14px',
                flexShrink: 0,
                border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--line-strong)'}`,
                background: checked ? 'var(--accent)' : 'var(--surface)',
                borderRadius: radio ? '50%' : '3px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .15s',
            }"
        >
            <template v-if="checked">
                <span v-if="radio" style="width: 6px; height: 6px; border-radius: 50%; background: #fff" />
                <Icon v-else name="check" :size="10" color="#fff" :stroke="2.5" />
            </template>
        </span>
        <input
            :type="radio ? 'radio' : 'checkbox'"
            :checked="checked"
            style="position: absolute; opacity: 0; pointer-events: none"
            @change="emit('change')"
        />
        <span
            :style="{
                fontSize: '13px',
                color: checked ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: checked ? 600 : 400,
                flex: 1,
            }"
        >{{ label }}</span>
        <span class="num" style="font-size: 11px; color: var(--ink-4)">{{ count }}</span>
    </label>
</template>
