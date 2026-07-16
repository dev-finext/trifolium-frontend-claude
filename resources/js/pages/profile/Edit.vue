<script setup>
// עריכת פרטים אישיים — practitioner account/profile editor.
// Display-only sketch: local state, addresses persisted via the shared store.
//
// Scope (per spec):
//   • שם פרטי / שם משפחה — editable
//   • התמחות — editable, options taken from the registration/login screen
//   • אימייל / טלפון — READ-ONLY (editing forbidden)
//   • שם המרפאה / מספר רישיון — editable
//   • עדכון סיסמה
//   …nothing more, nothing less.
import { Head } from '@inertiajs/vue3';
import { reactive, ref, provide, nextTick } from 'vue';
import AddressesEditor from '@/components/shared/profile/AddressesEditor.vue';
import ProfileField from '@/components/shared/profile/ProfileField.vue';
import ProfileSection from '@/components/shared/profile/ProfileSection.vue';
import ProfileSelect from '@/components/shared/profile/ProfileSelect.vue';
import ReadOnlyField from '@/components/shared/profile/ReadOnlyField.vue';
import Icon from '@/components/ui/Icon.vue';
import { tfLoadAddresses, tfSaveAddresses } from '@/composables/useAddresses';
import { visit } from '@/lib/routes';
import { isPhone } from '@/lib/validators';

// Specialization option lists — mirrored from the registration screen.
const TF_TREATMENTS_OPTS = [
    'נטורופתיה',
    'הרבולוגיה / צמחי מרפא',
    'רפואה סינית',
    'הומאופתיה',
    'תזונה קלינית',
    'רפלקסולוגיה',
    'ארומתרפיה',
    'פרחי באך',
];
const TF_SPECIALTIES_OPTS = [
    'נשים ופוריות',
    'מערכת העיכול',
    'מערכת החיסון',
    'עור ושיער',
    'נפש ורגש',
    'כאב כרוני',
    'ילדים',
    'גיל המעבר',
    'מערכת הנשימה',
];

// TODO(backend): hard-coded practitioner values — replace with real user
// props from the Laravel controller (auth user).
const form = reactive({
    firstName: 'נעמי',
    lastName: 'שגב',
    treatment: 'נטורופתיה',
    specialty: 'נשים ופוריות',
    email: 'naomi.segev@trifolium.co.il',
    phone: '052-481-9230',
    clinic: 'מרפאת שורש — רעננה',
    license: 'NAT-2019-4471',
});
const addresses = ref(tfLoadAddresses());
const saved = ref(false);

// Field-level validation errors. Address errors are keyed by address id and
// provided down to AddressCardEditor (skipping the AddressesEditor middleman).
const errors = reactive({ firstName: '', lastName: '' });
const addrErrors = reactive({});
provide('tfAddrErrors', addrErrors);

// Any edit invalidates the "saved" banner until the next save.
function setField(key, value) {
    form[key] = value;

    if (errors[key] !== undefined) {
        errors[key] = '';
    }

    saved.value = false;
}
function setAddrs(next) {
    addresses.value = next;
    // Clear stale address errors as the user edits; re-validated on save.
    Object.keys(addrErrors).forEach((k) => delete addrErrors[k]);
    saved.value = false;
}

// Inertia resets scroll on visit, so no explicit scrollTo here.
function goBack() {
    visit('home');
}

// Required-field + phone-format validation. Returns true when the profile may
// be saved. Contact email/phone are read-only and therefore not validated.
function validate() {
    errors.firstName = form.firstName.trim() ? '' : 'יש להזין שם פרטי';
    errors.lastName = form.lastName.trim() ? '' : 'יש להזין שם משפחה';
    let ok = !errors.firstName && !errors.lastName;

    Object.keys(addrErrors).forEach((k) => delete addrErrors[k]);
    addresses.value.forEach((a) => {
        const e = {};

        if (!(a.street || '').trim()) {
            e.street = 'יש להזין רחוב ומספר';
        }

        if (!(a.city || '').trim()) {
            e.city = 'יש להזין עיר';
        }

        if (!(a.phone || '').trim()) {
            e.phone = 'יש להזין טלפון';
        } else if (!isPhone(a.phone)) {
            e.phone = 'מספר הטלפון אינו תקין';
        }

        if (Object.keys(e).length) {
            addrErrors[a.id] = e;
            ok = false;
        }
    });

    return ok;
}

// TODO(backend): also persist the form fields (name, specialization, clinic,
// license) once a profile endpoint exists; only addresses persist for now.
function save() {
    if (!validate()) {
        saved.value = false;
        nextTick(() => {
            document.querySelector('[aria-invalid="true"]')?.focus();
        });

        return;
    }

    addresses.value = tfSaveAddresses(addresses.value);
    saved.value = true;
    window.scrollTo(0, 0);
}
</script>

