<script setup>
// שינוי סיסמה — dedicated, standalone password-change page.
// Reached from the profile editor ("שינוי סיסמה" button). Independent screen:
// current password, new password (with live rule checklist) + confirmation.
// Display-only sketch: local state, no real persistence.
import { computed, nextTick, reactive, ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import { visit } from '@/lib/routes';
import Icon from '@/Components/ui/Icon.vue';
import CPPasswordField from '@/Components/profile/CPPasswordField.vue';
import { PASSWORD_RULES, validate } from '@/Components/auth/password-rules';

// This screen renders full-bleed without the navbar/footer chrome, so it
// opts out of the default app layout (see resources/js/app.js).
defineOptions({ layout: null });

// F13 — shared password policy (was a duplicated local CP_RULES); also drives
// the live checklist below.
const CP_RULES = PASSWORD_RULES;

const current = ref('');
const next = ref('');
const confirm = ref('');
const err = reactive({ current: undefined, next: undefined, confirm: undefined });
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
function setCurrent(v) { current.value = v; err.current = undefined; }
function setNext(v) { next.value = v; err.next = undefined; }
function setConfirm(v) { confirm.value = v; err.confirm = undefined; }

// TODO(backend): post to the password-change endpoint; `done` then keys off
// the server response (and the current-password check happens server-side).
function submit() {
    const nx = {};
    if (!current.value) nx.current = 'נא להזין את הסיסמה הנוכחית';
    if (!next.value) nx.next = 'נא להזין סיסמה חדשה';
    else if (!allRulesPass.value) nx.next = 'הסיסמה אינה עומדת בדרישות';
    // F13 — the new password must differ from the current one.
    else if (current.value && next.value === current.value) nx.next = 'הסיסמה החדשה חייבת להיות שונה מהנוכחית';
    if (!confirm.value) nx.confirm = 'נא לאשר את הסיסמה';
    else if (next.value && confirm.value !== next.value) nx.confirm = 'הסיסמאות אינן תואמות';
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
        if (nx.current) currentField.value?.focus();
        else if (nx.next) nextField.value?.focus();
        else if (nx.confirm) confirmField.value?.focus();
    });
}
</script>

<template>
    <Head title="שינוי סיסמה" />
    <div
        data-screen-label="שינוי סיסמה"
        :style="{
            minHeight: '100vh', background: 'var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }"
    >
        <div class="card" style="width: 100%; max-width: 480px; padding: 40px 40px 36px">

            <div v-if="done" style="text-align: center">
                <div
                    :style="{
                        width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 22px',
                        background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }"
                >
                    <Icon name="check" :size="34" color="var(--accent)" :stroke="2.4" />
                </div>
                <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 600">הסיסמה עודכנה</h1>
                <p style="margin: 0 0 28px; font-size: 14.5px; line-height: 1.7; color: var(--ink-3); text-wrap: pretty">
                    הסיסמה שלך הוחלפה בהצלחה. השתמש בסיסמה החדשה בכניסה הבאה למערכת.
                </p>
                <button class="btn btn--primary" style="min-width: 180px" @click="goProfile">
                    חזרה לפרטים האישיים
                </button>
            </div>

            <form novalidate v-else @submit.prevent="submit">
                <a
                    style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-3); cursor: pointer; margin-bottom: 22px"
                    @click="goProfile"
                >
                    <Icon name="arrow_right" :size="15" /> חזרה לפרטים האישיים
                </a>

                <span
                    :style="{
                        width: '46px', height: '46px', borderRadius: '50%',
                        background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                    }"
                ><Icon name="lock" :size="22" color="var(--accent)" /></span>

                <h1 style="margin: 0; font-size: 23px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.3">
                    שינוי סיסמה
                </h1>
                <p class="page-sub" style="margin: 8px 0 30px; text-wrap: pretty; line-height: 1.7">
                    הזן את סיסמתך הנוכחית, ולאחר מכן בחר סיסמה חדשה לחשבונך.
                </p>

                <div style="display: flex; flex-direction: column; gap: 18px">
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

                    <div style="height: 1px; background: var(--line); margin: 2px 0" />

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
                    <div style="display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: -6px">
                        <span
                            v-for="r in CP_RULES"
                            :key="r.id"
                            :style="{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12.5px',
                                color: r.test(next) ? 'var(--accent)' : 'var(--ink-4)', transition: 'color .15s',
                            }"
                        >
                            <span
                                :style="{
                                    width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0,
                                    border: '1.5px solid ' + (r.test(next) ? 'var(--accent)' : 'var(--line-strong)'),
                                    background: r.test(next) ? 'var(--accent)' : 'transparent',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                                }"
                            ><Icon v-if="r.test(next)" name="check" :size="9" color="#fff" :stroke="3" /></span>
                            {{ r.label }}
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

                    <div style="display: flex; gap: 12px; margin-top: 6px">
                        <button type="button" class="btn btn--ghost" style="flex: 0 0 auto" @click="goProfile">ביטול</button>
                        <button type="submit" class="btn btn--primary" style="flex: 1">
                            <Icon name="check" :size="16" :stroke="2.2" /> שמירת הסיסמה
                        </button>
                    </div>
                </div>
            </form>

        </div>
    </div>
</template>
