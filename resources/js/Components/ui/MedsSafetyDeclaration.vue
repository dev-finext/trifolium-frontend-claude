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
        :style="{
            background: '#fdf7ec',
            border: '1px solid #e7d4ad',
            borderInlineStart: '3px solid var(--warning)',
            borderRadius: 'var(--r-card)',
            padding: '16px 18px',
            display: 'flex',
            gap: '13px',
            alignItems: 'flex-start',
        }"
    >
        <span
            :style="{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'var(--warning)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
            }"
        >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
            </svg>
        </span>
        <div style="flex: 1; min-width: 0">
            <div
                :style="{
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: '#8a6516',
                    marginBottom: '7px',
                }"
            >
                הצהרת בטיחות — שילוב צמחי מרפא ותרופות
            </div>
            <p
                :style="{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: 1.75,
                    color: 'var(--ink-2)',
                    textWrap: 'pretty',
                }"
            >
                ידוע לי שעלולה להיות סתירה בין צמחי מרפא לתרופות מרשם או תרופות אחרות ותוספי מזון. במתן אישור זה, הסכמה לתנאי זה אני מצהיר כי בדקתי את נכונות ההכנה / המרשם והתאמתו למטופל / לקוח ובפרט בדקתי שימוש במדללי דם, תרופות לל״ד, סוכר, תרופות אנטי דיכאוניות, תרופות פסיכיאטריות אחרות, תרופות ביולוגיות או כימותרפיות או כל קבוצת תרופות אחרת ותוספי מזון אשר עלולה לייצר סתירה או תופעות לוואי אל מול ההכנה.
            </p>
            <div
                v-if="patientMeds"
                :style="{
                    marginTop: '10px',
                    fontSize: '12.5px',
                    color: 'var(--ink-3)',
                    lineHeight: 1.6,
                }"
            >
                <strong style="color: var(--ink-2); font-weight: 700">תרופות שדווחו עבור המטופל:</strong>
                {{ ' ' }}{{ patientMeds }}
            </div>
            <label
                v-if="confirmable"
                class="meds-ack"
                :style="{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '14px',
                    paddingTop: '13px',
                    borderTop: '1px solid #e7d4ad',
                    cursor: 'pointer',
                }"
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
                    class="meds-ack__box"
                    aria-hidden="true"
                    :style="{
                        width: '22px', height: '22px',
                        borderRadius: '6px',
                        border: '1.5px solid ' + (checked ? 'var(--accent)' : '#c9a85f'),
                        background: checked ? 'var(--accent)' : '#fff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all .12s',
                    }"
                >
                    <svg v-if="checked" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </span>
                <span style="font-size: 13px; font-weight: 600; color: var(--ink)">
                    קראתי ואני מאשר/ת את הצהרת הבטיחות
                    <span style="color: var(--danger); margin-inline-start: 3px">*</span>
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
