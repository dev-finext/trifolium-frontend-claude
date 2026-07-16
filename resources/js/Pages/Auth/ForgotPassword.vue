<script setup>
// A4 שכחתי סיסמה — request a password-reset link by email.
import { nextTick, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthInput from '@/Components/auth/AuthInput.vue';
import AuthSplitCard from '@/Components/auth/AuthSplitCard.vue';
import BackToLogin from '@/Components/auth/BackToLogin.vue';
import { isEmail } from '@/Components/auth/validators';
import { visit } from '@/lib/routes';

const email = ref('');
const err = ref('');
const emailField = ref(null);

// F10 — surface the error and move focus back to the email field.
function fail(message) {
    err.value = message;
    nextTick(() => emailField.value?.focus());
}

// TODO(backend): POST /forgot-password; the server sends the reset mail and
// redirects to the confirmation screen with the email echoed back.
function submit() {
    if (!email.value.trim()) { fail('נא להזין כתובת דוא״ל'); return; }
    if (!isEmail(email.value)) { fail('כתובת דוא״ל אינה תקינה'); return; }
    err.value = '';
    // For security we never reveal whether the account exists — always advance
    // to the same confirmation screen.
    visit('forgot-sent', { email: email.value });
}

function onInput(v) { email.value = v; err.value = ''; }
</script>

<template>
    <Head title="שחזור סיסמה" />
    <!-- data-screen-label falls through to AuthSplitCard's root element -->
    <AuthSplitCard data-screen-label="A4 שכחתי סיסמה">
        <form novalidate @submit.prevent="submit">
            <span
                class="inline-flex items-center justify-center w-[46px] h-[46px] mb-[18px] bg-accent-tint border border-accent-tint-strong rounded-[50%]"
            ><Icon name="lock" :size="22" color="var(--accent)" /></span>
            <h1 class="m-0 text-[23px] font-semibold leading-[1.3] tracking-[-0.01em]">
                שחזור סיסמה
            </h1>
            <p class="page-sub mt-[8px] mx-0 mb-[32px] leading-[1.7] text-pretty">
                הזינו את כתובת הדוא״ל המשויכת לחשבון. אם קיים חשבון תואם, נשלח אליו קישור לאיפוס הסיסמה.
            </p>

            <div class="flex flex-col gap-[18px]">
                <AuthInput
                    ref="emailField"
                    label="כתובת דוא״ל" icon="mail" type="email"
                    :model-value="email" placeholder="name@example.com"
                    auto-complete="email" enterkeyhint="go" :error="err"
                    @update:model-value="onInput"
                />
                <button type="submit" class="btn btn--primary w-full mt-[6px]">
                    שלחו לי קישור לאיפוס
                </button>
            </div>

            <BackToLogin />
        </form>
    </AuthSplitCard>
</template>
