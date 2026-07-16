<script setup>
// Shared split card (form side + brand panel) — matches Login chrome,
// reused by the password-recovery screens. Default slot fills the form side.
import AuthBg from '@/components/shared/AuthBg.vue';
import Brandmark from '@/components/shared/Brandmark.vue';

defineProps({
    maxWidth: { type: Number, default: 920 },
});
</script>

<template>
    <div
        class="relative flex min-h-[100vh] items-center justify-center bg-bg p-[24px]"
    >
        <AuthBg />
        <div
            class="card relative z-[1] grid w-full grid-cols-[1.05fr_0.95fr] shadow-[0_1px_2px_rgba(31,46,29,0.06),0_24px_70px_rgba(20,32,18,0.30)]"
            :style="{ maxWidth: `${maxWidth}px` }"
        >
            <div class="px-[48px] pt-[46px] pb-[44px]"><slot /></div>
            <div
                class="flex flex-col items-center justify-center gap-[18px] bg-accent px-[36px] py-[48px] text-center text-[#fff]"
            >
                <Brandmark tone="light" :height="108" />
                <div class="h-[1px] w-[40px] bg-[rgba(255,255,255,0.3)]" />
                <p
                    class="m-0 text-[15px] font-normal tracking-[0.02em] text-[rgba(255,255,255,0.86)]"
                >
                    בית מרקחת לצמחי מרפא
                </p>
            </div>
        </div>
    </div>
</template>
