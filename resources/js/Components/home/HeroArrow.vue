<script setup>
// Round nav arrow over the hero promo carousel edges. Retained from the
// prototype's rotating-promo hero; the current HeroPromo banner does not
// render it, but it stays available for the carousel variant.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    /** Physical CSS side the arrow hugs: 'left' | 'right'. */
    side: { type: String, required: true },
    icon: { type: String, required: true },
});
defineEmits(['click']);

const hover = ref(false);
</script>

<template>
    <button
        :style="{
            position: 'absolute', top: '46%', transform: 'translateY(-50%)', [side]: '16px',
            width: '42px', height: '42px', borderRadius: '50%', background: 'var(--surface)',
            border: '1px solid ' + (hover ? 'var(--ink-2)' : 'var(--line)'),
            boxShadow: '0 6px 18px -8px rgba(31,46,29,0.3)', zIndex: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color .15s',
        }"
        @click="$emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon :name="icon" :size="19" :color="hover ? 'var(--ink)' : 'var(--ink-2)'" />
    </button>
</template>
