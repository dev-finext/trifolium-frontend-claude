<script setup>
// Option C — "ללא מטופל" explanation notice (save-to-drafts only).
import Icon from '@/components/ui/Icon.vue';
</script>

<template>
    <div
        class="flex items-start gap-[14px] rounded-card border-s-[3px] border-s-accent bg-surface-sunk px-[18px] py-[16px]"
    >
        <Icon name="info" :size="18" color="var(--accent)" class="mt-[2px]" />
        <div class="text-[13px] leading-[1.6] text-ink-2">
            <div class="mb-[4px] font-semibold text-ink">
                שמירה בלבד — ללא יצירת הזמנה
            </div>
            פורמולה זו תישמר תחת <strong>הפורמולות שלי</strong> בלבד. לא תיצור
            הזמנה ולא תישלח לתשלום. ניתן לקשר אותה למטופל ולהזמין בכל עת.
        </div>
    </div>
</template>
