<script setup>
// System-formula card — Trifolium-team templates. Same layout as the saved
// card, but with a blue (oklch hue 240) accent stripe, chip and load button
// to visually separate it from the practitioner's own formulas.
import { ref, computed } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import { FORMULA_TYPES } from '@/data/mock';

const props = defineProps({
    formula: { type: Object, required: true },
});

const emit = defineEmits(['load']);

const hover = ref(false);

const count = computed(() => (props.formula.ingredients || []).length);
const ftype = computed(() => FORMULA_TYPES.find((t) => t.id === props.formula.typeId));
</script>

<template>
    <div
        class="card"
        :style="{
            padding: 0, display: 'flex', flexDirection: 'column',
            borderColor: hover ? 'oklch(0.60 0.10 240)' : 'var(--line)',
            transition: 'border-color .15s, box-shadow .15s',
            boxShadow: hover ? '0 10px 28px rgba(20,28,24,0.07)' : 'none',
        }"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <!-- Top accent stripe -->
        <div style="height: 3px; background: oklch(0.54 0.10 240); border-radius: 6px 6px 0 0; flex-shrink: 0" />

        <div style="padding: 16px 20px 14px; flex: 1">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px">
                <span
                    :style="{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
                        color: 'oklch(0.34 0.09 240)',
                        background: 'oklch(0.95 0.03 240)',
                        padding: '4px 10px', borderRadius: '999px',
                    }"
                >
                    <Icon name="flask" :size="13" color="oklch(0.54 0.10 240)" />
                    {{ ftype?.heb || formula.typeId }}
                </span>
                <span class="small muted" style="display: inline-flex; align-items: center; gap: 5px; white-space: nowrap">
                    <Icon name="leaf" :size="13" /> <span class="num">{{ count }}</span> רכיבים
                </span>
            </div>

            <h3 style="margin: 0 0 6px; font-size: 16.5px; font-weight: 600; letter-spacing: -0.005em">{{ formula.name }}</h3>
            <p class="small muted" style="margin: 0 0 10px; line-height: 1.65">{{ formula.description }}</p>

            <div style="display: inline-flex; align-items: center; gap: 6px">
                <Icon name="leaf" :size="12" color="var(--ink-3)" />
                <span class="small muted">{{ formula.summary }}</span>
            </div>
        </div>

        <!-- Action footer -->
        <div style="display: flex; align-items: center; padding: 12px 16px; border-top: 1px solid var(--line)">
            <button
                class="btn btn--sm"
                :style="{
                    flex: 1,
                    background: 'oklch(0.54 0.10 240)',
                    borderColor: 'oklch(0.54 0.10 240)',
                    color: '#fff',
                }"
                @click="emit('load')"
            >
                <Icon name="flask" :size="15" color="#fff" /> טען למעבדה
            </button>
        </div>
    </div>
</template>
