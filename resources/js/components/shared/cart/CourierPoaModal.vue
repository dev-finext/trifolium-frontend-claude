<script setup>
// Courier power-of-attorney — required when the order is couriered
// (משלוח אליי / אל המטופל, לא באיסוף עצמי). Signed in a modal.
import { ref, computed, watch } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import FieldLabel from '@/components/ui/FieldLabel.vue';
import { PATIENTS } from '@/data/mock';
import SignaturePad from '@/components/shared/cart/SignaturePad.vue';
import { isIsraeliID } from '@/lib/validators';
import { useModal } from '@/composables/useModal';

const props = defineProps({
    open: { type: Boolean, default: false },
    patientName: { type: String, default: '' },
});
const emit = defineEmits(['close', 'confirm']);

const { dialogRef } = useModal(() => emit('close'));

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

// F33 — the ID must be a structurally valid Israeli ת.ז. (check-digit), not
// merely "long enough". The inline error only surfaces once digits are typed.
const tzValid = computed(() => isIsraeliID(tz.value));
const tzError = computed(() => tz.value.trim().length > 0 && !tzValid.value);
const canSubmit = computed(() => name.value.trim() && tzValid.value && hasSig.value);

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
        class="fixed inset-0 z-[1000] flex items-start justify-center px-[20px] py-[32px] bg-[rgba(20,28,18,0.5)] overflow-y-auto"
        @click="emit('close')"
    >
        <div
            ref="dialogRef"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="poa-title"
            class="w-full max-w-[720px] bg-surface rounded-card overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
            @click.stop
        >
            <!-- Red header -->
            <div
                class="flex items-center justify-between gap-[12px] px-[22px] py-[16px] text-white bg-[#ec5b53]"
            >
                <h3 id="poa-title" class="m-0 text-[17px] font-semibold text-pretty">
                    טופס ייפוי כוח לקבלת תכשירים מבית מרקחת טריפוליום באמצעות שליח
                </h3>
                <button
                    aria-label="סגירה"
                    class="shrink-0 p-[4px] leading-[0] text-white bg-transparent border-none cursor-pointer"
                    @click="emit('close')"
                >
                    <Icon name="x" :size="20" color="#fff" />
                </button>
            </div>

            <div class="pt-[22px] px-[24px] pb-[26px]">
                <div class="small muted mb-[16px]">אני החתום מטה:</div>

                <div class="grid grid-cols-[1fr_1fr_1fr] gap-[14px] mb-[20px]">
                    <div>
                        <FieldLabel for="poa-name">שם מלא</FieldLabel>
                        <input id="poa-name" class="input" :value="name" placeholder="שם מלא" @input="name = $event.target.value" />
                    </div>
                    <div>
                        <FieldLabel for="poa-tz">מספר ת.ז.</FieldLabel>
                        <input
                            id="poa-tz"
                            class="input num text-center" :value="tz" placeholder="000000000" dir="ltr"
                            inputmode="numeric" maxlength="9"
                            :aria-invalid="tzError"
                            :aria-describedby="tzError ? 'poa-tz-error' : undefined"
                            @input="onTzInput"
                        />
                        <div
                            v-if="tzError"
                            id="poa-tz-error"
                            role="alert"
                            class="mt-[6px] text-[12px] leading-[1.4] text-danger"
                        >
                            מספר ת.ז. אינו תקין
                        </div>
                    </div>
                    <div>
                        <FieldLabel for="poa-date">תאריך חתימה</FieldLabel>
                        <input
                            id="poa-date"
                            class="input num text-center text-ink-2 bg-surface-sunk" :value="today" readonly tabindex="-1" dir="ltr"
                        />
                    </div>
                </div>

                <p class="m-0 mb-[18px] text-[14px] leading-[1.7] text-ink-2 text-pretty">
                    מייפה את בית המרקחת טריפוליום בכתובת רח׳ נוף 25, ערד, להעביר אליי תכשירים על ידי שליח.
                </p>

                <div class="mb-[18px]">
                    <div class="mb-[8px] text-[14px] font-bold">התחייבות:</div>
                    <p class="m-0 mb-[8px] text-[13px] leading-[1.7] text-ink-2 text-pretty">
                        מתחייב לוותר על קבלת ייעוץ רוקחי כמקובל בבית מרקחת בעת ניפוק התכשירים ומסכים לקבל מידע וייעוץ תרופתי באמצעות טופס שיצורף לתכשירים ו/או לקבל מידע נוסף באמצעים המפורטים בפרטי ההתקשרות עם בית המרקחת.
                    </p>
                    <p class="m-0 text-[13px] leading-[1.7] text-ink-3">
                        ✱ אחריות הספקת התכשיר הינה של הרוקח האחראי בבית המרקחת וההובלה תיעשה בעזרת שליח.
                    </p>
                </div>

                <div class="mb-[8px] text-[14px] font-bold">חתימה:</div>
                <SignaturePad @ink-change="hasSig = $event" />

                <!-- TODO(backend): persist the signed POA (name, ID number, signature) with the order. -->
                <button
                    :disabled="!canSubmit"
                    class="inline-flex items-center gap-[9px] mt-[18px] h-[46px] ps-[24px] pe-[24px] text-[15px] font-semibold border-none rounded-control"
                    :class="canSubmit ? 'bg-accent text-white cursor-pointer' : 'bg-surface-sunk text-ink-4 cursor-not-allowed'"
                    @click="emit('confirm', { name: name.trim(), tz: tz.trim(), date: today })"
                >
                    <Icon name="check" :size="17" :color="canSubmit ? '#fff' : 'var(--ink-4)'" :stroke="2.2" />
                    אני מאשר/ת חתימה על טופס זה
                </button>
            </div>
        </div>
    </div>
</template>
