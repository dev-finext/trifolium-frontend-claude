<script setup>
// Tincture-specific subsection: a single opt-in question — "evaporate?".
// Default is NO (alcohol extract only). The carrier options appear only once
// the user actively turns the question on.
import { computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { CARRIER_OPTIONS } from '@/Components/wizard/wizard-lib';

const props = defineProps({
    formula: { type: Object, required: true },
    setF: { type: Function, required: true },
});

const on = computed(() => !!props.formula.evaporation && props.formula.evaporation !== 'none');

function toggle() {
    if (on.value) props.setF({ evaporation: 'none' });
    else props.setF({ evaporation: CARRIER_OPTIONS[0].id });
}
</script>

<template>
    <div
        :style="{
            marginTop: '16px',
            padding: on ? '18px' : '8px 14px',
            background: 'var(--surface-sunk)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-card)',
            transition: 'padding .12s ease',
        }"
    >
        <!-- The opt-in question — a single checkbox row, defaults to off -->
        <label
            style="display: flex; align-items: center; gap: 12px; padding: 4px 0; cursor: pointer"
            @click.prevent="toggle"
        >
            <span
                :style="{
                    width: on ? '20px' : '18px', height: on ? '20px' : '18px',
                    borderRadius: '5px',
                    flexShrink: 0,
                    border: '2px solid ' + (on ? 'var(--accent)' : 'var(--line-strong)'),
                    background: on ? 'var(--accent)' : '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color .12s ease, border-color .12s ease',
                }"
            >
                <Icon v-if="on" name="check" :size="13" color="#fff" :stroke="3" />
            </span>
            <span style="flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap">
                <span :style="{ fontSize: on ? '14px' : '13px', fontWeight: 600, color: on ? 'var(--accent-ink)' : 'var(--ink)' }">האם לנדף את הטינקטורה?</span>
                <span :style="{ fontSize: on ? '12px' : '11.5px', color: 'var(--ink-3)' }">{{ on ? 'ברירת מחדל: ללא נידוף — תמצית באלכוהול בלבד.' : 'ללא נידוף (ברירת מחדל)' }}</span>
            </span>
        </label>

        <div v-if="on" style="margin-top: 16px">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 4px">
                <label
                    v-for="opt in CARRIER_OPTIONS" :key="opt.id"
                    :style="{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '12px 14px',
                        border: '1px solid ' + ((formula.evaporation || 'none') === opt.id ? 'var(--accent)' : 'var(--line)'),
                        background: (formula.evaporation || 'none') === opt.id ? 'var(--accent-tint)' : '#fff',
                        borderRadius: 'var(--r-control)',
                        cursor: 'pointer',
                        boxShadow: (formula.evaporation || 'none') === opt.id ? 'inset 0 0 0 1px var(--accent)' : 'none',
                        transition: 'background-color .12s ease, border-color .12s ease',
                    }"
                    @click="setF({ evaporation: opt.id })"
                >
                    <span
                        :style="{
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            border: '2px solid ' + ((formula.evaporation || 'none') === opt.id ? 'var(--accent)' : 'var(--line-strong)'),
                            background: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                        }"
                    >
                        <span v-if="(formula.evaporation || 'none') === opt.id" style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent)" />
                    </span>
                    <div style="flex: 1; min-width: 0">
                        <div :style="{ fontSize: '13.5px', fontWeight: (formula.evaporation || 'none') === opt.id ? 700 : 600, color: (formula.evaporation || 'none') === opt.id ? 'var(--accent-ink)' : 'var(--ink)', lineHeight: 1.35 }">{{ opt.label }}</div>
                        <div style="font-size: 11.5px; color: var(--ink-3); margin-top: 2px; line-height: 1.4">{{ opt.hint }}</div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
