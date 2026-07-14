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
import { reactive, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import { visit } from '@/lib/routes';
import Icon from '@/Components/ui/Icon.vue';
import ProfileField from '@/Components/profile/ProfileField.vue';
import ReadOnlyField from '@/Components/profile/ReadOnlyField.vue';
import ProfileSelect from '@/Components/profile/ProfileSelect.vue';
import AddressesEditor from '@/Components/profile/AddressesEditor.vue';
import ProfileSection from '@/Components/profile/ProfileSection.vue';
import { tfLoadAddresses, tfSaveAddresses } from '@/composables/useAddresses';

// Specialization option lists — mirrored from the registration screen.
const TF_TREATMENTS_OPTS = [
    'נטורופתיה', 'הרבולוגיה / צמחי מרפא', 'רפואה סינית', 'הומאופתיה',
    'תזונה קלינית', 'רפלקסולוגיה', 'ארומתרפיה', 'פרחי באך',
];
const TF_SPECIALTIES_OPTS = [
    'נשים ופוריות', 'מערכת העיכול', 'מערכת החיסון', 'עור ושיער',
    'נפש ורגש', 'כאב כרוני', 'ילדים', 'גיל המעבר', 'מערכת הנשימה',
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

// Any edit invalidates the "saved" banner until the next save.
function setField(key, value) {
    form[key] = value;
    saved.value = false;
}
function setAddrs(next) {
    addresses.value = next;
    saved.value = false;
}

// Inertia resets scroll on visit, so no explicit scrollTo here.
function goBack() {
    visit('home');
}

// TODO(backend): also persist the form fields (name, specialization, clinic,
// license) once a profile endpoint exists; only addresses persist for now.
function save() {
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
                style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); cursor: pointer; margin-bottom: 18px"
                @click="goBack"
            >
                <Icon name="arrow_right" :size="15" /> חזרה ללוח הבקרה
            </a>

            <!-- Head -->
            <div style="margin-bottom: 26px">
                <h1 class="page-title" style="margin: 0">עריכת פרטים אישיים</h1>
                <p class="page-sub" style="margin-top: 6px">
                    עדכן את שמך, ההתמחות, פרטי המרפאה והסיסמה שלך.
                </p>
            </div>

            <div
                v-if="saved"
                :style="{
                    display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '20px',
                    padding: '13px 16px', borderRadius: 'var(--r-card)',
                    background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                    color: 'var(--accent-ink)', fontSize: '13.5px', fontWeight: 600,
                }"
            >
                <Icon name="check" :size="17" color="var(--accent)" :stroke="2.2" />
                הפרטים נשמרו בהצלחה.
            </div>

            <!-- Identity card -->
            <div class="col gap-16">
                <!-- Personal -->
                <ProfileSection title="פרטים אישיים" desc="השם יוצג במסמכי ההזמנה ובתקשורת עם המטופלים.">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
                        <ProfileField label="שם פרטי" :model-value="form.firstName" @update:model-value="setField('firstName', $event)" />
                        <ProfileField label="שם משפחה" :model-value="form.lastName" @update:model-value="setField('lastName', $event)" />
                    </div>
                </ProfileSection>

                <!-- Specialization -->
                <ProfileSection title="התמחות" desc="בחר את סוג הטיפול ותחום ההתמחות מתוך הרשימות.">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
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
                <ProfileSection title="פרטי התקשרות" desc="האימייל והטלפון נעולים לעריכה ומשמשים לזיהוי החשבון.">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
                        <ReadOnlyField label="אימייל" :value="form.email" dir="ltr" />
                        <ReadOnlyField label="טלפון נייד" :value="form.phone" dir="ltr" />
                    </div>
                </ProfileSection>

                <!-- Professional -->
                <ProfileSection title="פרטים מקצועיים" desc="שם המרפאה ומספר הרישיון מופיעים מול בית המרקחת.">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px">
                        <ProfileField label="שם המרפאה / העסק" :model-value="form.clinic" @update:model-value="setField('clinic', $event)" />
                        <ProfileField
                            label="מספר רישיון"
                            :model-value="form.license"
                            dir="ltr"
                            :style="{ textAlign: 'right' }"
                            @update:model-value="setField('license', $event)"
                        />
                    </div>
                </ProfileSection>

                <!-- Shipping addresses — source of truth for the cart's "משלוח אליי" -->
                <ProfileSection title="כתובות למשלוח" desc="ניתן לשמור כמה כתובות (מרפאה, בית…). הכתובת שתסומן כברירת מחדל תוצע בסל כשהמשלוח אלייך.">
                    <AddressesEditor :list="addresses" @update:list="setAddrs" />
                </ProfileSection>

                <!-- Password — links to its own standalone page -->
                <ProfileSection title="סיסמה ואבטחה" desc="מומלץ להחליף סיסמה אחת לכמה חודשים.">
                    <button class="btn btn--ghost" @click="visit('change-password')">
                        <Icon name="lock" :size="16" /> לשינוי סיסמה
                    </button>
                </ProfileSection>
            </div>

            <!-- Save bar -->
            <div
                style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 22px; padding-top: 22px; border-top: 1px solid var(--line)"
            >
                <button class="btn btn--ghost" @click="goBack">ביטול</button>
                <button class="btn btn--primary" style="padding-inline: 26px" @click="save">
                    <Icon name="check" :size="16" :stroke="2.2" /> שמור שינויים
                </button>
            </div>

        </div>
    </div>
</template>
