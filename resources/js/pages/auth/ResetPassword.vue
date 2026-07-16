<script setup>
// A6 בחירת סיסמה חדשה — set new / initial password ("החלפת סיסמה ראשונית").
// Reached from the email reset link, and used for first-time password setup.
import { Head } from '@inertiajs/vue3';
import { computed, nextTick, ref } from 'vue';
import AuthSplitCard from '@/components/shared/auth/AuthSplitCard.vue';
import BackToLogin from '@/components/shared/auth/BackToLogin.vue';
import Icon from '@/components/ui/Icon.vue';
import PasswordField from '@/components/ui/PasswordField.vue';
import { PASSWORD_RULES, validate } from '@/lib/passwordRules';
import { visit } from '@/lib/routes';

// F11 — shared password policy; RULES also drive the live checklist below.
const RULES = PASSWORD_RULES;

const pw = ref('');
const confirm = ref('');
const err = ref({});

const pwField = ref(null);
const confirmField = ref(null);

const allRulesPass = computed(() => validate(pw.value).valid);

// TODO(backend): POST /reset-password with the token from the email link;
// server-side errors replace this local gating.
function submit() {
    const next = {};

    if (!pw.value) {
        next.pw = 'נא להזין סיסמה חדשה';
    } else if (!allRulesPass.value) {
        next.pw = 'הסיסמה אינה עומדת בדרישות';
    }

    if (!confirm.value) {
        next.confirm = 'נא לאשר את הסיסמה';
    } else if (pw.value && confirm.value !== pw.value) {
        next.confirm = 'הסיסמאות אינן תואמות';
    }

    err.value = next;

    if (Object.keys(next).length === 0) {
        visit('reset-done');

        return;
    }

    // Focus the first invalid field.
    nextTick(() => {
        if (next.pw) {
            pwField.value?.focus();
        } else if (next.confirm) {
            confirmField.value?.focus();
        }
    });
}

function onPw(v) {
    pw.value = v;
    err.value = { ...err.value, pw: undefined };
}
function onConfirm(v) {
    confirm.value = v;
    err.value = { ...err.value, confirm: undefined };
}
</script>

<template>
    <Head title="בחירת סיסמה חדשה" />
    <!-- data-screen-label falls through to AuthSplitCard's root element -->
    <AuthSplitCard data-screen-label="A6 בחירת סיסמה חדשה">
        <form novalidate @submit.prevent="submit">
            <span
                class="mb-[18px] inline-flex h-[46px] w-[46px] items-center justify-center rounded-[50%] border border-accent-tint-strong bg-accent-tint"
                ><Icon name="lock" :size="22" color="var(--accent)"
            /></span>
            <h1
                class="m-0 text-[23px] leading-[1.3] font-semibold tracking-[-0.01em]"
            >
                בחירת סיסמה חדשה
            </h1>
            <p
                class="page-sub mx-0 mt-[8px] mb-[30px] leading-[1.7] text-pretty"
            >
                בחרו סיסמה חדשה לחשבונכם. מומלץ להשתמש בסיסמה שאינכם משתמשים בה
                במקום אחר.
            </p>

            <div class="flex flex-col gap-[18px]">
                <PasswordField
                    ref="pwField"
                    label="סיסמה חדשה"
                    :model-value="pw"
                    placeholder="הזינו סיסמה"
                    :error="err.pw || ''"
                    enterkeyhint="next"
                    @update:model-value="onPw"
                />

                <!-- live requirement checklist -->
                <div class="mt-[-6px] flex flex-wrap gap-x-[16px] gap-y-[6px]">
                    <span
                        v-for="r in RULES"
                        :key="r.id"
                        class="inline-flex items-center gap-[6px] text-[12.5px] transition-[color] duration-150"
                        :class="r.test(pw) ? 'text-accent' : 'text-ink-4'"
                    >
                        <span
                            class="inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[50%] border-[1.5px] transition-all duration-150"
                            :class="
                                r.test(pw)
                                    ? 'border-accent bg-accent'
                                    : 'border-line-strong bg-transparent'
                            "
                            ><Icon
                                v-if="r.test(pw)"
                                name="check"
                                :size="9"
                                color="#fff"
                                :stroke="3"
                        /></span>
                        {{ r.label }}
                    </span>
                </div>

                <PasswordField
                    ref="confirmField"
                    label="אימות סיסמה"
                    :model-value="confirm"
                    placeholder="הזינו שוב את הסיסמה"
                    :error="err.confirm || ''"
                    enterkeyhint="done"
                    @update:model-value="onConfirm"
                />

                <button type="submit" class="btn btn--primary mt-[6px] w-full">
                    שמירת הסיסמה
                </button>
            </div>

            <BackToLogin />
        </form>
    </AuthSplitCard>
</template>
