<script setup>
// One search-result row in the existing-patient path: avatar, name + status
// tags, phone/age line, "נבחר" chip when selected and a pencil edit button.
// Display fields (heb/phone/age/meds) are passed separately from the raw
// patient `p` so local edits made via the pencil override the stored record.
import { ref } from 'vue';
import MedFlag from '@/components/shared/wizard/MedFlag.vue';
import PatientAvatar from '@/components/shared/wizard/PatientAvatar.vue';
import PatientTag from '@/components/shared/wizard/PatientTag.vue';
import Icon from '@/components/ui/Icon.vue';

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
        class="flex cursor-pointer items-center gap-[16px] rounded-card border px-[18px] py-[16px] transition-all duration-150"
        :class="
            sel
                ? 'border-accent bg-accent-tint shadow-[0_6px_18px_-12px_rgba(61,90,58,0.4),inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-surface shadow-none'
        "
        @click="emit('select')"
    >
        <PatientAvatar :initials="p.initials" :sel="sel" />
        <div class="min-w-0 flex-1">
            <div class="mb-[5px] flex flex-wrap items-center gap-[8px]">
                <span
                    class="text-[16px] font-bold"
                    :class="sel ? 'text-accent-ink' : 'text-ink'"
                    >{{ heb }}</span
                >
                <PatientTag :tone="p.tag === 'מעקב' ? 'follow' : 'active'">{{
                    p.tag
                }}</PatientTag>
                <MedFlag v-if="meds && meds.length > 0" />
            </div>
            <div
                class="flex flex-wrap items-center gap-[10px] text-[13px] text-ink-3"
            >
                <span class="num" dir="ltr">{{ phone }}</span>
                <span>·</span>
                <span
                    ><span class="num">{{ age }}</span> שנים</span
                >
            </div>
        </div>
        <span
            v-if="sel"
            class="inline-flex shrink-0 items-center gap-[6px] rounded-[999px] bg-accent px-[11px] py-[5px] text-[12px] font-semibold text-white"
        >
            <Icon name="check" :size="12" color="#fff" :stroke="2.6" /> נבחר
        </span>
        <button
            type="button"
            title="עריכת פרטי מטופל"
            aria-label="עריכת פרטי מטופל"
            class="inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-control border [font-family:inherit] transition-all duration-150"
            :class="
                editHover
                    ? 'border-accent bg-accent-tint'
                    : 'border-line bg-transparent'
            "
            @click.stop="emit('edit')"
            @mouseenter="editHover = true"
            @mouseleave="editHover = false"
        >
            <Icon
                name="edit"
                :size="17"
                :color="editHover ? 'var(--accent)' : 'var(--ink-3)'"
            />
        </button>
    </div>
</template>
