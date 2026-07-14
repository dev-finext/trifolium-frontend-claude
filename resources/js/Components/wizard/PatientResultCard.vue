<script setup>
// One search-result row in the existing-patient path: avatar, name + status
// tags, phone/age line, "נבחר" chip when selected and a pencil edit button.
// Display fields (heb/phone/age/meds) are passed separately from the raw
// patient `p` so local edits made via the pencil override the stored record.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import MedFlag from '@/Components/wizard/MedFlag.vue';
import PatientAvatar from '@/Components/wizard/PatientAvatar.vue';
import PatientTag from '@/Components/wizard/PatientTag.vue';

defineProps({
    /** Raw patient record from PATIENTS (initials + tag come from here). */
    p: { type: Object, required: true },
    sel: { type: Boolean, default: false },
    heb: { type: String, default: '' },
    phone: { type: String, default: '' },
    age: { type: [Number, String], default: '' },
    meds: { type: Array, default: () => [] },
});

const emit = defineEmits(['select', 'edit']);

const editHover = ref(false);
</script>

<template>
    <div
        :style="{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 18px',
            border: '1px solid ' + (sel ? 'var(--accent)' : 'var(--line)'),
            background: sel ? 'var(--accent-tint)' : 'var(--surface)',
            borderRadius: 'var(--r-card)',
            cursor: 'pointer',
            transition: 'all .15s',
            boxShadow: sel ? '0 6px 18px -12px rgba(61,90,58,0.4), inset 0 0 0 1px var(--accent)' : 'none',
        }"
        @click="emit('select')"
    >
        <PatientAvatar :initials="p.initials" :sel="sel" />
        <div style="flex: 1; min-width: 0">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px; flex-wrap: wrap">
                <span :style="{ fontSize: '16px', fontWeight: 700, color: sel ? 'var(--accent-ink)' : 'var(--ink)' }">{{ heb }}</span>
                <PatientTag :tone="p.tag === 'מעקב' ? 'follow' : 'active'">{{ p.tag }}</PatientTag>
                <MedFlag v-if="meds && meds.length > 0" />
            </div>
            <div style="display: flex; gap: 10px; align-items: center; font-size: 13px; color: var(--ink-3); flex-wrap: wrap">
                <span class="num" dir="ltr">{{ phone }}</span>
                <span>·</span>
                <span><span class="num">{{ age }}</span> שנים</span>
            </div>
        </div>
        <span
            v-if="sel"
            style="display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; padding: 5px 11px; background: var(--accent); color: #fff; border-radius: 999px; font-size: 12px; font-weight: 600"
        >
            <Icon name="check" :size="12" color="#fff" :stroke="2.6" /> נבחר
        </span>
        <button
            type="button"
            title="עריכת פרטי מטופל"
            aria-label="עריכת פרטי מטופל"
            :style="{
                flexShrink: 0,
                width: '38px',
                height: '38px',
                borderRadius: 'var(--r-control)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid ' + (editHover ? 'var(--accent)' : 'var(--line)'),
                background: editHover ? 'var(--accent-tint)' : 'transparent',
                cursor: 'pointer',
                transition: 'all .15s',
                fontFamily: 'inherit',
            }"
            @click.stop="emit('edit')"
            @mouseenter="editHover = true"
            @mouseleave="editHover = false"
        >
            <Icon name="edit" :size="17" :color="editHover ? 'var(--accent)' : 'var(--ink-3)'" />
        </button>
    </div>
</template>
