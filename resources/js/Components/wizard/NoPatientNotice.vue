<script setup>
// Option C — "ללא מטופל" explanation notice (save-to-drafts only).
import Icon from '@/Components/ui/Icon.vue';
</script>

<template>
    <div
        style="border-inline-start: 3px solid var(--accent); background: var(--surface-sunk); padding: 16px 18px; border-radius: var(--r-card); display: flex; gap: 14px; align-items: flex-start"
    >
        <Icon name="info" :size="18" color="var(--accent)" style="margin-top: 2px" />
        <div style="font-size: 13px; line-height: 1.6; color: var(--ink-2)">
            <div style="font-weight: 600; color: var(--ink); margin-bottom: 4px">
                שמירה בלבד — ללא יצירת הזמנה
            </div>
            פורמולה זו תישמר תחת <strong>הפורמולות שלי</strong> בלבד. לא תיצור הזמנה ולא תישלח לתשלום. ניתן לקשר אותה למטופל ולהזמין בכל עת.
        </div>
    </div>
</template>
