<script setup>
// A6 בחירת סיסמה חדשה — set new / initial password ("החלפת סיסמה ראשונית").
// Reached from the email reset link, and used for first-time password setup.
import { computed, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthSplitCard from '@/Components/auth/AuthSplitCard.vue';
import BackToLogin from '@/Components/auth/BackToLogin.vue';
import PasswordField from '@/Components/auth/PasswordField.vue';
import { visit } from '@/lib/routes';

// Live password-requirement checklist rules.
const RULES = [
    { id: 'len', label: 'לפחות 8 תווים', test: (v) => v.length >= 8 },
    { id: 'letter', label: 'אות אחת לפחות', test: (v) => /[a-zA-Zא-ת]/.test(v) },
    { id: 'digit', label: 'ספרה אחת לפחות', test: (v) => /\d/.test(v) },
];

const pw = ref('');
const confirm = ref('');
const err = ref({});

const allRulesPass = computed(() => RULES.every(r => r.test(pw.value)));

// TODO(backend): POST /reset-password with the token from the email link;
// server-side errors replace this local gating.
function submit() {
    const next = {};
    if (!pw.value) next.pw = 'נא להזין סיסמה חדשה';
    else if (!allRulesPass.value) next.pw = 'הסיסמה אינה עומדת בדרישות';
    if (!confirm.value) next.confirm = 'נא לאשר את הסיסמה';
    else if (pw.value && confirm.value !== pw.value) next.confirm = 'הסיסמאות אינן תואמות';
    err.value = next;
    if (Object.keys(next).length === 0) visit('reset-done');
}

function onPw(v) { pw.value = v; err.value = { ...err.value, pw: undefined }; }
function onConfirm(v) { confirm.value = v; err.value = { ...err.value, confirm: undefined }; }
</script>

<template>
    <Head title="בחירת סיסמה חדשה" />
    <!-- data-screen-label falls through to AuthSplitCard's root element -->
    <AuthSplitCard data-screen-label="A6 בחירת סיסמה חדשה">
        <form @submit.prevent="submit">
            <span
                :style="{
                    width: '46px', height: '46px', borderRadius: '50%',
                    background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px',
                }"
            ><Icon name="lock" :size="22" color="var(--accent)" /></span>
            <h1 :style="{ margin: 0, fontSize: '23px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }">
                בחירת סיסמה חדשה
            </h1>
            <p class="page-sub" :style="{ margin: '8px 0 30px', textWrap: 'pretty', lineHeight: 1.7 }">
                בחרו סיסמה חדשה לחשבונכם. מומלץ להשתמש בסיסמה שאינכם משתמשים בה במקום אחר.
            </p>

            <div :style="{ display: 'flex', flexDirection: 'column', gap: '18px' }">
                <PasswordField
                    label="סיסמה חדשה" :model-value="pw"
                    placeholder="הזינו סיסמה" :error="err.pw || ''"
                    @update:model-value="onPw"
                />

                <!-- live requirement checklist -->
                <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: '-6px' }">
                    <span
                        v-for="r in RULES" :key="r.id"
                        :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: r.test(pw) ? 'var(--accent)' : 'var(--ink-4)', transition: 'color .15s' }"
                    >
                        <span
                            :style="{
                                width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0,
                                border: '1.5px solid ' + (r.test(pw) ? 'var(--accent)' : 'var(--line-strong)'),
                                background: r.test(pw) ? 'var(--accent)' : 'transparent',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                            }"
                        ><Icon v-if="r.test(pw)" name="check" :size="9" color="#fff" :stroke="3" /></span>
                        {{ r.label }}
                    </span>
                </div>

                <PasswordField
                    label="אימות סיסמה" :model-value="confirm"
                    placeholder="הזינו שוב את הסיסמה" :error="err.confirm || ''"
                    @update:model-value="onConfirm"
                />

                <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 6px">
                    שמירת הסיסמה
                </button>
            </div>

            <BackToLogin />
        </form>
    </AuthSplitCard>
</template>
