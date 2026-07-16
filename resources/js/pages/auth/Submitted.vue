<script setup>
// A3 בקשה נשלחה — registration submitted / pending manual review.
import { Head } from '@inertiajs/vue3';
import AuthBg from '@/components/shared/AuthBg.vue';
import Icon from '@/components/ui/Icon.vue';
import { visit } from '@/lib/routes';
</script>

<template>
    <Head title="בקשה נשלחה" />
    <div
        data-screen-label="A3 בקשה נשלחה"
        class="relative flex min-h-screen items-center justify-center bg-bg p-[24px]"
    >
        <AuthBg />
        <div
            class="card relative z-[1] w-full max-w-[460px] px-[40px] pt-[44px] pb-[40px] text-center shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
        >
            <div
                class="mx-auto mt-0 mb-[22px] inline-flex h-[72px] w-[72px] items-center justify-center rounded-[50%] border border-accent-tint-strong bg-accent-tint"
            >
                <Icon
                    name="check"
                    :size="34"
                    color="var(--accent)"
                    :stroke="2.4"
                />
            </div>
            <h1 class="mx-0 mt-0 mb-[12px] text-[22px] font-semibold">
                הבקשה נשלחה לאישור
            </h1>
            <p
                class="mx-0 mt-0 mb-[28px] text-[14.5px] leading-[1.7] text-pretty text-ink-3"
            >
                פרטיך התקבלו ועוברים בדיקה ידנית של צוות בית המרקחת. נעדכן אותך
                במייל ברגע שהחשבון יאושר, או אם נצטרך פרטים נוספים.
            </p>
            <button
                class="btn btn--ghost min-w-[160px]"
                @click="visit('login')"
            >
                חזרה לכניסה
            </button>
        </div>
    </div>
</template>
