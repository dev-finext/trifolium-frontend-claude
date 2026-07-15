<script setup>
// צור קשר — Contact page. Two-column: contact form (start) + contact details (end).
import { ref, reactive, nextTick } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import ContactField from '@/Components/contact/ContactField.vue';
import InfoRow from '@/Components/contact/InfoRow.vue';
import SocialGlyph from '@/Components/contact/SocialGlyph.vue';
import { isEmail, isPhone } from '@/Components/auth/validators';

const CONTACT_INFO = {
    company: 'טריפוליום בע"מ',
    address: 'נוף 25, ערד',
    hours: 'שעות פתיחה: 9:00-14:00',
    phone: '077-200-2717',
    email: 'order@trifolium.co.il',
};

const SOCIALS = [
    { id: 'whatsapp', label: 'וואטסאפ' },
    { id: 'facebook', label: 'פייסבוק' },
    { id: 'instagram', label: 'אינסטגרם' },
    { id: 'youtube', label: 'יוטיוב' },
];

const MESSAGE_MAX = 1000;

const form = ref({ name: '', business: '', email: '', phone: '', message: '' });
const errors = reactive({ name: '', email: '', phone: '', message: '' });
const sent = ref(false);
const sending = ref(false);

// Validate; returns true when the form may be submitted. Requires a name, a
// message, and at least one contact channel; validates each channel's format.
function validate() {
    errors.name = form.value.name.trim() ? '' : 'יש להזין שם מלא';
    errors.email = '';
    errors.phone = '';

    const hasEmail = form.value.email.trim();
    const hasPhone = form.value.phone.trim();
    if (!hasEmail && !hasPhone) {
        errors.email = 'יש להזין דואר אלקטרוני או טלפון';
        errors.phone = 'יש להזין דואר אלקטרוני או טלפון';
    } else {
        if (hasEmail && !isEmail(form.value.email)) errors.email = 'כתובת הדוא"ל אינה תקינה';
        if (hasPhone && !isPhone(form.value.phone)) errors.phone = 'מספר הטלפון אינו תקין';
    }

    errors.message = form.value.message.trim() ? '' : 'יש להזין הודעה';

    return !errors.name && !errors.email && !errors.phone && !errors.message;
}

// TODO(backend): replace the setTimeout with Inertia's useForm().post('/contact')
// once the Laravel endpoint exists; `sent` then keys off the server response.
function submit() {
    if (sending.value) return; // guard double-submit
    if (!validate()) {
        nextTick(() => { document.querySelector('.card [aria-invalid="true"]')?.focus(); });
        return;
    }
    sending.value = true;
    setTimeout(() => {
        sending.value = false;
        sent.value = true;
        setTimeout(() => { sent.value = false; }, 3200);
    }, 3200);
}
</script>

<template>
    <Head title="יצירת קשר" />
    <div class="page">
        <div class="page__inner">
            <!-- Centered header -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px">
                <h1 class="page-title" style="margin: 0; font-size: 30px">יצירת קשר</h1>
                <span
                    :style="{
                        width: '40px', height: '40px', borderRadius: '11px',
                        background: 'var(--accent-tint)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }"
                >
                    <Icon name="mail" :size="20" color="var(--accent)" />
                </span>
            </div>

            <div
                :style="{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) 340px',
                    gap: '28px',
                    alignItems: 'stretch',
                }"
            >
                <!-- Form card (start side) -->
                <form novalidate class="card" style="padding: 28px 32px 32px" @submit.prevent="submit">
                    <h2 style="margin: 0 0 4px; font-size: 19px; font-weight: 600; color: var(--ink)">
                        טופס יצירת קשר
                    </h2>
                    <p class="page-sub" style="margin: 0 0 28px">
                        מלאי את פרטי ההתקשרות וניצור עמך קשר בהקדם האפשרי
                    </p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px 24px">
                        <ContactField
                            id="contact-name"
                            v-model="form.name"
                            label="שם מלא"
                            required
                            autocomplete="name"
                            enterkeyhint="next"
                            :error="errors.name"
                        />
                        <ContactField
                            id="contact-business"
                            v-model="form.business"
                            label="שם העסק"
                            autocomplete="organization"
                            enterkeyhint="next"
                        />
                        <ContactField
                            id="contact-email"
                            v-model="form.email"
                            label="דואר אלקטרוני"
                            type="email"
                            autocomplete="email"
                            enterkeyhint="next"
                            :error="errors.email"
                        />
                        <ContactField
                            id="contact-phone"
                            v-model="form.phone"
                            label="טלפון"
                            type="tel"
                            autocomplete="tel"
                            enterkeyhint="next"
                            :error="errors.phone"
                        />
                        <div style="grid-column: 1 / -1">
                            <ContactField
                                id="contact-message"
                                v-model="form.message"
                                label="הודעה"
                                textarea
                                required
                                enterkeyhint="send"
                                :maxlength="MESSAGE_MAX"
                                :error="errors.message"
                            />
                        </div>
                    </div>

                    <div style="margin-top: 26px; display: flex; align-items: center; gap: 16px">
                        <button type="submit" class="btn btn--primary" style="min-width: 96px" :disabled="sending">
                            {{ sending ? 'שולח…' : 'שלחי' }}
                        </button>
                        <span
                            v-if="sent"
                            style="display: inline-flex; align-items: center; gap: 7px; font-size: 13.5px; color: var(--accent); font-weight: 500"
                        >
                            <Icon name="check" :size="16" color="var(--accent)" :stroke="2.4" />
                            ההודעה נשלחה — ניצור איתך קשר בהקדם
                        </span>
                    </div>
                </form>

                <!-- Contact details card (end side) -->
                <aside class="card" style="padding: 28px 26px 30px">
                    <h2 style="margin: 0 0 22px; font-size: 18px; font-weight: 600; color: var(--ink); text-align: center">
                        פרטי התקשרות
                    </h2>

                    <div style="font-weight: 700; font-size: 15px; color: var(--ink); text-align: center; margin-bottom: 18px">
                        {{ CONTACT_INFO.company }}
                    </div>

                    <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px">
                        <InfoRow icon="map_pin">
                            <div>{{ CONTACT_INFO.address }}</div>
                            <div style="color: var(--ink-3); font-size: 12.5px; margin-top: 2px">{{ CONTACT_INFO.hours }}</div>
                        </InfoRow>
                        <InfoRow icon="phone">
                            <a :href="`tel:${CONTACT_INFO.phone}`" class="num" dir="ltr" style="display: inline-block">{{ CONTACT_INFO.phone }}</a>
                        </InfoRow>
                        <InfoRow icon="mail">
                            <a :href="`mailto:${CONTACT_INFO.email}`" class="latin">{{ CONTACT_INFO.email }}</a>
                        </InfoRow>
                    </ul>

                    <div style="height: 1px; background: var(--line); margin: 22px 0" />

                    <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px">
                        <li v-for="s in SOCIALS" :key="s.id">
                            <a
                                href="#"
                                class="tf-social-link"
                                :style="{
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
                                    fontSize: '14px', color: 'var(--ink-2)', transition: 'color .15s',
                                }"
                                @click.prevent
                            >
                                <span>{{ s.label }}</span>
                                <span
                                    :style="{
                                        width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                                        border: '1px solid var(--line)', background: 'var(--bg)',
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    }"
                                >
                                    <SocialGlyph :id="s.id" :size="15" />
                                </span>
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
        </div>
    </div>
</template>

<style>
.tf-social-link:hover {
    color: var(--accent) !important;
}
</style>