<template>
    <Head title="עריכת פרטים אישיים" />
    <div class="page">
        <div class="page__inner">
            <!-- Breadcrumb -->
            <a
                class="mb-[18px] inline-flex cursor-pointer items-center gap-[6px] text-[13px] text-ink-3"
                @click="goBack"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Head -->
            <div class="mb-[26px]">
                <h1 class="page-title m-0">עריכת פרטים אישיים</h1>
                <p class="page-sub mt-[6px]">
                    עדכן את שמך, ההתמחות, פרטי המרפאה והסיסמה שלך.
                </p>
            </div>

            <div
                v-if="saved"
                class="mb-[20px] flex items-center gap-[11px] rounded-card border border-accent-tint-strong bg-accent-tint px-[16px] py-[13px] text-[13.5px] font-semibold text-accent-ink"
            >
                <Icon
                    name="check"
                    :size="17"
                    color="var(--accent)"
                    :stroke="2.2"
                />
                הפרטים נשמרו בהצלחה.
            </div>

            <!-- Identity card -->
            <div class="col gap-[16px]">
                <!-- Personal -->
                <ProfileSection
                    title="פרטים אישיים"
                    desc="השם יוצג במסמכי ההזמנה ובתקשורת עם המטופלים."
                >
                    <div class="grid grid-cols-2 gap-[16px]">
                        <ProfileField
                            label="שם פרטי"
                            required
                            autocomplete="given-name"
                            :error="errors.firstName"
                            :model-value="form.firstName"
                            @update:model-value="setField('firstName', $event)"
                        />
                        <ProfileField
                            label="שם משפחה"
                            required
                            autocomplete="family-name"
                            :error="errors.lastName"
                            :model-value="form.lastName"
                            @update:model-value="setField('lastName', $event)"
                        />
                    </div>
                </ProfileSection>

                <!-- Specialization -->
                <ProfileSection
                    title="התמחות"
                    desc="בחר את סוג הטיפול ותחום ההתמחות מתוך הרשימות."
                >
                    <div class="grid grid-cols-2 gap-[16px]">
                        <ProfileSelect
                            label="סוג טיפול"
                            :model-value="form.treatment"
                            :options="TF_TREATMENTS_OPTS"
                            placeholder="בחר/י סוג טיפול"
                            @update:model-value="setField('treatment', $event)"
                        />
                        <ProfileSelect
                            label="תחום התמחות"
                            :model-value="form.specialty"
                            :options="TF_SPECIALTIES_OPTS"
                            placeholder="בחר/י תחום"
                            @update:model-value="setField('specialty', $event)"
                        />
                    </div>
                </ProfileSection>

                <!-- Contact — read-only -->
                <ProfileSection
                    title="פרטי התקשרות"
                    desc="האימייל והטלפון נעולים לעריכה ומשמשים לזיהוי החשבון."
                >
                    <div class="grid grid-cols-2 gap-[16px]">
                        <ReadOnlyField
                            label="אימייל"
                            :value="form.email"
                            dir="ltr"
                        />
                        <ReadOnlyField
                            label="טלפון נייד"
                            :value="form.phone"
                            dir="ltr"
                        />
                    </div>
                </ProfileSection>

                <!-- Professional -->
                <ProfileSection
                    title="פרטים מקצועיים"
                    desc="שם המרפאה ומספר הרישיון מופיעים מול בית המרקחת."
                >
                    <div class="grid grid-cols-2 gap-[16px]">
                        <ProfileField
                            label="שם המרפאה / העסק"
                            :model-value="form.clinic"
                            @update:model-value="setField('clinic', $event)"
                        />
                        <ProfileField
                            label="מספר רישיון"
                            :model-value="form.license"
                            dir="ltr"
                            class="text-right"
                            @update:model-value="setField('license', $event)"
                        />
                    </div>
                </ProfileSection>

                <!-- Shipping addresses — source of truth for the cart's "משלוח אליי" -->
                <ProfileSection
                    title="כתובות למשלוח"
                    desc="ניתן לשמור כמה כתובות (מרפאה, בית…). הכתובת שתסומן כברירת מחדל תוצע בסל כשהמשלוח אלייך."
                >
                    <AddressesEditor
                        :list="addresses"
                        @update:list="setAddrs"
                    />
                </ProfileSection>

                <!-- Password — links to its own standalone page -->
                <ProfileSection
                    title="סיסמה ואבטחה"
                    desc="מומלץ להחליף סיסמה אחת לכמה חודשים."
                >
                    <button
                        class="btn btn--ghost"
                        @click="visit('change-password')"
                    >
                        <Icon name="lock" :size="16" /> לשינוי סיסמה
                    </button>
                </ProfileSection>
            </div>

            <!-- Save bar -->
            <div
                class="mt-[22px] flex items-center justify-end gap-[12px] border-t border-line pt-[22px]"
            >
                <button class="btn btn--ghost" @click="goBack">ביטול</button>
                <button class="btn btn--primary px-[26px]" @click="save">
                    <Icon name="check" :size="16" :stroke="2.2" /> שמור שינויים
                </button>
            </div>
        </div>
    </div>
</template>
