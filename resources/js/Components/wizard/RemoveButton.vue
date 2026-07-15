<script setup>
// Row-remove "x" button — turns red on hover.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';

defineEmits(['click']);
const hover = ref(false);
</script>

<template>
    <button
        class="btn--icon"
        :style="{ width: '26px', height: '26px', color: hover ? 'var(--danger)' : 'var(--ink-3)' }"
        title="הסר"
        @click="$emit('click')"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
    >
        <Icon name="x" :size="13" />
    </button>
</template>
