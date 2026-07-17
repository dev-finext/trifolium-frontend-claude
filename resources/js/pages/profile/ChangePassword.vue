<script setup>
// שינוי סיסמה — dedicated, standalone password-change page.
// Reached from the profile editor ("שינוי סיסמה" button). Independent screen:
// current password, new password (with live rule checklist) + confirmation.
// Display-only sketch: local state, no real persistence.
import { Head } from '@inertiajs/vue3';
import { computed, nextTick, reactive, ref } from 'vue';
import CPPasswordField from '@/components/shared/profile/CPPasswordField.vue';
import Icon from '@/components/ui/Icon.vue';
import { PASSWORD_RULES, validate } from '@/lib/passwordRules';
import { visit } from '@/lib/routes';

// This screen renders full-bleed without the navbar/footer chrome, so it
// opts out of the default app layout (see resources/js/app.js).
defineOptions({ layout: null });

// F13 — shared password policy (was a duplicated local CP_RULES); also drives
// the live checklist below.
const CP_RULES = PASSWORD_RULES;

const current = ref('');
const next = ref('');
const confirm = ref('');
const err = reactive({
    current: undefined,
    next: undefined,
    confirm: undefined,
});
const done = ref(false);

const currentField = ref(null);
const nextField = ref(null);
const confirmField = ref(null);

const allRulesPass = computed(() => validate(next.value).valid);

// Inertia resets scroll on visit, so no explicit scrollTo here.
function goProfile() {
    visit('profile');
}

// Typing in a field clears its error, as in the prototype.
function setCurrent(v) {
    current.value = v;
    err.current = undefined;
}
function setNext(v) {
    next.value = v;
    err.next = undefined;
}
function setConfirm(v) {
    confirm.value = v;
    err.confirm = undefined;
}

// TODO(backend): post to the password-change endpoint; `done` then keys off
// the server response (and the current-password check happens server-side).
function submit() {
    const nx = {};

    if (!current.value) {
        nx.current = 'נא להזין את הסיסמה הנוכחית';
    }

    if (!next.value) {
        nx.next = 'נא להזין סיסמה חדשה';
    } else if (!allRulesPass.value) {
        nx.next = 'הסיסמה אינה עומדת בדרישות';
    } else if (current.value && next.value === current.value) {
        // F13 — the new password must differ from the current one.
        nx.next = 'הסיסמה החדשה חייבת להיות שונה מהנוכחית';
    }

    if (!confirm.value) {
        nx.confirm = 'נא לאשר את הסיסמה';
    } else if (next.value && confirm.value !== next.value) {
        nx.confirm = 'הסיסמאות אינן תואמות';
    }

    err.current = nx.current;
    err.next = nx.next;
    err.confirm = nx.confirm;

    if (Object.keys(nx).length === 0) {
        done.value = true;
        window.scrollTo(0, 0);

        return;
    }

    // Focus the first invalid field.
    nextTick(() => {
        if (nx.current) {
            currentField.value?.focus();
        } else if (nx.next) {
            nextField.value?.focus();
        } else if (nx.confirm) {
            confirmField.value?.focus();
        }
    });
}
</script>

<template>
    <Head title="שינוי סיסמה" />
    <div
        data-screen-label="שינוי סיסמה"
        class="cp-shell flex min-h-[100vh] items-center justify-center bg-bg p-[24px]"
    >
        <div class="card w-full max-w-[480px] p-[40px] pb-[36px]">
            <div v-if="done" class="text-center">
                <div
                    class="mx-auto mt-0 mb-[22px] inline-flex h-[72px] w-[72px] items-center justify-center rounded-full border border-accent-tint-strong bg-accent-tint"
                >
                    <Icon
                        name="check"
                        :size="34"
                        color="var(--accent)"
                        :stroke="2.4"
                    />
                </div>
                <h1 class="m-0 mb-[12px] text-[22px] font-semibold">
                    הסיסמה עודכנה
                </h1>
                <p
                    class="m-0 mb-[28px] text-[14.5px] leading-[1.7] text-pretty text-ink-3"
                >
                    הסיסמה שלך הוחלפה בהצלחה. השתמש בסיסמה החדשה בכניסה הבאה
                    למערכת.
                </p>
                <button
                    class="btn btn--primary min-w-[180px]"
                    @click="goProfile"
                >
                    חזרה לפרטים האישיים
                </button>
            </div>

            <form novalidate v-else @submit.prevent="submit">
                <a
                    class="mb-[22px] inline-flex cursor-pointer items-center gap-[6px] text-[13px] text-ink-3"
                    @click="goProfile"
                >
                    <Icon name="arrow_right" :size="15" /> חזרה לפרטים האישיים
                </a>

                <span
                    class="mb-[16px] inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-accent-tint-strong bg-accent-tint"
                    ><Icon name="lock" :size="22" color="var(--accent)"
                /></span>

                <h1
                    class="m-0 text-[23px] leading-[1.3] font-semibold tracking-[-0.01em]"
                >
                    שינוי סיסמה
                </h1>
                <p
                    class="page-sub mx-0 mt-[8px] mb-[30px] leading-[1.7] text-pretty"
                >
                    הזן את סיסמתך הנוכחית, ולאחר מכן בחר סיסמה חדשה לחשבונך.
                </p>

                <div class="flex flex-col gap-[18px]">
                    <CPPasswordField
                        ref="currentField"
                        label="סיסמה נוכחית"
                        :model-value="current"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        enterkeyhint="next"
                        :error="err.current"
                        @update:model-value="setCurrent"
                    />

                    <div class="mx-0 my-[2px] h-[1px] bg-line" />

                    <CPPasswordField
                        ref="nextField"
                        label="סיסמה חדשה"
                        :model-value="next"
                        placeholder="הזן סיסמה חדשה"
                        enterkeyhint="next"
                        :error="err.next"
                        @update:model-value="setNext"
                    />

                    <!-- live requirement checklist -->
                    <div
                        class="mt-[-6px] flex flex-wrap gap-x-[16px] gap-y-[6px]"
                    >
                        <span
                            v-for="rule in CP_RULES"
                            :key="rule.id"
                            class="inline-flex items-center gap-[6px] text-[12.5px] transition-[color] duration-150"
                            :class="
                                rule.test(next) ? 'text-accent' : 'text-ink-4'
                            "
                        >
                            <span
                                class="inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-150"
                                :class="
                                    rule.test(next)
                                        ? 'border-accent bg-accent'
                                        : 'border-line-strong bg-transparent'
                                "
                                ><Icon
                                    v-if="rule.test(next)"
                                    name="check"
                                    :size="9"
                                    color="#fff"
                                    :stroke="3"
                            /></span>
                            {{ rule.label }}
                        </span>
                    </div>

                    <CPPasswordField
                        ref="confirmField"
                        label="אימות סיסמה חדשה"
                        :model-value="confirm"
                        placeholder="הזן שוב את הסיסמה החדשה"
                        enterkeyhint="done"
                        :error="err.confirm"
                        @update:model-value="setConfirm"
                    />

                    <div class="mt-[6px] flex gap-[12px]">
                        <button
                            type="button"
                            class="btn btn--ghost flex-[0_0_auto]"
                            @click="goProfile"
                        >
                            ביטול
                        </button>
                        <button type="submit" class="btn btn--primary flex-1">
                            <Icon name="check" :size="16" :stroke="2.2" /> שמירת
                            הסיסמה
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
