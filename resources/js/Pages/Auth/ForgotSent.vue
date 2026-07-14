<script setup>
// A5 הקישור נשלח — reset-link-sent confirmation. The email arrives as an
// Inertia prop (?email=… query, or server-provided once the backend exists).
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthBg from '@/Components/auth/AuthBg.vue';
import { visit } from '@/lib/routes';

defineProps({
    email: { type: String, default: '' },
});
</script>

<template>
    <Head title="הקישור נשלח" />
    <div
        data-screen-label="A5 הקישור נשלח"
        :style="{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--bg)', position: 'relative',
        }"
    >
        <AuthBg />
        <div
            class="card"
            :style="{
                position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px',
                padding: '44px 40px 36px', textAlign: 'center',
                boxShadow: '0 1px 2px rgba(31,46,29,0.06), 0 24px 70px rgba(20,32,18,0.30)',
            }"
        >
            <div
                :style="{
                    width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 22px',
                    background: 'var(--accent-tint)', border: '1px solid var(--accent-tint-strong)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }"
            >
                <Icon name="mail" :size="32" color="var(--accent)" :stroke="2" />
            </div>
            <h1 :style="{ margin: '0 0 12px', fontSize: '22px', fontWeight: 600 }">בדקו את תיבת הדוא״ל</h1>
            <p :style="{ margin: '0 0 8px', fontSize: '14.5px', lineHeight: 1.7, color: 'var(--ink-3)', textWrap: 'pretty' }">
                אם קיים חשבון המשויך לכתובת
                <template v-if="email"> <span dir="ltr" :style="{ fontWeight: 600, color: 'var(--ink-2)' }">{{ email }}</span>, </template>
                <template v-else> שהזנת, </template>
                נשלח אליו קישור לאיפוס הסיסמה. הקישור תקף ל־60 דקות.
            </p>
            <p :style="{ margin: '0 0 28px', fontSize: '12.5px', lineHeight: 1.6, color: 'var(--ink-4)', textWrap: 'pretty' }">
                לא קיבלתם? בדקו את תיקיית הספאם או נסו שוב בעוד מספר דקות.
            </p>
            <button class="btn btn--primary" style="width: 100%" @click="visit('login')">
                חזרה לכניסה
            </button>
            <!-- Prototype shortcut: the email link can't be clicked here, so simulate
                 landing on the reset-password page.
                 TODO(backend): remove once the real reset mail carries the tokenized link. -->
            <div :style="{ marginTop: '18px', paddingTop: '16px', borderTop: '1px dashed var(--line)' }">
                <a :style="{ fontSize: '12.5px', color: 'var(--ink-4)', cursor: 'pointer' }" @click="visit('reset')">
                    הדגמה: פתחו את הקישור מהמייל ←
                </a>
            </div>
        </div>
    </div>
</template>
