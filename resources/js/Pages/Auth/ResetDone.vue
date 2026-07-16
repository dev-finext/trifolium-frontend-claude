<script setup>
// A7 הסיסמה עודכנה — password-updated confirmation.
import { Head } from '@inertiajs/vue3';
import Icon from '@/Components/ui/Icon.vue';
import AuthBg from '@/Components/auth/AuthBg.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <Head title="הסיסמה עודכנה" />
    <div
        data-screen-label="A7 הסיסמה עודכנה"
        class="relative flex min-h-screen items-center justify-center p-[24px] bg-bg"
    >
        <AuthBg />
        <div
            class="card relative z-[1] w-full max-w-[460px] pt-[44px] px-[40px] pb-[40px] text-center shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
        >
            <div
                class="inline-flex items-center justify-center w-[72px] h-[72px] mt-0 mx-auto mb-[22px] bg-accent-tint border border-accent-tint-strong rounded-[50%]"
            >
                <Icon name="check" :size="34" color="var(--accent)" :stroke="2.4" />
            </div>
            <h1 class="mt-0 mx-0 mb-[12px] text-[22px] font-semibold">הסיסמה עודכנה</h1>
            <p class="mt-0 mx-0 mb-[28px] text-[14.5px] leading-[1.7] text-ink-3 text-pretty">
                הסיסמה החדשה נשמרה בהצלחה. ניתן להתחבר למערכת באמצעות הסיסמה החדשה.
            </p>
            <button class="btn btn--primary w-full" @click="visit('login')">
                כניסה למערכת
            </button>
        </div>
    </div>
</template>
