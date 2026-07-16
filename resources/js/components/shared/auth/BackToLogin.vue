<script setup>
// Back-to-login text link, used at the foot of the recovery screens.
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';

defineProps({
    label: { type: String, default: 'חזרה לכניסה' },
});
</script>

<template>
    <div class="mt-[24px] text-center">
        <a
            class="inline-flex cursor-pointer items-center gap-[6px] text-[13.5px] whitespace-nowrap text-ink-3"
            @click="visit('login')"
        >
            <Icon name="chevron_right" :size="15" color="var(--ink-3)" />
            {{ label }}
        </a>
    </div>
</template>
