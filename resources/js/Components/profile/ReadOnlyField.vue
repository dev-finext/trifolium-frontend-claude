<script setup>
// Read-only field — visually distinct (sunk surface + lock) so it's clear
// the value cannot be changed here.
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import Icon from '@/Components/ui/Icon.vue';

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
            <span class="lead-icon" style="right: auto; left: 11px; color: var(--ink-4)">
                <Icon name="lock" :size="15" />
            </span>
            <input
                class="input"
                :value="value"
                readonly
                tabindex="-1"
                :dir="dir"
                :style="{
                    background: 'var(--surface-sunk)', color: 'var(--ink-2)',
                    cursor: 'default', paddingLeft: '36px',
                    ...(dir === 'ltr' ? { textAlign: 'right' } : {}),
                }"
            />
        </div>
        <div class="small muted" style="margin-top: 6px">לא ניתן לעריכה. לשינוי יש לפנות לתמיכה.</div>
    </div>
</template>
