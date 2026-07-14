<script setup>
// A1 כניסה — login screen: split card with the form on the start side and the
// brand panel on the accent side, over the soft auth backdrop.
import { ref } from 'vue';
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthBg from '@/Components/auth/AuthBg.vue';
import Brandmark from '@/Components/auth/Brandmark.vue';
import AuthInput from '@/Components/auth/AuthInput.vue';
import ErrMsg from '@/Components/auth/ErrMsg.vue';
import { visit } from '@/lib/routes';

// Prototype demo credentials pre-filled; the backend will drop these defaults.
const username = ref('10038617');
const password = ref('1234');
const show = ref(false);
const err = ref({});

// TODO(backend): replace with Inertia useForm().post('/login'); on success the
// server redirects home and errors come back as validation props.
function submit() {
    const next = {};
    if (!username.value.trim()) next.username = 'נא להזין שם משתמש';
    else if (!/^\d+$/.test(username.value.trim())) next.username = 'שם המשתמש מורכב מספרות בלבד';
    if (!password.value) next.password = 'נא להזין סיסמה';
    err.value = next;
    if (Object.keys(next).length === 0) visit('home');
}
</script>

<template>
    <Head title="כניסה" />
    <div
        data-screen-label="A1 כניסה"
        :style="{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--bg)', position: 'relative',
        }"
    >
        <AuthBg />
        <div
            class="card"
            :style="{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: '920px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr',
                boxShadow: '0 1px 2px rgba(31,46,29,0.06), 0 24px 70px rgba(20,32,18,0.30)',
            }"
        >
            <!-- Form side -->
            <form style="padding: 46px 48px 44px" @submit.prevent="submit">
                <h1 :style="{ margin: 0, fontSize: '23px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }">
                    מערכת רוקחית – בית מרקחת טריפוליום
                </h1>
                <p class="page-sub" style="margin: 8px 0 32px">
                    אנא הכניסו את שם המשתמש והסיסמה
                </p>

                <div :style="{ display: 'flex', flexDirection: 'column', gap: '18px' }">
                    <AuthInput
                        v-model="username"
                        label="שם משתמש" icon="user" numeric placeholder="מספר לקוח"
                        input-mode="numeric" auto-complete="username" :error="err.username || ''"
                    />
                    <div>
                        <label class="field-label">סיסמה</label>
                        <div class="input-wrap">
                            <span class="lead-icon"><Icon name="lock" :size="16" /></span>
                            <input
                                v-model="password"
                                class="input with-icon" :type="show ? 'text' : 'password'"
                                placeholder="הסיסמה שלכם" autocomplete="current-password"
                                :style="{ paddingLeft: '40px', ...(err.password ? { borderColor: 'var(--danger)' } : {}) }"
                            />
                            <button
                                type="button"
                                :aria-label="show ? 'הסתר סיסמה' : 'הצג סיסמה'"
                                :style="{
                                    position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
                                    background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer',
                                    display: 'inline-flex', color: 'var(--ink-3)',
                                }"
                                @click="show = !show"
                            ><Icon :name="show ? 'eye_off' : 'eye'" :size="17" /></button>
                        </div>
                        <ErrMsg v-if="err.password">{{ err.password }}</ErrMsg>
                    </div>

                    <button type="submit" class="btn btn--primary" style="width: 100%; margin-top: 6px">
                        כניסה למערכת
                    </button>
                </div>

                <div :style="{ marginTop: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }">
                    <a
                        :style="{ fontSize: '14px', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }"
                        @click="visit('register')"
                    >אין לכם חשבון? לחצו להרשמה</a>
                    <a
                        :style="{ fontSize: '13.5px', color: 'var(--ink-3)', cursor: 'pointer' }"
                        @click="visit('forgot')"
                    >שכחתי סיסמה</a>
                </div>
            </form>

            <!-- Brand panel -->
            <div
                :style="{
                    background: 'var(--accent)', color: '#fff',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '18px', padding: '48px 36px', textAlign: 'center',
                }"
            >
                <Brandmark tone="light" :height="108" />
                <div :style="{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }" />
                <p :style="{ margin: 0, fontSize: '15px', fontWeight: 400, color: 'rgba(255,255,255,0.86)', letterSpacing: '0.02em' }">
                    בית מרקחת לצמחי מרפא
                </p>
            </div>
        </div>
    </div>
</template>
