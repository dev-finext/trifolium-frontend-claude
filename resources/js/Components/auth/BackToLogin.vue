<script setup>
// Back-to-login text link, used at the foot of the recovery screens.
import Icon from '@/Components/ui/Icon.vue';
import { visit } from '@/lib/routes';

defineProps({
    label: { type: String, default: 'חזרה לכניסה' },
});
</script>

<template>
    <div style="margin-top: 24px; text-align: center">
        <a
            :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: 'var(--ink-3)', cursor: 'pointer', whiteSpace: 'nowrap' }"
            @click="visit('login')"
        >
            <Icon name="chevron_right" :size="15" color="var(--ink-3)" />
            {{ label }}
        </a>
    </div>
</template>
