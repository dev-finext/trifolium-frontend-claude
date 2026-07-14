<script setup>
// Confirmation for switching the formula TYPE after the user already started
// building the formula (destructive: clears chosen ingredients + volume).
import DangerConfirmModal from '@/Components/ui/DangerConfirmModal.vue';

defineProps({
    /** Display label of the formula type being switched to. */
    targetLabel: { type: String, required: true },
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
    <DangerConfirmModal
        title="החלפת סוג פורמולה"
        confirm-label="החלף ומחק רכיבים"
        @confirm="$emit('confirm')"
        @cancel="$emit('cancel')"
    >
        החלפה לסוג <strong style="color: var(--ink)">{{ targetLabel }}</strong> תמחק את הרכיבים
        שבחרת ותתחיל את בחירת הרכיבים מחדש, נקייה, עבור סוג זה. הנפח והכמויות יאופסו אף הם. פעולה זו אינה ניתנת לשחזור.
    </DangerConfirmModal>
</template>
