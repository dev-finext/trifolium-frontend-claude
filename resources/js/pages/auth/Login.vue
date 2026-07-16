<script setup>
// A1 כניסה — login screen: split card with the form on the start side and the
// brand panel on the accent side, over the soft auth backdrop.
import { Head } from '@inertiajs/vue3';
import { nextTick, ref, useId } from 'vue';
import AuthBg from '@/components/shared/AuthBg.vue';
import Brandmark from '@/components/shared/Brandmark.vue';
import AuthInput from '@/components/ui/AuthInput.vue';
import ErrMsg from '@/components/ui/ErrMsg.vue';
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';

// F1 — start empty; no credentials are shipped in the bundle.
const username = ref('');
const password = ref('');
const show = ref(false);
const err = ref({});

// Field refs for F2 (move focus to the first invalid field on failed submit).
const usernameField = ref(null);
const passwordEl = ref(null);

// X1/X2 — id to wire the inline password label/input/error.
const pwUid = useId();
const pwId = `${pwUid}-input`;
const pwErrId = `${pwUid}-error`;

// TODO(backend): replace with Inertia useForm().post('/login'); on success the
// server redirects home and errors come back as validation props.
function submit() {
    const next = {};

    if (!username.value.trim()) {
        next.username = 'נא להזין שם משתמש';
    } else if (!/^\d+$/.test(username.value.trim())) {
        next.username = 'שם המשתמש מורכב מספרות בלבד';
    }

    if (!password.value) {
        next.password = 'נא להזין סיסמה';
    }

    err.value = next;

    if (Object.keys(next).length === 0) {
        visit('home');

        return;
    }

    // F2 — focus the first invalid field so the user lands on the problem.
    nextTick(() => {
        if (next.username) {
            usernameField.value?.focus();
        } else if (next.password) {
            passwordEl.value?.focus();
        }
    });
}
</script>

<template>
    <Head title="כניסה" />
    <div
        data-screen-label="A1 כניסה"
        class="relative flex min-h-screen items-center justify-center bg-bg p-[24px]"
    >
        <AuthBg />
        <div
            class="card relative z-[1] grid w-full max-w-[920px] grid-cols-[1.05fr_0.95fr] shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
        >
            <!-- Form side -->
            <form
                novalidate
                class="px-[48px] pt-[46px] pb-[44px]"
                @submit.prevent="submit"
            >
                <h1
                    class="m-0 text-[23px] leading-[1.3] font-semibold tracking-[-0.01em]"
                >
                    מערכת רוקחית – בית מרקחת טריפוליום
                </h1>
                <p class="page-sub mx-0 mt-[8px] mb-[32px]">
                    אנא הכניסו את שם המשתמש והסיסמה
                </p>

                <div class="flex flex-col gap-[18px]">
                    <AuthInput
                        ref="usernameField"
                        v-model="username"
                        label="שם משתמש"
                        icon="user"
                        numeric
                        placeholder="מספר לקוח"
                        input-mode="numeric"
                        auto-complete="username"
                        enterkeyhint="next"
                        :error="err.username || ''"
                    />
                    <div>
                        <label class="field-label" :for="pwId">סיסמה</label>
                        <div class="input-wrap">
                            <span class="lead-icon"
                                ><Icon name="lock" :size="16"
                            /></span>
                            <input
                                :id="pwId"
                                ref="passwordEl"
                                v-model="password"
                                class="input with-icon pl-[40px]"
                                :type="show ? 'text' : 'password'"
                                placeholder="הסיסמה שלכם"
                                autocomplete="current-password"
                                enterkeyhint="go"
                                :aria-invalid="
                                    err.password ? 'true' : undefined
                                "
                                :aria-describedby="
                                    err.password ? pwErrId : undefined
                                "
                                :class="err.password ? 'border-danger' : ''"
                            />
                            <button
                                type="button"
                                :aria-label="show ? 'הסתר סיסמה' : 'הצג סיסמה'"
                                class="absolute top-1/2 left-[8px] inline-flex -translate-y-1/2 cursor-pointer border-none bg-transparent p-[4px] text-ink-3"
                                @click="show = !show"
                            >
                                <Icon
                                    :name="show ? 'eye_off' : 'eye'"
                                    :size="17"
                                />
                            </button>
                        </div>
                        <ErrMsg
                            v-if="err.password"
                            :id="pwErrId"
                            role="alert"
                            >{{ err.password }}</ErrMsg
                        >
                    </div>

                    <button
                        type="submit"
                        class="btn btn--primary mt-[6px] w-full"
                    >
                        כניסה למערכת
                    </button>
                </div>

                <div class="mt-[26px] flex flex-col items-center gap-[12px]">
                    <a
                        class="cursor-pointer text-[14px] font-semibold text-accent"
                        @click="visit('register')"
                        >אין לכם חשבון? לחצו להרשמה</a
                    >
                    <a
                        class="cursor-pointer text-[13.5px] text-ink-3"
                        @click="visit('forgot')"
                        >שכחתי סיסמה</a
                    >
                </div>
            </form>

            <!-- Brand panel -->
            <div
                class="flex flex-col items-center justify-center gap-[18px] bg-accent px-[36px] py-[48px] text-center text-white"
            >
                <Brandmark tone="light" :height="108" />
                <div class="h-[1px] w-[40px] bg-[rgba(255,255,255,0.3)]" />
                <p
                    class="m-0 text-[15px] font-normal tracking-[0.02em] text-[rgba(255,255,255,0.86)]"
                >
                    בית מרקחת לצמחי מרפא
                </p>
            </div>
        </div>
    </div>
</template>
