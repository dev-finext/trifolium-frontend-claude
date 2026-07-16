<script setup>
// צור קשר — Contact page. Two-column: contact form (start) + contact details (end).
import { ref, reactive, nextTick } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/components/ui/Icon.vue';
import ContactField from '@/components/shared/contact/ContactField.vue';
import InfoRow from '@/components/shared/contact/InfoRow.vue';
import SocialGlyph from '@/components/shared/contact/SocialGlyph.vue';
import { isEmail, isPhone } from '@/lib/validators';

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
            <div class="flex items-center justify-center gap-[12px] mb-[32px]">
                <h1 class="page-title m-0 text-[30px]">יצירת קשר</h1>
                <span
                    class="inline-flex items-center justify-center w-[40px] h-[40px] bg-accent-tint rounded-[11px]"
                >
                    <Icon name="mail" :size="20" color="var(--accent)" />
                </span>
            </div>

            <div
                class="grid grid-cols-[minmax(0,1fr)_340px] items-stretch gap-[28px]"
            >
                <!-- Form card (start side) -->
                <form novalidate class="card pt-[28px] px-[32px] pb-[32px]" @submit.prevent="submit">
                    <h2 class="m-0 mb-[4px] text-[19px] font-semibold text-ink">
                        טופס יצירת קשר
                    </h2>
                    <p class="page-sub m-0 mb-[28px]">
                        מלאי את פרטי ההתקשרות וניצור עמך קשר בהקדם האפשרי
                    </p>

                    <div class="grid grid-cols-[1fr_1fr] gap-y-[20px] gap-x-[24px]">
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
                        <div class="col-span-full">
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

                    <div class="flex items-center gap-[16px] mt-[26px]">
                        <button type="submit" class="btn btn--primary min-w-[96px]" :disabled="sending">
                            {{ sending ? 'שולח…' : 'שלחי' }}
                        </button>
                        <span
                            v-if="sent"
                            class="inline-flex items-center gap-[7px] text-[13.5px] font-medium text-accent"
                        >
                            <Icon name="check" :size="16" color="var(--accent)" :stroke="2.4" />
                            ההודעה נשלחה — ניצור איתך קשר בהקדם
                        </span>
                    </div>
                </form>

                <!-- Contact details card (end side) -->
                <aside class="card pt-[28px] px-[26px] pb-[30px]">
                    <h2 class="m-0 mb-[22px] text-[18px] font-semibold text-center text-ink">
                        פרטי התקשרות
                    </h2>

                    <div class="mb-[18px] text-[15px] font-bold text-center text-ink">
                        {{ CONTACT_INFO.company }}
                    </div>

                    <ul class="flex flex-col gap-[14px] m-0 p-0 list-none">
                        <InfoRow icon="map_pin">
                            <div>{{ CONTACT_INFO.address }}</div>
                            <div class="mt-[2px] text-[12.5px] text-ink-3">{{ CONTACT_INFO.hours }}</div>
                        </InfoRow>
                        <InfoRow icon="phone">
                            <a :href="`tel:${CONTACT_INFO.phone}`" class="num inline-block" dir="ltr">{{ CONTACT_INFO.phone }}</a>
                        </InfoRow>
                        <InfoRow icon="mail">
                            <a :href="`mailto:${CONTACT_INFO.email}`" class="latin">{{ CONTACT_INFO.email }}</a>
                        </InfoRow>
                    </ul>

                    <div class="h-[1px] my-[22px] mx-0 bg-(--line)" />

                    <ul class="flex flex-col gap-[14px] m-0 p-0 list-none">
                        <li v-for="s in SOCIALS" :key="s.id">
                            <a
                                href="#"
                                class="tf-social-link flex items-center justify-end gap-[12px] text-[14px] text-ink-2 transition-[color] duration-150"
                                @click.prevent
                            >
                                <span>{{ s.label }}</span>
                                <span
                                    class="inline-flex items-center justify-center w-[30px] h-[30px] shrink-0 bg-bg border border-line rounded-[8px]"
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
