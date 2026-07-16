<script setup>
// Read-only field — visually distinct (sunk surface + lock) so it's clear
// the value cannot be changed here.
import FieldLabel from '@/components/ui/FieldLabel.vue';
import Icon from '@/components/ui/Icon.vue';

defineProps({
    label: { type: String, required: true },
    value: { type: String, default: '' },
    dir: { type: String, default: undefined },
});
</script>

<template>
    <div>
        <FieldLabel>{{ label }}</FieldLabel>
        <div class="input-wrap">
            <span class="lead-icon right-auto left-[11px] text-ink-4">
                <Icon name="lock" :size="15" />
            </span>
            <input
                class="input cursor-default bg-surface-sunk pl-[36px] text-ink-2"
                :class="dir === 'ltr' ? 'text-right' : ''"
                :value="value"
                readonly
                tabindex="-1"
                :dir="dir"
            />
        </div>
        <div class="small muted mt-[6px]">
            לא ניתן לעריכה. לשינוי יש לפנות לתמיכה.
        </div>
    </div>
</template>
