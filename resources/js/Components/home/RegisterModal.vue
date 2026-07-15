<script setup>
// REGISTRATION MODAL — opens from a promo's "מילוי טופס הרשמה" CTA.
import { ref, reactive, computed, nextTick } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import FieldLabel from '@/Components/ui/FieldLabel.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';
import { isEmail, isPhone } from '@/Components/auth/validators';
import { useModal } from '@/composables/useModal';

defineProps({
    promo: { type: Object, required: true },
});
const emit = defineEmits(['close']);

const { dialogRef } = useModal(() => emit('close'));

const done = ref(false);
const form = ref({ name: '', phone: '', email: '' });
const errors = reactive({ name: '', phone: '', email: '' });
// Keep the existing disabled-until-filled gating on the button…
const valid = computed(() => form.value.name.trim() && form.value.phone.trim());

// …and additionally block on invalid format at submit time.
function validate() {
    errors.name = form.value.name.trim() ? '' : 'יש להזין שם מלא';
    errors.phone = !form.value.phone.trim()
        ? 'יש להזין מספר טלפון'
        : (!isPhone(form.value.phone) ? 'מספר הטלפון אינו תקין' : '');
    errors.email = (form.value.email.trim() && !isEmail(form.value.email))
        ? 'כתובת הדוא"ל אינה תקינה'
        : '';
    return !errors.name && !errors.phone && !errors.email;
}

// TODO(backend): submit the registration to a Laravel endpoint; `done`
// currently flips client-side only, mirroring the prototype.
function submit() {
    if (!validate()) {
        nextTick(() => { document.querySelector('.reg-scope [aria-invalid="true"]')?.focus(); });
        return;
    }
    done.value = true;
}

// U3 — don't discard entered data on an accidental backdrop click. The click is
// a no-op once any field has content; the explicit close button still closes.
function onBackdrop() {
    const f = form.value;
    if (f.name.trim() || f.phone.trim() || f.email.trim()) return;
    emit('close');
}
</script>

<template>
    <div
        :style="{
            position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,30,18,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(2px)',
        }"
        @click="onBackdrop"
    >
        <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            aria-labelledby="reg-title"
            class="reg-scope"
            :style="{
                width: '460px', maxWidth: '100%', background: 'var(--surface)', borderRadius: '10px', overflow: 'hidden',
                boxShadow: '0 40px 80px -30px rgba(20,30,18,0.6)',
            }"
            @click.stop
        >
            <!-- header -->
            <div style="background: var(--accent); color: #fff; padding: 22px 26px; position: relative">
                <button
                    aria-label="סגירה"
                    :style="{
                        position: 'absolute', insetInlineEnd: '14px', top: '14px', width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.14)', border: 'none', color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }"
                    @click="emit('close')"
                ><Icon name="x" :size="18" color="#fff" /></button>
                <div style="font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.85; margin-bottom: 6px">הרשמה · {{ promo.kicker }}</div>
                <div id="reg-title" style="font-size: 20px; font-weight: 700; line-height: 1.25">{{ promo.title }} {{ promo.titleB }}</div>
                <div v-if="promo.when" class="num" dir="ltr" style="margin-top: 10px; font-size: 13px; font-weight: 600; opacity: 0.92; text-align: start">
                    {{ promo.when.date }} · {{ promo.when.time }}
                </div>
            </div>

            <div v-if="done" style="padding: 40px 30px; text-align: center">
                <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--accent-tint-strong); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px">
                    <Icon name="check" :size="28" color="var(--accent)" />
                </div>
                <div style="font-size: 19px; font-weight: 700; color: var(--ink); margin-bottom: 8px">נרשמת בהצלחה!</div>
                <p style="font-size: 14.5px; color: var(--ink-2); line-height: 1.6; margin: 0 0 22px; text-wrap: pretty">
                    {{ promo.note || 'נשמור לך מקום ונשלח את הפרטים בוואטסאפ.' }}
                </p>
                <button class="btn btn--accent" style="height: 46px; padding: 0 28px" @click="emit('close')">סגירה</button>
            </div>
            <form novalidate v-else style="padding: 26px 26px 28px; display: flex; flex-direction: column; gap: 16px" @submit.prevent="submit">
                <div>
                    <FieldLabel for="reg-name">
                        שם מלא<span aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
                    </FieldLabel>
                    <input
                        id="reg-name"
                        v-model="form.name"
                        class="input"
                        placeholder="ישראלה ישראלי"
                        autofocus
                        autocomplete="name"
                        maxlength="60"
                        enterkeyhint="next"
                        aria-required="true"
                        :aria-invalid="errors.name ? 'true' : undefined"
                        :aria-describedby="errors.name ? 'reg-name-error' : undefined"
                        :style="errors.name ? { borderColor: 'var(--danger)' } : undefined"
                    />
                    <ErrMsg v-if="errors.name" id="reg-name-error" role="alert">{{ errors.name }}</ErrMsg>
                </div>
                <div>
                    <FieldLabel for="reg-phone">
                        טלפון נייד<span aria-hidden="true" style="color: var(--danger); margin-inline-start: 3px">*</span>
                    </FieldLabel>
                    <input
                        id="reg-phone"
                        v-model="form.phone"
                        class="input"
                        placeholder="050-0000000"
                        inputmode="tel"
                        autocomplete="tel"
                        maxlength="20"
                        enterkeyhint="next"
                        dir="ltr"
                        aria-required="true"
                        :aria-invalid="errors.phone ? 'true' : undefined"
                        :aria-describedby="errors.phone ? 'reg-phone-error' : undefined"
                        :style="errors.phone ? { borderColor: 'var(--danger)', textAlign: 'right' } : { textAlign: 'right' }"
                    />
                    <ErrMsg v-if="errors.phone" id="reg-phone-error" role="alert">{{ errors.phone }}</ErrMsg>
                </div>
                <div>
                    <FieldLabel for="reg-email">אימייל (לא חובה)</FieldLabel>
                    <input
                        id="reg-email"
                        v-model="form.email"
                        class="input"
                        placeholder="name@example.com"
                        type="email"
                        inputmode="email"
                        autocomplete="email"
                        maxlength="254"
                        enterkeyhint="send"
                        dir="ltr"
                        autocapitalize="off"
                        autocorrect="off"
                        :spellcheck="false"
                        aria-required="false"
                        :aria-invalid="errors.email ? 'true' : undefined"
                        :aria-describedby="errors.email ? 'reg-email-error' : undefined"
                        :style="errors.email ? { borderColor: 'var(--danger)', textAlign: 'right' } : { textAlign: 'right' }"
                    />
                    <ErrMsg v-if="errors.email" id="reg-email-error" role="alert">{{ errors.email }}</ErrMsg>
                </div>
                <button
                    type="submit"
                    class="btn btn--accent"
                    :disabled="!valid"
                    :style="{ height: '48px', marginTop: '4px', fontSize: '15px', whiteSpace: 'nowrap', opacity: valid ? 1 : 0.5 }"
                >
                    <Icon name="check" :size="17" color="#fff" /> שליחת ההרשמה
                </button>
                <p style="margin: 0; font-size: 12px; color: var(--ink-3); text-align: center; display: flex; gap: 6px; justify-content: center; align-items: center">
                    <Icon name="lock" :size="13" color="var(--ink-4)" /> הפרטים נשמרים במערכת טריפוליום בלבד
                </p>
            </form>
        </div>
    </div>
</template>
