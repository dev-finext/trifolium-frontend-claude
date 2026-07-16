<script setup>
// A5 הקישור נשלח — reset-link-sent confirmation. The email arrives as an
// Inertia prop (?email=… query, or server-provided once the backend exists).
import { Head } from '@inertiajs/vue3';
import AuthBg from '@/components/shared/AuthBg.vue';
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';

defineProps({
    email: { type: String, default: '' },
});
</script>

<template>
    <Head title="הקישור נשלח" />
    <div
        data-screen-label="A5 הקישור נשלח"
        class="relative flex min-h-screen items-center justify-center bg-bg p-[24px]"
    >
        <AuthBg />
        <div
            class="card relative z-[1] w-full max-w-[460px] px-[40px] pt-[44px] pb-[36px] text-center shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
        >
            <div
                class="mx-auto mt-0 mb-[22px] inline-flex h-[72px] w-[72px] items-center justify-center rounded-[50%] border border-accent-tint-strong bg-accent-tint"
            >
                <Icon
                    name="mail"
                    :size="32"
                    color="var(--accent)"
                    :stroke="2"
                />
            </div>
            <h1 class="mx-0 mt-0 mb-[12px] text-[22px] font-semibold">
                בדקו את תיבת הדוא״ל
            </h1>
            <p
                class="mx-0 mt-0 mb-[8px] text-[14.5px] leading-[1.7] text-pretty text-ink-3"
            >
                אם קיים חשבון המשויך לכתובת
                <template v-if="email">
                    <span dir="ltr" class="font-semibold text-ink-2">{{
                        email
                    }}</span
                    >,
                </template>
                <template v-else> שהזנת, </template>
                נשלח אליו קישור לאיפוס הסיסמה. הקישור תקף ל־60 דקות.
            </p>
            <p
                class="mx-0 mt-0 mb-[28px] text-[12.5px] leading-[1.6] text-pretty text-ink-4"
            >
                לא קיבלתם? בדקו את תיקיית הספאם או נסו שוב בעוד מספר דקות.
            </p>
            <button class="btn btn--primary w-full" @click="visit('login')">
                חזרה לכניסה
            </button>
            <!-- Prototype shortcut: the email link can't be clicked here, so simulate
                 landing on the reset-password page.
                 TODO(backend): remove once the real reset mail carries the tokenized link. -->
            <div
                class="mt-[18px] pt-[16px] [border-top:1px_dashed_var(--line)]"
            >
                <a
                    class="cursor-pointer text-[12.5px] text-ink-4"
                    @click="visit('reset')"
                >
                    הדגמה: פתחו את הקישור מהמייל ←
                </a>
            </div>
        </div>
    </div>
</template>
