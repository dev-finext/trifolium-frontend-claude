<script setup>
// Empty state for the recent-orders table: either "no matches for the
// current filter" or the first-run "no formula ordered yet" CTA.
import Icon from '@/Components/ui/Icon.vue';

defineProps({
    hasFilter: { type: Boolean, default: false },
});
defineEmits(['action']);
</script>

<template>
    <div
        :style="{
            padding: '64px 24px',
            textAlign: 'center',
            border: '1px dashed var(--line-strong)',
            borderRadius: 'var(--r-card)',
        }"
    >
        <div
            :style="{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'var(--surface-sunk)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                color: 'var(--ink-3)',
            }"
        >
            <Icon name="flask" :size="24" />
        </div>
        <div style="font-size: 16px; font-weight: 500; margin-bottom: 6px">
            {{ hasFilter ? 'לא נמצאו הזמנות מתאימות' : 'עדיין לא הוזמנה פורמולה' }}
        </div>
        <div class="small muted" style="margin-bottom: 20px">
            {{ hasFilter ? 'נסה לשנות סינון או לנקות את החיפוש' : 'התחל בהכנת פורמולה ראשונה למטופל' }}
        </div>
        <button v-if="!hasFilter" class="btn btn--accent" @click="$emit('action')">
            <Icon name="flask" :size="16" /> הכן פורמולה ראשונה
        </button>
    </div>
</template>
