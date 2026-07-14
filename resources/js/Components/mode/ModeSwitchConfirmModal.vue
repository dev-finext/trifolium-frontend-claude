<script setup>
// Confirmation for mid-wizard treatment-style switches (destructive: wipes the
// in-progress formula, keeps the patient).
import { computed } from 'vue';
import DangerConfirmModal from '@/Components/ui/DangerConfirmModal.vue';

const props = defineProps({
    /** 'western' | 'chinese' */
    targetMode: { type: String, required: true },
});

defineEmits(['confirm', 'cancel']);

const targetLabel = computed(() => (props.targetMode === 'chinese' ? 'סיני' : 'מערבי'));
</script>

<template>
    <DangerConfirmModal
        title="החלפת סגנון טיפול"
        confirm-label="החלף ומחק"
        @confirm="$emit('confirm')"
        @cancel="$emit('cancel')"
    >
        החלפה לסגנון <strong style="color: var(--ink)">{{ targetLabel }}</strong> תמחק את הפורמולה
        הנוכחית ותתחיל רקיחה מחדש בסגנון זה. פרטי המטופל יישמרו, ולא ניתן לשחזר את הפורמולה.
    </DangerConfirmModal>
</template>
