<script setup>
// Drug-interaction safety declaration.
// Shown wherever the chosen patient is on medication. Two usages:
//   display-only:  <MedsSafetyDeclaration :patient-meds="meds" />
//   confirmable:   <MedsSafetyDeclaration :patient-meds="meds" confirmable v-model:checked="ok" />
defineProps({
    /** Free-text list of the patient's reported medications (optional). */
    patientMeds: { type: String, default: '' },
    /** When true, renders the "I have read and confirm" checkbox row. */
    confirmable: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
});

const emit = defineEmits(['update:checked']);
</script>

<template>
    <div
        class="flex items-start gap-[13px] rounded-card border border-[#e7d4ad] bg-[#fdf7ec] px-[18px] py-[16px] [border-inline-start:3px_solid_var(--warning)]"
    >
        <span
            class="mt-[1px] inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-warning text-[#fff]"
        >
            <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path
                    d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z"
                />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
            </svg>
        </span>
        <div class="min-w-0 flex-1">
            <div
                class="mb-[7px] text-[11px] font-bold tracking-[0.06em] text-[#8a6516] uppercase"
            >
                הצהרת בטיחות — שילוב צמחי מרפא ותרופות
            </div>
            <p
                class="m-0 text-[13px] leading-[1.75] [text-wrap:pretty] text-ink-2"
            >
                ידוע לי שעלולה להיות סתירה בין צמחי מרפא לתרופות מרשם או תרופות
                אחרות ותוספי מזון. במתן אישור זה, הסכמה לתנאי זה אני מצהיר כי
                בדקתי את נכונות ההכנה / המרשם והתאמתו למטופל / לקוח ובפרט בדקתי
                שימוש במדללי דם, תרופות לל״ד, סוכר, תרופות אנטי דיכאוניות,
                תרופות פסיכיאטריות אחרות, תרופות ביולוגיות או כימותרפיות או כל
                קבוצת תרופות אחרת ותוספי מזון אשר עלולה לייצר סתירה או תופעות
                לוואי אל מול ההכנה.
            </p>
            <div
                v-if="patientMeds"
                class="mt-[10px] text-[12.5px] leading-[1.6] text-ink-3"
            >
                <strong class="font-bold text-ink-2"
                    >תרופות שדווחו עבור המטופל:</strong
                >
                {{ ' ' }}{{ patientMeds }}
            </div>
            <label
                v-if="confirmable"
                class="meds-ack mt-[14px] flex cursor-pointer items-center gap-[10px] border-t border-t-[#e7d4ad] pt-[13px]"
            >
                <!-- Real, keyboard-operable native checkbox (visually hidden;
                     Space toggles it natively). The styled box below is the
                     visual indicator only. -->
                <input
                    type="checkbox"
                    class="meds-ack__input"
                    :checked="checked"
                    aria-required="true"
                    @change="emit('update:checked', $event.target.checked)"
                />
                <span
                    class="meds-ack__box inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] border-[1.5px] transition-all duration-[120ms]"
                    :class="
                        checked
                            ? 'border-accent bg-accent'
                            : 'border-[#c9a85f] bg-[#fff]'
                    "
                    aria-hidden="true"
                >
                    <svg
                        v-if="checked"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        stroke-width="2.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </span>
                <span class="text-[13px] font-semibold text-ink">
                    קראתי ואני מאשר/ת את הצהרת הבטיחות
                    <span class="ms-[3px] text-danger">*</span>
                </span>
            </label>
        </div>
    </div>
</template>

<style scoped>
/* Native checkbox: focusable and operable, but visually replaced by the
   styled .meds-ack__box. Keep it in the layout (not display:none) so it stays
   keyboard-reachable. */
.meds-ack__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
}
/* Visible focus indicator on the styled box when the hidden input is focused. */
.meds-ack__input:focus-visible + .meds-ack__box {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
</style>
