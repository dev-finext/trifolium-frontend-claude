<script setup>
// A4 שכחתי סיסמה — request a password-reset link by email.
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthInput from '@/Components/auth/AuthInput.vue';
import AuthSplitCard from '@/Components/auth/AuthSplitCard.vue';
import BackToLogin from '@/Components/auth/BackToLogin.vue';
import { isEmail } from '@/Components/auth/validators';
import { visit } from '@/lib/routes';

const email = ref('');
const err = ref('');

// TODO(backend): POST /forgot-password; the server sends the reset mail and
// redirects to the confirmation screen with the email echoed back.
function submit() {
    if (!email.value.trim()) { err.value = 'נא להזין כתובת דוא״ל'; return; }
    if (!isEmail(email.value)) { err.value = 'כתובת דוא״ל אינה תקינה'; return; }
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
        <form @submit.prevent="submit">
            <span
                :style="{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
                }"
            ><Icon name="lock" :size="22" color="var(--accent)" /></span>
            <h1 :style="{ margin: 0, fontSize: '23px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }">
                שחזור סיסמה
            </h1>
            <p class="page-sub" :style="{ margin: '8px 0 32px', textWrap: 'pretty', lineHeight: 1.7 }">
                הזינו את כתובת הדוא״ל המשויכת לחשבון. אם קיים חשבון תואם, נשלח אליו קישור לאיפוס הסיסמה.
            </p>

            <div :style="{ display: 'flex', flexDirection: 'column', gap: '18px' }">
                <AuthInput
                    label="כתובת דוא״ל" icon="mail" type="email"
                    :model-value="email" placeholder="name@example.com"
                    auto-complete="email" :error="err"
                    @update:model-value="onInput"
                />
                <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 6px">
                    שלחו לי קישור לאיפוס
                </button>
            </div>

            <BackToLogin />
        </form>
    </AuthSplitCard>
</template>
