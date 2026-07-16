<script setup>
// Shared split card (form side + brand panel) — matches Login chrome,
// reused by the password-recovery screens. Default slot fills the form side.
import AuthBg from '@/Components/auth/AuthBg.vue';
import Brandmark from '@/Components/auth/Brandmark.vue';

defineProps({
    maxWidth: { type: Number, default: 920 },
});
</script>

<template>
    <div class="relative flex items-center justify-center min-h-[100vh] p-[24px] bg-bg">
        <AuthBg />
        <div
            class="card relative z-[1] grid grid-cols-[1.05fr_0.95fr] w-full shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
            :style="{ maxWidth: `${maxWidth}px` }"
        >
            <div class="pt-[46px] px-[48px] pb-[44px]"><slot /></div>
            <div class="flex flex-col items-center justify-center gap-[18px] py-[48px] px-[36px] text-center text-[#fff] bg-accent">
                <Brandmark tone="light" :height="108" />
                <div class="w-[40px] h-[1px] bg-[rgba(255,255,255,0.3)]" />
                <p class="m-0 text-[15px] font-normal tracking-[0.02em] text-[rgba(255,255,255,0.86)]">
                    בית מרקחת לצמחי מרפא
                </p>
            </div>
        </div>
    </div>
</template>
