<script setup>
// Courier power-of-attorney — required when the order is couriered
// (משלוח אליי / אל המטופל, לא באיסוף עצמי). Signed in a modal.
import { ref, computed, watch } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import { PATIENTS } from '@/data/mock';
import SignaturePad from '@/Components/cart/SignaturePad.vue';

const props = defineProps({
    open: { type: Boolean, default: false },
    patientName: { type: String, default: '' },
});
const emit = defineEmits(['close', 'confirm']);

const today = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy
const name = ref('');
const tz = ref('');
const hasSig = ref(false);

// Reset the form on every open. Pull the customer's details (name + ת.ז.)
// from the patient record when available.
watch(() => props.open, (open) => {
    if (!open) return;
    const record = PATIENTS.find((p) => p.heb === props.patientName);
    name.value = record ? record.heb : (props.patientName || '');
    tz.value = record && record.tz ? record.tz : '';
    hasSig.value = false;
});

const canSubmit = computed(() => name.value.trim() && tz.value.trim().length >= 5 && hasSig.value);

// Digits only, max 9 — write the sanitised value back so the DOM never drifts.
function onTzInput(e) {
    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
    tz.value = v;
    e.target.value = v;
}
</script>

<template>
    <div
        v-if="open"
        :style="{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(20,28,18,0.5)', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'center',
            padding: '32px 20px', overflowY: 'auto',
        }"
        @click="emit('close')"
    >
        <div
            dir="rtl"
            :style="{
                width: '100%', maxWidth: '720px', background: 'var(--surface)',
                borderRadius: 'var(--r-card)', overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }"
            @click.stop
        >
            <!-- Red header -->
            <div
                :style="{
                    background: '#ec5b53', color: '#fff', padding: '16px 22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                }"
            >
                <h3 :style="{ margin: 0, fontSize: '17px', fontWeight: 600, textWrap: 'pretty' }">
                    טופס ייפוי כוח לקבלת תכשירים מבית מרקחת טריפוליום באמצעות שליח
                </h3>
                <button
                    aria-label="סגירה"
                    :style="{
                        background: 'transparent', border: 'none', color: '#fff',
                        cursor: 'pointer', flexShrink: 0, padding: '4px', lineHeight: 0,
                    }"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="20" color="#fff" />
                </button>
            </div>

            <div style="padding: 22px 24px 26px">
                <div class="small muted" style="margin-bottom: 16px">אני החתום מטה:</div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px">
                    <div>
                        <FieldLabel>שם מלא</FieldLabel>
                        <input class="input" :value="name" placeholder="שם מלא" @input="name = $event.target.value" />
                    </div>
                    <div>
                        <FieldLabel>מספר ת.ז.</FieldLabel>
                        <input
                            class="input num" :value="tz" placeholder="000000000" dir="ltr"
                            style="text-align: center"
                            @input="onTzInput"
                        />
                    </div>
                    <div>
                        <FieldLabel>תאריך חתימה</FieldLabel>
                        <input
                            class="input num" :value="today" readonly tabindex="-1" dir="ltr"
                            style="text-align: center; background: var(--surface-sunk); color: var(--ink-2)"
                        />
                    </div>
                </div>

                <p :style="{ margin: '0 0 18px', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-2)', textWrap: 'pretty' }">
                    מייפה את בית המרקחת טריפוליום בכתובת רח׳ נוף 25, ערד, להעביר אליי תכשירים על ידי שליח.
                </p>

                <div style="margin-bottom: 18px">
                    <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px">התחייבות:</div>
                    <p :style="{ margin: '0 0 8px', fontSize: '13px', lineHeight: 1.7, color: 'var(--ink-2)', textWrap: 'pretty' }">
                        מתחייב לוותר על קבלת ייעוץ רוקחי כמקובל בבית מרקחת בעת ניפוק התכשירים ומסכים לקבל מידע וייעוץ תרופתי באמצעות טופס שיצורף לתכשירים ו/או לקבל מידע נוסף באמצעים המפורטים בפרטי ההתקשרות עם בית המרקחת.
                    </p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.7; color: var(--ink-3)">
                        ✱ אחריות הספקת התכשיר הינה של הרוקח האחראי בבית המרקחת וההובלה תיעשה בעזרת שליח.
                    </p>
                </div>

                <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px">חתימה:</div>
                <SignaturePad @ink-change="hasSig = $event" />

                <!-- TODO(backend): persist the signed POA (name, ID number, signature) with the order. -->
                <button
                    :disabled="!canSubmit"
                    :style="{
                        marginTop: '18px', height: '46px', paddingInline: '24px', fontSize: '15px', fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: '9px',
                        background: canSubmit ? 'var(--accent)' : 'var(--surface-sunk)',
                        color: canSubmit ? '#fff' : 'var(--ink-4)',
                        border: 'none', borderRadius: 'var(--r-control)',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                    }"
                    @click="emit('confirm', { name: name.trim(), tz: tz.trim(), date: today })"
                >
                    <Icon name="check" :size="17" :color="canSubmit ? '#fff' : 'var(--ink-4)'" :stroke="2.2" />
                    אני מאשר/ת חתימה על טופס זה
                </button>
            </div>
        </div>
    </div>
</template>
