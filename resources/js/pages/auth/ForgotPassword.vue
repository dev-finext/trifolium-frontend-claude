<script setup>
// A4 שכחתי סיסמה — request a password-reset link by email.
import { Head } from '@inertiajs/vue3';
import { nextTick, ref } from 'vue';
import AuthSplitCard from '@/components/shared/auth/AuthSplitCard.vue';
import BackToLogin from '@/components/shared/auth/BackToLogin.vue';
import AuthInput from '@/components/ui/AuthInput.vue';
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
import { isEmail } from '@/lib/validators';

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
    if (!email.value.trim()) {
        fail('נא להזין כתובת דוא״ל');

        return;
    }

    if (!isEmail(email.value)) {
        fail('כתובת דוא״ל אינה תקינה');

        return;
    }

    err.value = '';
    // For security we never reveal whether the account exists — always advance
    // to the same confirmation screen.
    visit('forgot-sent', { email: email.value });
}

function onInput(v) {
    email.value = v;
    err.value = '';
}
</script>

<template>
    <Head title="שחזור סיסמה" />
    <!-- data-screen-label falls through to AuthSplitCard's root element -->
    <AuthSplitCard data-screen-label="A4 שכחתי סיסמה">
        <form novalidate @submit.prevent="submit">
            <span
                class="mb-[18px] inline-flex h-[46px] w-[46px] items-center justify-center rounded-[50%] border border-accent-tint-strong bg-accent-tint"
            >
                <Icon name="lock" :size="22" color="var(--accent)" />
            </span>
            <h1
                class="m-0 text-[23px] leading-[1.3] font-semibold tracking-[-0.01em]"
            >
                שחזור סיסמה
            </h1>
            <p
                class="page-sub mx-0 mt-[8px] mb-[32px] leading-[1.7] text-pretty"
            >
                הזינו את כתובת הדוא״ל המשויכת לחשבון. אם קיים חשבון תואם, נשלח
                אליו קישור לאיפוס הסיסמה.
            </p>

            <div class="flex flex-col gap-[18px]">
                <AuthInput
                    ref="emailField"
                    label="כתובת דוא״ל"
                    icon="mail"
                    type="email"
                    :model-value="email"
                    placeholder="name@example.com"
                    auto-complete="email"
                    enterkeyhint="go"
                    :error="err"
                    @update:model-value="onInput"
                />
                <button type="submit" class="btn btn--primary mt-[6px] w-full">
                    שלחו לי קישור לאיפוס
                </button>
            </div>

            <BackToLogin />
        </form>
    </AuthSplitCard>
</template>
