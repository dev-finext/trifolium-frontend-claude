<script setup>
// A2 רישום למערכת — registration in 3 steps (personal / address /
// professional) with a sticky wizard-style step indicator.
import { computed, nextTick, reactive, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import AuthInput from '@/components/ui/AuthInput.vue';
import AuthSelect from '@/components/ui/AuthSelect.vue';
import Brandmark from '@/components/shared/Brandmark.vue';
import CheckRow from '@/components/ui/CheckRow.vue';
import Dropzone from '@/components/ui/Dropzone.vue';
import ErrMsg from '@/components/ui/ErrMsg.vue';
import Icon from '@/components/ui/Icon.vue';
import RegStepIndicator from '@/components/shared/auth/RegStepIndicator.vue';
import RoleRadio from '@/components/shared/auth/RoleRadio.vue';
import { TF_CITIES, TF_STREETS, TF_TREATMENTS, TF_SPECIALTIES } from '@/data/options';
import { isEmail, isPhone, isIsraeliID, onlyDigits } from '@/lib/validators';
import { visit } from '@/lib/routes';

const SECTIONS = [
    { id: 'personal', title: 'פרטים אישיים' },
    { id: 'address', title: 'כתובת' },
    { id: 'professional', title: 'פרטים מקצועיים' },
];

const active = ref('personal');
const done = reactive({ personal: false, address: false });
const err = ref({});

// F8 — DOB bounds: no future dates, and a sane lower bound.
const today = new Date().toISOString().slice(0, 10);
const DOB_MIN = '1900-01-01';

// F9 — clinic-description length cap (with a live counter in the template).
const CLINIC_DESC_MAX = 500;

// Wraps the active step's markup so focusFirstInvalid() can scan its controls.
const stepRef = ref(null);

// form state
const p = reactive({ first: '', last: '', dob: '', id: '', email: '', phone: '' });
const a = reactive({ city: '', street: '', house: '', apt: '', floor: '', entrance: '' });
const role = ref(null);
const stu = reactive({ college: '', teacher: '', head: '', treatment: '', cert: null, stage: false });
const th = reactive({
    gradYear: '', treatment: '', cert: null, specialty: '', listed: false,
    clinicName: '', clinicDesc: '', clinicImg: null,
});

const clr = (k) => { const n = { ...err.value }; delete n[k]; err.value = n; };

// ---- validation ----
// F5 — these per-step validators are now wired into advance() (see below), so
// each step is gated before it can advance or submit.
const validatePersonal = () => {
    const e = {};
    if (!p.first.trim()) e.first = 'שדה חובה';
    if (!p.last.trim()) e.last = 'שדה חובה';
    if (!p.dob) e.dob = 'נא לבחור תאריך';
    if (!p.id.trim()) e.id = 'שדה חובה';
    else if (!isIsraeliID(p.id)) e.id = 'מספר זהות אינו תקין';
    if (!p.email.trim()) e.email = 'שדה חובה';
    else if (!isEmail(p.email)) e.email = 'כתובת דוא״ל אינה תקינה';
    if (!p.phone.trim()) e.phone = 'שדה חובה';
    else if (!isPhone(p.phone)) e.phone = 'מספר טלפון אינו תקין';
    return e;
};
const validateAddress = () => {
    const e = {};
    if (!a.city) e.city = 'נא לבחור עיר';
    if (!a.street) e.street = 'נא לבחור רחוב';
    if (!a.house.trim()) e.house = 'שדה חובה';
    return e;
};
const validateProfessional = () => {
    const e = {};
    // A role must be chosen before the professional details can be validated.
    if (!role.value) { e.role = 'נא לבחור סטודנט או מטפל/ת'; return e; }
    if (role.value === 'student') {
        if (!stu.college.trim()) e.college = 'שדה חובה';
        if (!stu.treatment) e.treatment = 'נא לבחור';
        if (!stu.cert) e.cert = 'נא לצרף קובץ';
    } else if (role.value === 'therapist') {
        const y = onlyDigits(th.gradYear);
        if (!y) e.gradYear = 'שדה חובה';
        else if (+y < 1950 || +y > 2026) e.gradYear = 'שנה אינה תקינה';
        if (!th.treatment) e.treatment = 'נא לבחור';
        if (!th.cert) e.cert = 'נא לצרף קובץ';
        if (!th.specialty) e.specialty = 'נא לבחור';
        if (th.listed && !th.clinicName.trim()) e.clinicName = 'שדה חובה';
    }
    return e;
};

// F5 — validators per step, so advance()/submit can actually gate on them.
const VALIDATORS = {
    personal: validatePersonal,
    address: validateAddress,
    professional: validateProfessional,
};

// F5 — move focus to the first invalid control in the current step. Matches
// AuthInput (aria-invalid) and AuthSelect (danger border) alike, so it works
// without reaching into the select component.
function focusFirstInvalid() {
    nextTick(() => {
        const root = stepRef.value;
        if (!root) return;
        for (const el of root.querySelectorAll('input, select, textarea')) {
            if (el.getAttribute('aria-invalid') === 'true' || el.style.borderColor === 'var(--danger)') {
                el.focus();
                break;
            }
        }
    });
}

// F5 — validate the current step before advancing/submitting; block and show
// inline errors (and focus the first one) when invalid.
// TODO(backend): on the final step, POST the whole registration payload; the
// server decides whether to accept and redirects to the submitted screen.
function advance(from, to) {
    const e = VALIDATORS[from] ? VALIDATORS[from]() : {};
    err.value = e;
    if (Object.keys(e).length > 0) { focusFirstInvalid(); return; }
    done[from] = true;
    if (to) { active.value = to; window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else visit('submitted');
}

function reopen(id) { active.value = id; err.value = {}; }

function selectRole(v) { role.value = v; err.value = {}; }

// Current step number (1-based) for the progress bar.
const currentStep = computed(() => SECTIONS.findIndex(s => s.id === active.value) + 1);
</script>

<template>
    <Head title="רישום למערכת" />
    <div class="reg-scope min-h-screen bg-bg" data-screen-label="A2 רישום למערכת">
        <!-- Header -->
        <header class="bg-surface border-b border-line">
            <div class="max-w-[760px] my-0 mx-auto pt-[22px] px-[24px] pb-[26px]">
                <div class="flex justify-center mb-[18px]">
                    <Brandmark tone="dark" :height="52" />
                </div>
                <div class="flex items-start justify-between gap-[20px]">
                    <div>
                        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em]">
                            מערכת טריפוליום – רישום למערכת הרוקחית
                        </h1>
                        <p class="page-sub mt-[6px] mx-0 mb-0">
                            אנא הזינו את פרטיכם וניצור עמכם קשר בהקדם
                        </p>
                    </div>
                    <span
                        class="inline-flex items-center justify-center w-[46px] h-[46px] shrink-0 bg-accent-tint border border-line rounded-[50%]"
                    ><Icon name="user" :size="22" color="var(--accent)" /></span>
                </div>
            </div>
        </header>

        <RegStepIndicator :sections="SECTIONS" :current="currentStep" :done="done" @jump="reopen" />

        <main class="max-w-[760px] my-0 mx-auto pt-[36px] px-[24px] pb-[96px]">
            <div ref="stepRef" class="flex flex-col gap-[26px]">
                <!-- ----- ACTIVE STEP ----- -->
                <div v-if="active === 'personal'" class="flex flex-col gap-[24px]">
                    <div class="grid grid-cols-[repeat(3,1fr)] gap-y-[20px] gap-x-[22px]">
                        <AuthInput label="שם פרטי" icon="user" required auto-complete="given-name" enterkeyhint="next" :model-value="p.first" :error="err.first || ''" @update:model-value="(v) => { p.first = v; clr('first'); }" />
                        <AuthInput label="שם משפחה" icon="user" required auto-complete="family-name" enterkeyhint="next" :model-value="p.last" :error="err.last || ''" @update:model-value="(v) => { p.last = v; clr('last'); }" />
                        <AuthInput label="תאריך לידה" icon="calendar" type="date" dir="ltr" required auto-complete="bday" :min="DOB_MIN" :max="today" :model-value="p.dob" :error="err.dob || ''" @update:model-value="(v) => { p.dob = v; clr('dob'); }" />
                        <AuthInput label="מספר זהות" icon="user" numeric required placeholder="9 ספרות" input-mode="numeric" enterkeyhint="next" :max-length="9" :model-value="p.id" :error="err.id || ''" @update:model-value="(v) => { p.id = onlyDigits(v); clr('id'); }" />
                        <AuthInput label="כתובת דוא״ל" icon="mail" type="email" required placeholder="name@example.com" auto-complete="email" enterkeyhint="next" :model-value="p.email" :error="err.email || ''" @update:model-value="(v) => { p.email = v; clr('email'); }" />
                        <AuthInput label="טלפון" icon="phone" numeric required placeholder="050-0000000" input-mode="tel" auto-complete="tel" enterkeyhint="next" :model-value="p.phone" :error="err.phone || ''" @update:model-value="(v) => { p.phone = v; clr('phone'); }" />
                    </div>
                    <div class="flex justify-start">
                        <button class="btn btn--primary min-w-[140px]" @click="advance('personal', 'address')">המשך</button>
                    </div>
                </div>

                <div v-else-if="active === 'address'" class="flex flex-col gap-[24px]">
                    <div class="grid grid-cols-[repeat(3,1fr)] gap-y-[20px] gap-x-[22px]">
                        <!-- selects show a visible required * in the label (AuthSelect
                             is a shared component outside this task's scope, so it can't
                             carry aria-required). -->
                        <AuthSelect label="עיר *" :options="TF_CITIES" placeholder="בחר/י עיר" :model-value="a.city" :error="err.city || ''" @update:model-value="(v) => { a.city = v; clr('city'); }" />
                        <AuthSelect label="רחוב *" :options="TF_STREETS" placeholder="בחר/י רחוב" :model-value="a.street" :error="err.street || ''" @update:model-value="(v) => { a.street = v; clr('street'); }" />
                        <AuthInput label="מספר בית" numeric required input-mode="numeric" enterkeyhint="next" :model-value="a.house" :error="err.house || ''" @update:model-value="(v) => { a.house = v; clr('house'); }" />
                        <AuthInput v-model="a.apt" label="דירה" numeric input-mode="numeric" enterkeyhint="next" />
                        <AuthInput v-model="a.floor" label="קומה" numeric input-mode="numeric" enterkeyhint="next" />
                        <AuthInput v-model="a.entrance" label="כניסה" enterkeyhint="next" />
                    </div>
                    <div class="flex justify-start">
                        <button class="btn btn--primary min-w-[140px]" @click="advance('address', 'professional')">המשך</button>
                    </div>
                </div>

                <div v-else-if="active === 'professional'" class="flex flex-col gap-[24px]">
                    <!-- role -->
                    <div>
                        <label class="field-label mb-[10px]">
                            אני:<span aria-hidden="true" class="text-danger ms-[2px]">*</span>
                        </label>
                        <RoleRadio
                            :model-value="role"
                            :options="[{ id: 'student', label: 'סטודנט' }, { id: 'therapist', label: 'מטפל/ת' }]"
                            @update:model-value="selectRole"
                        />
                        <ErrMsg v-if="err.role" role="alert">{{ err.role }}</ErrMsg>
                    </div>

                    <div v-if="role === 'student'" class="flex flex-col gap-[24px]">
                        <div class="grid grid-cols-[repeat(3,1fr)] gap-y-[20px] gap-x-[22px]">
                            <AuthInput label="שם המכללה" required enterkeyhint="next" :model-value="stu.college" :error="err.college || ''" @update:model-value="(v) => { stu.college = v; clr('college'); }" />
                            <AuthInput v-model="stu.teacher" label="שם המורה" enterkeyhint="next" />
                            <AuthInput v-model="stu.head" label="שם מנהל/ת המגמה" enterkeyhint="next" />
                            <AuthSelect label="סוג טיפול *" :options="TF_TREATMENTS" placeholder="בחר/י סוג טיפול" :model-value="stu.treatment" :error="err.treatment || ''" @update:model-value="(v) => { stu.treatment = v; clr('treatment'); }" />
                        </div>
                        <Dropzone label="אישור לימודים מהמכללה" placeholder="גרור/העלה קובץ תעודת הסמכה" :model-value="stu.cert" @update:model-value="(f) => { stu.cert = f; clr('cert'); }" />
                        <ErrMsg v-if="err.cert">{{ err.cert }}</ErrMsg>
                        <CheckRow v-model="stu.stage">
                            אני בסטאז' מטפלים של המכללה
                        </CheckRow>
                    </div>

                    <div v-if="role === 'therapist'" class="flex flex-col gap-[24px]">
                        <div class="grid grid-cols-[repeat(3,1fr)] gap-y-[20px] gap-x-[22px]">
                            <AuthInput label="שנת סיום הלימודים" numeric required placeholder="2026" input-mode="numeric" enterkeyhint="next" :max-length="4" :model-value="th.gradYear" :error="err.gradYear || ''" @update:model-value="(v) => { th.gradYear = onlyDigits(v); clr('gradYear'); }" />
                            <AuthSelect label="סוג טיפול *" :options="TF_TREATMENTS" placeholder="בחר/י סוג טיפול" :model-value="th.treatment" :error="err.treatment || ''" @update:model-value="(v) => { th.treatment = v; clr('treatment'); }" />
                            <AuthSelect label="תחום התמחות *" :options="TF_SPECIALTIES" placeholder="בחר תחום" :model-value="th.specialty" :error="err.specialty || ''" @update:model-value="(v) => { th.specialty = v; clr('specialty'); }" />
                        </div>
                        <Dropzone label="קובץ תעודת הסמכה" placeholder="גרור/העלה קובץ תעודת הסמכה" :model-value="th.cert" @update:model-value="(f) => { th.cert = f; clr('cert'); }" />
                        <ErrMsg v-if="err.cert">{{ err.cert }}</ErrMsg>

                        <CheckRow v-model="th.listed">
                            אני רוצה להופיע כמטפל באתר בית המרקחת
                        </CheckRow>

                        <div
                            v-if="th.listed"
                            class="flex flex-col gap-[20px] p-[22px] bg-accent-tint border border-line [border-inline-start:3px_solid_var(--accent)] rounded-card"
                        >
                            <p class="m-0 text-[13px] leading-[1.75] text-ink-2 text-pretty">
                                בית מרקחת טריפוליום שומר את הנתונים ויעלה אותם לאתר ע״פ שיקול דעת ותזמון מתאים ובהתאם להיקף הפעילות שלך אצלנו. בית המרקחת לא לוקח אחריות על אופן הטיפול בקליניקה הפרטית שלך.
                            </p>
                            <AuthInput label="שם הקליניקה" icon="home" required enterkeyhint="next" :model-value="th.clinicName" :error="err.clinicName || ''" @update:model-value="(v) => { th.clinicName = v; clr('clinicName'); }" />
                            <div>
                                <label class="field-label" for="reg-clinic-desc">תיאור העבודה שלי / תיאור הקליניקה שלי</label>
                                <textarea
                                    id="reg-clinic-desc"
                                    v-model="th.clinicDesc"
                                    class="input h-auto py-[12px] px-[14px] resize-y leading-[1.6]" :rows="4" :maxlength="CLINIC_DESC_MAX"
                                />
                                <!-- F9 — live character counter -->
                                <div class="mt-[4px] text-[12px] text-ink-4 text-start" aria-live="polite">
                                    {{ th.clinicDesc.length }}/{{ CLINIC_DESC_MAX }}
                                </div>
                            </div>
                            <Dropzone v-model="th.clinicImg" kind="image" label="תמונתך/תמונת הקליניקה" placeholder="גרור/העלה תמונה" />
                        </div>
                    </div>

                    <div class="flex justify-start">
                        <button
                            class="btn btn--primary min-w-[160px]"
                            @click="advance('professional', null)"
                        >שלח לאישור</button>
                    </div>
                </div>
            </div>

            <!-- back to login -->
            <div class="mt-[36px] text-center">
                <a class="text-[13.5px] text-ink-3 cursor-pointer" @click="visit('login')">
                    כבר רשומים? חזרה לכניסה
                </a>
            </div>
        </main>
    </div>
</template>
