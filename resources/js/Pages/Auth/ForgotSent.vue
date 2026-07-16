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
        class="relative flex min-h-screen items-center justify-center p-[24px] bg-bg"
    >
        <AuthBg />
        <div
            class="card relative z-[1] w-full max-w-[460px] pt-[44px] px-[40px] pb-[36px] text-center shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
        >
            <div
                class="inline-flex items-center justify-center w-[72px] h-[72px] mt-0 mx-auto mb-[22px] bg-accent-tint border border-accent-tint-strong rounded-[50%]"
            >
                <Icon name="mail" :size="32" color="var(--accent)" :stroke="2" />
            </div>
            <h1 class="mt-0 mx-0 mb-[12px] text-[22px] font-semibold">בדקו את תיבת הדוא״ל</h1>
            <p class="mt-0 mx-0 mb-[8px] text-[14.5px] leading-[1.7] text-ink-3 text-pretty">
                אם קיים חשבון המשויך לכתובת
                <template v-if="email"> <span dir="ltr" class="font-semibold text-ink-2">{{ email }}</span>, </template>
                <template v-else> שהזנת, </template>
                נשלח אליו קישור לאיפוס הסיסמה. הקישור תקף ל־60 דקות.
            </p>
            <p class="mt-0 mx-0 mb-[28px] text-[12.5px] leading-[1.6] text-ink-4 text-pretty">
                לא קיבלתם? בדקו את תיקיית הספאם או נסו שוב בעוד מספר דקות.
            </p>
            <button class="btn btn--primary w-full" @click="visit('login')">
                חזרה לכניסה
            </button>
            <!-- Prototype shortcut: the email link can't be clicked here, so simulate
                 landing on the reset-password page.
                 TODO(backend): remove once the real reset mail carries the tokenized link. -->
            <div class="mt-[18px] pt-[16px] [border-top:1px_dashed_var(--line)]">
                <a class="text-[12.5px] text-ink-4 cursor-pointer" @click="visit('reset')">
                    הדגמה: פתחו את הקישור מהמייל ←
                </a>
            </div>
        </div>
    </div>
</template>
