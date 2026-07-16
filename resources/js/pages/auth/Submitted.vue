<script setup>
// A3 בקשה נשלחה — registration submitted / pending manual review.
import { Head } from '@inertiajs/vue3';
import Icon from '@/components/ui/Icon.vue';
import AuthBg from '@/components/shared/AuthBg.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <Head title="בקשה נשלחה" />
    <div
        data-screen-label="A3 בקשה נשלחה"
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
            <h1 class="mt-0 mx-0 mb-[12px] text-[22px] font-semibold">הבקשה נשלחה לאישור</h1>
            <p class="mt-0 mx-0 mb-[28px] text-[14.5px] leading-[1.7] text-ink-3 text-pretty">
                פרטיך התקבלו ועוברים בדיקה ידנית של צוות בית המרקחת. נעדכן אותך במייל ברגע שהחשבון יאושר, או אם נצטרך פרטים נוספים.
            </p>
            <button class="btn btn--ghost min-w-[160px]" @click="visit('login')">
                חזרה לכניסה
            </button>
        </div>
    </div>
</template>
