<script setup>
// Quantity stepper — accent squares flanking the count.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    qty: { type: Number, required: true },
});
const emit = defineEmits(['change']);

// Shared look of the two stepper buttons (disabled = sunk, grey).
// 30px on desktop; the mobile stylesheet bumps .qty-step to 40px (M7).
function btnStyle(disabled) {
    return {
        width: '30px', height: '30px', borderRadius: 'var(--r-control)',
        border: 'none', flexShrink: 0,
        background: disabled ? 'var(--surface-sunk)' : 'var(--accent)',
        color: disabled ? 'var(--ink-4)' : 'var(--on-accent)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background .15s',
    };
}
</script>

<template>
    <div class="qty-stepper" style="display: flex; align-items: center; gap: 8px" role="group" aria-label="כמות">
        <button
            class="qty-step"
            type="button"
            aria-label="הפחת כמות"
            :disabled="qty <= 1"
            :style="btnStyle(qty <= 1)"
            @click="emit('change', qty - 1)"
        >
            <Icon name="minus" :size="15" :color="qty <= 1 ? 'var(--ink-4)' : 'var(--on-accent)'" :stroke="2.2" />
        </button>
        <span
            class="num qty-count"
            role="status"
            aria-live="polite"
            :aria-label="`כמות: ${qty}`"
            :style="{
                minWidth: '40px', textAlign: 'center', fontSize: '15px', fontWeight: 600,
                border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                height: '30px', lineHeight: '28px', background: 'var(--surface)',
            }"
        >{{ qty }}</span>
        <button
            class="qty-step"
            type="button"
            aria-label="הוסף כמות"
            :style="btnStyle(false)"
            @click="emit('change', qty + 1)"
        >
            <Icon name="plus" :size="15" color="var(--on-accent)" :stroke="2.2" />
        </button>
    </div>
</template>
